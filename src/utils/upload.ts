import { PDFDocument } from "pdf-lib";
import React from "react";

export interface UploadDocumentoLocal {
  file: File;
  nomeAtribuido: string;
}

interface HandleUploadParams<T extends string = string> {
  event: React.ChangeEvent<HTMLInputElement>;
  setDocumentos: React.Dispatch<React.SetStateAction<UploadDocumentoLocal[]>>;
  setFileTypeError: (value: boolean) => void;
  setLoading?: (value: boolean) => void;
  category?: T;
  onCategorySet?: (category: T) => void;
}

const SIZE_LIMIT_BYTES = 4 * 1024 * 1024; // 4MB
const MAX_IMAGE_DIMENSION = 1800; // px
const IMAGE_QUALITY = 0.72;

export const formatFileSize = (bytes: number) => {
  if (!bytes && bytes !== 0) return "-";
  const units = ["B", "KB", "MB", "GB"] as const;
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};

const compressImageToJpeg = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSide = Math.max(img.width, img.height);
      const scale = maxSide > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / maxSide : 1;
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context inválido"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Falha ao comprimir imagem"));
            return;
          }
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg" }
          );
          resolve(compressedFile);
        },
        "image/jpeg",
        IMAGE_QUALITY
      );
    };
    img.onerror = () => reject(new Error("Falha ao ler imagem"));
    img.src = URL.createObjectURL(file);
  });
};

const convertImageToPdf = async (file: File): Promise<File | null> => {
  try {
    const source = file.size > SIZE_LIMIT_BYTES ? await compressImageToJpeg(file) : file;
    const pdfDoc = await PDFDocument.create();
    const imageBytes = await source.arrayBuffer();

    let embeddedImage;
    if (source.type === "image/jpeg" || source.type === "image/jpg") {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else if (source.type === "image/png") {
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } else {
      return null;
    }

    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: embeddedImage.width,
      height: embeddedImage.height,
    });

    const pdfBytes = await pdfDoc.save();
    const arrayBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;
    const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });
    const newFile = new File([pdfBlob], source.name.replace(/\.[^.]+$/, ".pdf"), {
      type: "application/pdf",
    });

    console.log(
      `[upload] imagem ${file.name} => antes: ${formatFileSize(file.size)} | depois: ${formatFileSize(
        newFile.size
      )}`
    );

    return newFile;
  } catch (err) {
    console.error("Erro ao converter imagem em PDF:", err);
    return null;
  }
};

const compressPdfIfNeeded = async (file: File): Promise<File> => {
  if (file.size <= SIZE_LIMIT_BYTES) return file;
  try {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((p) => newDoc.addPage(p));
    const newBytes = await newDoc.save();
    const arrayBuffer = newBytes.buffer.slice(
      newBytes.byteOffset,
      newBytes.byteOffset + newBytes.byteLength
    ) as ArrayBuffer;
    const compressed = new File([arrayBuffer], file.name, { type: "application/pdf" });
    console.log(
      `[upload] pdf ${file.name} => antes: ${formatFileSize(file.size)} | depois: ${formatFileSize(
        compressed.size
      )}`
    );
    return compressed;
  } catch (err) {
    console.warn("Compressão de PDF falhou, usando arquivo original", err);
    return file;
  }
};

export const handleDocumentUploadHelper = async <T extends string = string>({
  event,
  setDocumentos,
  setFileTypeError,
  setLoading,
  category,
  onCategorySet,
}: HandleUploadParams<T>) => {
  if (!event.target.files) return;

  setLoading?.(true);
  try {
    const arquivos = Array.from(event.target.files);
    const novosDocumentos: UploadDocumentoLocal[] = [];
    let encontrouTipoInvalido = false;

    for (const file of arquivos) {
      const tipo = file.type;

      if (tipo.startsWith("image/")) {
        const pdfConvertido = await convertImageToPdf(file);
        if (pdfConvertido) {
          novosDocumentos.push({ file: pdfConvertido, nomeAtribuido: pdfConvertido.name });
        }
      } else if (tipo === "application/pdf") {
        const maybeCompressed = await compressPdfIfNeeded(file);
        novosDocumentos.push({ file: maybeCompressed, nomeAtribuido: file.name });
      } else {
        encontrouTipoInvalido = true;
      }
    }

    const ultimoArquivo = arquivos[arquivos.length - 1];
    const ultimoTipo = ultimoArquivo?.type || "";
    if (ultimoTipo.startsWith("image/") || ultimoTipo === "application/pdf") {
      setFileTypeError(false);
    } else if (encontrouTipoInvalido) {
      setFileTypeError(true);
    }

    setDocumentos((prev) => [...prev, ...novosDocumentos]);
    if (category && onCategorySet) {
      onCategorySet(category);
    }
  } finally {
    setLoading?.(false);
  }
};
