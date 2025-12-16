import { PDFDocument } from "pdf-lib";
import React from "react";

export interface UploadDocumentoLocal {
  file: File;
  nomeAtribuido: string;
}

interface HandleUploadParams {
  event: React.ChangeEvent<HTMLInputElement>;
  setDocumentos: React.Dispatch<React.SetStateAction<UploadDocumentoLocal[]>>;
  setFileTypeError: (value: boolean) => void;
  setLoading?: (value: boolean) => void;
  category?: string;
  onCategorySet?: (category: string) => void;
}

const convertImageToPdf = async (file: File): Promise<File | null> => {
  try {
    const pdfDoc = await PDFDocument.create();
    const imageBytes = await file.arrayBuffer();

    let embeddedImage;
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else if (file.type === "image/png") {
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
    const newFile = new File([pdfBlob], file.name.replace(/\.[^.]+$/, ".pdf"), {
      type: "application/pdf",
    });

    return newFile;
  } catch (err) {
    console.error("Erro ao converter imagem em PDF:", err);
    return null;
  }
};

export const handleDocumentUploadHelper = async ({
  event,
  setDocumentos,
  setFileTypeError,
  setLoading,
  category,
  onCategorySet,
}: HandleUploadParams) => {
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
        novosDocumentos.push({ file, nomeAtribuido: file.name });
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
