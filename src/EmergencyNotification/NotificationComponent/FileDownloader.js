import React, { useState } from 'react';
import axios from 'axios';

const FileDownloader = () => {
  const [docID, setDocID] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleDownload = async () => {
    try {
      const response = await axios.post('http://localhost:8080/download', { docID });
      const { link } = response.data;
      setDownloadLink(link);
      // Trigger the download
      const linkElement = document.createElement('a');
      linkElement.href = link;
      linkElement.download = true;
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div>
      File is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloadedFile is being downloaded
      <input
        type="text"
        value={docID}
        onChange={(e) => setDocID(e.target.value)}
        placeholder="Enter Document ID"
      />
      <button onClick={handleDownload}>Download File</button>
      {downloadLink && <p>File is being downloaded...</p>}
    </div>
  );
};

export default FileDownloader;