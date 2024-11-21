import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Papa from 'papaparse';

const FileUpload = ({ onDataParsed }) => {
  const [showModal, setShowModal] = useState(false);  // Modal visibility state
  const [hasHeaders, setHasHeaders] = useState(null); // Tracks header choice
  const [file, setFile] = useState(null);  // Store the selected file
  const [error, setError] = useState(null);  // Tracks error state
  const [isLoading, setIsLoading] = useState(false);  // Tracks loading state for file parsing

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    // Check if the file is CSV
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setFile(selectedFile);  // Save the selected file in the state
    setError(null); // Reset error state
    setShowModal(true);  // Show the modal after file selection
  };

  const handleModalClose = () => setShowModal(false);  // Close the modal

  const handleModalConfirm = () => {
    setShowModal(false);  // Close modal after the user makes a choice
    setIsLoading(true);  // Start loading state while parsing the file

    // Trigger PapaParse to parse the CSV file based on the header choice
    Papa.parse(file, {
      complete: (result) => {
        setIsLoading(false);  // Stop loading once parsing is complete

        if (result.errors.length > 0) {
          setError('Error parsing CSV file.');
          return;
        }

        const columns = result.data[0];
        const data = result.data.slice(1);

        if (!hasHeaders) {
          // If no headers, create default columns like "Column 1", "Column 2", etc.
          const newColumns = Array.from({ length: data[0].length }, (_, index) => `Column ${index + 1}`);
          onDataParsed(data, newColumns);  // Call onDataParsed with the data and columns
        } else {
          // If headers exist, use the first row as column names
          onDataParsed(data, columns);  // Call onDataParsed with the data and columns
        }
      },
      header: false,  // Set to false, we handle headers ourselves
      skipEmptyLines: true,  // Skip any empty lines
    });
  };

  return (
    <>
      <div className="file-upload-container">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="file-input" 
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Does your file have headers?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-buttons">
            <Button
              variant="primary"
              onClick={() => {
                setHasHeaders(true);  // User selected "Yes"
                handleModalConfirm();
              }}
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setHasHeaders(false);  // User selected "No"
                handleModalConfirm();
              }}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
          <p>Parsing file...</p>
        </div>
      )}
    </>
  );
};

export default FileUpload;
