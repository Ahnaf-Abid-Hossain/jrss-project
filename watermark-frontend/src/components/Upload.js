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
import JSZip from 'jszip';





export default function UploadButton() {
   // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [blobUrl, setBlobUrl] = React.useState('');
  
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

  

  const handleExtractPDFs = async (blobData) => {
    console.log("Called hanldedExtractPDFs function");
    console.log('blobUrl', blobUrl);
    try {
      // Assuming blobUrl is the URL to the ZIP file
      // const response = await fetch(blobUrl);
      // console.log('response', response);
      const blob = blobData;
      console.log('blob', blob);

      // Load zip content into JSZip
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(blob);
      console.log('zipContent', zipContent);
      // Filter and process only PDF files
      const pdfBlobUrls = [];
      for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
        if (relativePath.endsWith('.pdf')) {
          const fileBlob = await zipEntry.async("blob");
          const fileName = zipEntry.name;
          
          console.log('fileBlob', fileBlob);
          console.log('fileName', fileName);
          // Parse the index from the file name
          const splitName = fileName.split('Ĭ'); // Adjust based on actual character encoding
          const index = splitName.length > 1 ? parseInt(splitName[0], 10) : null;
          console.log('index', index);

          if (index !== null && index < uploadedFiles.length) {
            console.log('inside if');
            const newFile = new File([fileBlob], fileName, { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(newFile);

            pdfBlobUrls.push({ blobUrl, index});
            // Update the corresponding item in uploadedFiles
            // const updatedFiles = [...uploadedFiles];
            // updatedFiles[index] = {
            //     ...updatedFiles[index],
            //     viewLink: blobUrl, // Add the Blob URL for viewing
            //     status: "Modified" // Update the status
            // };
            // setUploadedFiles(updatedFiles);
          }
        }
      }

      const updatedFiles = [...uploadedFiles];

      pdfBlobUrls.forEach((obj, index) => {

        updatedFiles[obj.index] = {
          ...updatedFiles[obj.index],
          status: "Completed",
          viewLink: obj.blobUrl, // Add the Blob URL for viewing
        };

      });
      setUploadedFiles(updatedFiles);

      // // This setTimeout is just to ensure that all async operations inside forEach have completed
      // setTimeout(() => {
      //   setUploadedFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
      // }, 1000); // You might need to adjust this delay based on the number/size of files

    } catch (error) {
      console.error('Error extracting PDF files:', error);
    }
  };

  const handleModify = async () => {
    const formData = new FormData();
    console.log('uploadedFiles', uploadedFiles);

    // Append each file to the FormData object with the same field name
    uploadedFiles.forEach((file, index) => {
      formData.append(`${index}`, file.file); // failed here because it is unable to retrieve file
    });

    // set all the status modifiecation to completed
    const updateTableStatus = uploadedFiles.map((file, i) => {
      return { ...file, status: "Completed"};
    });
    setUploadedFiles(updateTableStatus);


    try {
        let response = await axios.post('http://127.0.0.1:8000/upload', formData, {
            headers: {
              
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob', 
        }).then(response => {
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: 'application/zip' });

          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
          if(blobUrl.length > 0) {
            window.URL.revokeObjectURL(blobUrl);
          }
          setBlobUrl(url);
          handleExtractPDFs(response.data);
        })
        .catch(error => {
          console.error('Error downloading .docx file:', error);
        });

        alert('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};
  const getStatusStyle = (status) => {
    switch(status) {
      case "Not uploaded":
        return {color: 'black'};
      case "Completed":
        return {color: 'green', backgroundColor: 'lightgreen'};
      default: 
        return {color: 'black'};

    }
  }
  
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
          viewLink: "Not available"
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
          viewLink: "Not available"
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
    console.log('Converting files:', JSON.stringify(uploadedFiles));
    console.log('Converting files:', uploadedFiles);
    handleModify();
  };

  const handleDownload = () => {
    // Create a link and click it to trigger the download
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'modified_resumes.zip';
    a.click();
  };

  const handleClear = () => {
    setUploadedFiles([]);
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
      
        <h2>Uploaded Files</h2>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {uploadedFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <a href={URL.createObjectURL(file.file)} target="_blank" rel="noopener noreferrer">
                      {file.file.name}
                    </a>
                  </TableCell>
                  <TableCell style={getStatusStyle(file.status)}>{file.status}</TableCell>
                  <TableCell>
                    <a href={file.viewLink} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(index)}>Delete</Button>
                  </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <Button variant="outlined" onClick={handleConvert} style={{marginTop: '50px'}}>Modify Files</Button>
          <Button variant="outlined" onClick={handleClear} style={{'marginTop': '50px', marginLeft: '20px'}}>Clear List</Button>
          <Button variant="outlined" onClick={handleDownload} style={{'marginTop': '50px', marginLeft: '20px'}}>Download Files</Button>
        </div>
    </div>
  );
  }