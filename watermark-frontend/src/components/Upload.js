import React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import '../css/Upload.css';
import { TableCell, TableRow } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';




export default function UploadButton() {
   // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  
  // handle drag events
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();

    // Append each file to the FormData object with the same field name
    uploadedFiles.forEach((file, index) => {
      formData.append(`${index}`, file.file);
    });
    console.log("Form data: " + formData);
    try {
        let response = await axios.post('http://127.0.0.1:8000/upload', formData, {
            headers: {
              
                'Content-Type': 'multipart/form-data',


            },
            responseType: 'blob', 
        }).then(response => {
          console.log("Response: " + JSON.stringify(response));
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);

          // Create a link and click it to trigger the download
          const a = document.createElement('a');
          a.href = url;
          a.download = 'modified_document.docx';
          a.click();

          // Clean up the URL object
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error downloading .docx file:', error);
        });

        console.log(response);
        alert('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};
  
  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
   
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const newFiles = Array.from(e.dataTransfer.files);
        const formattedFiles = newFiles.map((newFile) => ({
          file: newFile,
          status: "Not uploaded",
          downloadLink: "Not available"
        }));
        
        setUploadedFiles((prevFiles) => [...prevFiles, ...formattedFiles]);
    }
  };
  
  // triggers when file is selected with click
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
        const newFiles = Array.from(e.target.files);
        const formattedFiles = newFiles.map((newFile) => ({
          file: newFile,
          status: "Not uploaded",
          downloadLink: "Not available"
        }));
        
        setUploadedFiles((prevFiles) => [...prevFiles, ...formattedFiles]);
    }
  };
  
// triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleDelete = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
  };

  const handleConvert = () => {
    console.log('Converting files:', uploadedFiles);

    handleUpload();
  };
  
  return (
    <div className='page-layout'>
        <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
                <div>
                <p>Drag and drop your file here or</p>
                <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
                </div> 
            </label>
            { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
        </form>
        <Button variant="outlined" onClick={handleConvert} style={{marginTop: '10px'}}>Upload</Button>
        <h2>Uploaded Files</h2>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>File Link</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {uploadedFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.file.name}</TableCell>
                  <TableCell>{file.status}</TableCell>
                  <TableCell>{file.downloadLink}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(index)}>Delete</Button>
                  </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
  }