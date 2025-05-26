import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [colorizedImage, setColorizedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setColorizedImage(null);
      };
      reader.readAsDataURL(file);
    }
  });

  const colorizeImage = async () => {
    if (!originalImage) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert data URL to blob
      const blob = await fetch(originalImage).then(res => res.blob());
      
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');
      
      // Using fetch instead of axios for consistency
      const response = await fetch('http://localhost:8000/colorize', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Colorization failed');
      }

      const colorizedBlob = await response.blob();
      setColorizedImage(URL.createObjectURL(colorizedBlob));
      
    } catch (err) {
      setError('Failed to colorize image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Image Colorizer</h1>
      <p>Upload a grayscale image to colorize it with AI</p>
      
      <div className="upload-section">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag & drop a grayscale image here, or click to select</p>
        </div>
      </div>
      
      {originalImage && (
        <div className="image-section">
          <div className="image-container">
            <h3>Original Image</h3>
            <img src={originalImage} alt="Original" />
          </div>
          
          <button 
            onClick={colorizeImage} 
            disabled={isLoading}
            className="colorize-button"
          >
            {isLoading ? 'Colorizing...' : 'Colorize Image'}
          </button>
          
          {colorizedImage && (
            <div className="image-container">
              <h3>Colorized Image</h3>
              <img src={colorizedImage} alt="Colorized" />
            </div>
          )}
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;