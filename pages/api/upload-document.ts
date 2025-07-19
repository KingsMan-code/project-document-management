import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false, // Needed to handle multipart/form-data manually
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    try {
      const formData = new FormData();
      formData.append('owner', fields.owner);

      // Handle single or multiple file inputs
      const fileArray = Array.isArray(files.file) ? files.file : [files.file];
      for (const file of fileArray) {
        if (file && file.filepath && file.originalFilename) {
          formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);
        }
      }

      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });

      const result = await response.text();

      res.status(response.status).send(result);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload to Quarkus API' });
    }
  });
}
