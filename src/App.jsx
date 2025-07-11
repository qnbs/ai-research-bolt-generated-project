import React, { useState } from 'react';
    import { PDFDownloadLink } from '@react-pdf/renderer';
    import axios from 'axios';
    import MindMap from 'react-mindmap';

    const App = () => {
      const [pdfUrl, setPdfUrl] = useState('');
      const [summary, setSummary] = useState('');
      const [theses, setTheses] = = useState([]);
      const [mindMapData, setMindMapData] = useState({});

      const handlePdfUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        try {
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setSummary(response.data.summary);
          setTheses(response.data.theses);
          setMindMapData(response.data.mindmap);
        } catch (error) {
          console.error('Error uploading PDF:', error);
        }
      };

      return (
        <div className="container">
          <h1>KI-Forschungsassistent</h1>
          <div className="input-group">
            <label htmlFor="pdfUpload">PDF hochladen:</label>
            <input
              type="file"
              id="pdfUpload"
              accept=".pdf"
              onChange={handlePdfUpload}
            />
          </div>
          <div className="input-group">
            <label htmlFor="webLink">Weblink eingeben:</label>
            <input
              type="text"
              id="webLink"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
            <button onClick={async () => {
              try {
                const response = await axios.post('/api/analyze', { url: pdfUrl });
                setSummary(response.data.summary);
                setTheses(response.data.theses);
                setMindMapData(response.data.mindmap);
              } catch (error) {
                console.error('Error analyzing web link:', error);
              }
            }}>
              Analysieren
            </button>
          </div>
          <div>
            <h2>Zusammenfassung:</h2>
            <p>{summary}</p>
          </div>
          <div>
            <h2>Kernthesen:</h2>
            <ul>
              {theses.map((thesis, index) => (
                <li key={index}>{thesis}</li>
              ))}
            </ul>
          </div>
          <div className="mindmap">
            <MindMap data={mindMapData} />
          </div>
        </div>
      );
    };

    export default App;
