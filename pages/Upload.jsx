import { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../components/CartContext";

function Upload() {
  const { addToCart } = useContext(CartContext);
  const [documents, setDocuments] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setDocuments(files);
  };

  const handlePrint = () => {
    if (documents.length === 0) {
      alert("Please select documents first before printing the upload list.");
      return;
    }

    const fileItems = documents
      .map((file) => `<li>${file.webkitRelativePath || file.name}</li>`)
      .join("");

    const printWindow = window.open("", "PrintUploadList", "width=800,height=600");
    if (!printWindow) {
      alert("Print popup blocked. Please allow popups and try again.");
      window.print();
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Upload List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { font-size: 24px; margin-bottom: 16px; }
            p { margin-bottom: 16px; }
            ul { margin-top: 0; padding-left: 20px; }
            li { margin-bottom: 8px; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Upload List</h1>
          <p>Selected documents for print service:</p>
          <ul>${fileItems}</ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    const printAndClose = () => {
      printWindow.print();
      printWindow.close();
    };

    if (printWindow.document.readyState === "complete") {
      printAndClose();
    } else {
      printWindow.onload = printAndClose;
      setTimeout(printAndClose, 500);
    }
  };

  const clearDocuments = () => {
    setDocuments([]);
    setSuccessMessage("");
  };

  const addPrintOrderToCart = () => {
    if (documents.length === 0) {
      alert("Please select documents first.");
      return;
    }

    const printOrder = {
      id: `print-order-${Date.now()}`,
      name: "Print Service",
      description: `Print ${documents.length} file(s)`,
      price: 50,
      fileCount: documents.length,
      files: documents.map((f) => f.webkitRelativePath || f.name),
      quantity: 1,
    };

    addToCart(printOrder);
    setSuccessMessage(`✓ Added ${documents.length} file(s) to cart as print order`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="page-container">
      <div className="page-actions">
        <button type="button" className="secondary-button" onClick={handlePrint}>
          Print Upload List
        </button>
        <button type="button" className="secondary-button" onClick={clearDocuments}>
          Clear Selection
        </button>
        <button type="button" className="button" onClick={addPrintOrderToCart}>
          Add to Cart
        </button>
        <Link to="/checkout" className="button">
          Proceed to Checkout
        </Link>
      </div>

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      <h2 className="hero-title">Upload Documents for Printing</h2>
      <p className="product-description">
        Select files or folders that you want to print. Supported formats include PDF, DOC, TXT, JPG, PNG and more.
      </p>

      <div className="product-card">
        <p className="product-description">Choose how to upload your documents:</p>
        
        <div className="upload-buttons">
          <button
            type="button"
            className="button"
            onClick={() => fileInputRef.current?.click()}
          >
            + Select Files
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => folderInputRef.current?.click()}
          >
            + Select Folder
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          onChange={handleDocumentUpload}
          style={{ display: "none" }}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          webkitdirectory="true"
          directory="true"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          onChange={handleDocumentUpload}
          style={{ display: "none" }}
        />

        <span className="upload-note">
          Use "Select Files" for single or multiple files. Use "Select Folder" to upload an entire folder. 
        </span>

        {documents.length > 0 ? (
          <>
            <div className="upload-summary">
              <p className="product-name">Selected items ({documents.length})</p>
              <ul>
                {documents.map((file, index) => (
                  <li key={index}>{file.webkitRelativePath || file.name}</li>
                ))}
              </ul>
            </div>
            <div className="print-area">
              <h2>Upload List</h2>
              <p>Selected documents for print service:</p>
              <ul>
                {documents.map((file, index) => (
                  <li key={`print-${index}`}>{file.webkitRelativePath || file.name}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="product-description">No documents selected yet. Pick files to build your print order.</p>
        )}
      </div>
    </div>
  );
}

export default Upload;
