import React from 'react';
import Button from '@mui/material/Button';

import '../css/Upload.css';



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
  
  // triggers when file is dropped
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("Here");
    console.log(e.dataTransfer.files[0].name);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const newFiles = Array.from(e.dataTransfer.files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };
  
  // triggers when file is selected with click
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // handleFiles(e.target.files);
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
    // Add logic for conversion
    console.log('Converting files:', uploadedFiles);
    // Clear uploaded files after conversion
    
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
        {(
        <div>
          <h2>Uploaded Files</h2>
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>
                    <Button onClick={() => handleDelete(index)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button onClick={handleConvert}>Convert</Button>
        </div>
      )}
    </div>
  );
  }