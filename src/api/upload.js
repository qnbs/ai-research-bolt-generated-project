import { promises as fs } from 'fs';
    import path from 'path';
    import { PDFDocument } from 'pdf-lib';
    import axios from 'axios';

    export const config = {
      api: {
        bodyParser: {
          sizeLimit: '10mb', // Set size limit for file uploads
        },
      },
    };

    export default async function handler(req, res) {
      if (req.method === 'POST') {
        const data = await req.formData();
        const file = data.get('file');

        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const textContent = await pdfDoc.getTextContent();

        const text = textContent.items.map(item => item.str).join(' ');

        const summaryResponse = await axios.post('https://api.example.com/summarize', { text });
        const thesesResponse = await axios.post('https://api.example.com/extract-theses', { text });
        const mindmapResponse = await axios.post('https://api.example.com/create-mindmap', { text });

        res.status(200).json({
          summary: summaryResponse.data.summary,
          theses: thesesResponse.data.theses,
          mindmap: mindmapResponse.data.mindmap,
        });
      } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
