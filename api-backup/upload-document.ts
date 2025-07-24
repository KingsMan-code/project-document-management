
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disables Next.js's default body parser (so we can handle multipart/form-data)
export const config = {
  api: {
    bodyParser: false,
  },
};

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'credentials', 'mosinho-mvp-1082bed8cb24.json'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Form parsing failed' });
    }

    const customerIdRaw = fields.customerId;
    const customerId = Array.isArray(customerIdRaw) ? customerIdRaw[0] : customerIdRaw;
    
    const fileRaw = files.document;
    const file = Array.isArray(fileRaw) ? fileRaw[0] : fileRaw;

    if (!file || !customerId) {
      return res.status(400).json({ error: 'Missing file or customer ID' });
    }

    try {
      // 1. Create a folder for the customer
      const folderMetadata = {
        name: customerId,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      const folderId = folder.data.id;

      if (!folderId) {
        throw new Error('Failed to create folder');
      }

      // 2. Upload file to that folder
      const fileMetadata = {
        name: file.originalFilename,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype || undefined,
        body: fs.createReadStream(file.filepath),
      };

      const uploadedFile = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name',
      });

      return res.status(200).json({
        message: 'File uploaded successfully',
        fileId: uploadedFile.data.id,
        fileName: uploadedFile.data.name,
      });
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  });
}
