import axios from 'axios';

    export default async function handler(req, res) {
      if (req.method === 'POST') {
        const { url } = req.body;

        if (!url) {
          return res.status(400).json({ error: 'No URL provided' });
        }

        try {
          const response = await axios.get(url);
          const textContent = response.data;

          const summaryResponse = await axios.post('https://api.example.com/summarize', { text: textContent });
          const thesesResponse = await axios.post('https://api.example.com/extract-theses', { text: textContent });
          const mindmapResponse = await axios.post('https://api.example.com/create-mindmap', { text: textContent });

          res.status(200).json({
            summary: summaryResponse.data.summary,
            theses: thesesResponse.data.theses,
            mindmap: mindmapResponse.data.mindmap,
          });
        } catch (error) {
          res.status(500).json({ error: 'Error analyzing web link' });
        }
      } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
