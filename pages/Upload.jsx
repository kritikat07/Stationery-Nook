import { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../components/CartContext";

function Upload() {
  const { addToCart } = useContext(CartContext);
  const [documents, setDocuments] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Print Settings
  const [printType, setPrintType] = useState("bw"); // 'bw' or 'color'
  const [sides, setSides] = useState("double"); // 'single' or 'double'
  const [copies, setCopies] = useState(1);
  const [customPages, setCustomPages] = useState("");

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Price Calculation Rules
  const getPagePrice = () => (printType === "color" ? 10 : 2);
  const getEstimatedPages = () => {
    if (customPages && parseInt(customPages) > 0) {
      return parseInt(customPages);
    }
    // Default to 3 pages per file if not specified
    return documents.length * 3;
  };
  const calculateTotalPrice = () => {
    const totalPages = getEstimatedPages();
    return totalPages * getPagePrice() * copies;
  };

  const handleFiles = (filesList) => {
    const files = Array.from(filesList);
    setIsUploading(true);
    setUploadProgress(15);
    
    // Simulate a nice upload progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setDocuments((prevDocs) => [...prevDocs, ...files]);
          return 0;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFolderInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handlePrint = () => {
    if (documents.length === 0) {
      alert("Please select documents first before printing the list.");
      return;
    }

    const fileItems = documents
      .map((file) => `<li>📁 ${file.webkitRelativePath || file.name}</li>`)
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
          <title>Print Order Manifest</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; }
            .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 20px; }
            h1 { font-size: 24px; color: #1e3a8a; margin: 0; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; font-size: 15px; }
            .specifications { background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Print Job Manifest</h1>
            <p>Stationery Nook Queue-Free Printing</p>
          </div>
          <div class="specifications">
            <strong>Job Specifications:</strong>
            <p style="margin: 5px 0;">• Print Mode: ${printType === "color" ? "Color (₹10/page)" : "Black & White (₹2/page)"}</p>
            <p style="margin: 5px 0;">• Layout: ${sides === "double" ? "Double-sided" : "Single-sided"}</p>
            <p style="margin: 5px 0;">• Copies: ${copies}</p>
            <p style="margin: 5px 0;">• Estimated Pages: ${getEstimatedPages()}</p>
            <p style="margin: 5px 0;">• Total Price: ₹${calculateTotalPrice()}</p>
          </div>
          <h3>Selected Documents (${documents.length}):</h3>
          <ul>${fileItems}</ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const clearDocuments = () => {
    setDocuments([]);
    setSuccessMessage("");
    setCustomPages("");
  };

  const removeFile = (indexToRemove) => {
    setDocuments((prevDocs) => prevDocs.filter((_, index) => index !== indexToRemove));
  };

  const addPrintOrderToCart = () => {
    if (documents.length === 0) {
      alert("Please select documents first.");
      return;
    }

    const price = calculateTotalPrice();
    const printOrder = {
      id: `print-order-${Date.now()}`,
      name: "Print Service Request",
      description: `Print ${documents.length} file(s) - ${printType.toUpperCase()}, ${sides.toUpperCase()}, ${copies} copy(ies)`,
      price: price,
      fileCount: documents.length,
      files: documents.map((f) => f.webkitRelativePath || f.name),
      quantity: 1,
    };

    addToCart(printOrder);
    setSuccessMessage(`✓ Added print order (₹${price}) to your cart successfully.`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  const getFileEmoji = (fileName = "") => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return "📕";
    if (["doc", "docx"].includes(ext)) return "📘";
    if (["png", "jpg", "jpeg"].includes(ext)) return "🖼️";
    if (ext === "txt") return "📄";
    return "📁";
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="page-container">
      <h2 className="hero-title" style={{ fontSize: "2.2rem" }}>Upload Documents for Printing</h2>
      <p className="product-description" style={{ marginBottom: "2.5rem" }}>
        Select files or folders you need printed. Configure layout, colors, and copies below to add to your pick-up cart.
      </p>

      {successMessage && (
        <div className="success-message" style={{ animation: "fadeIn 0.3s ease" }}>
          {successMessage}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", alignItems: "start" }} className="form-row">
        {/* Left Side: Upload Dropzone & File List */}
        <div>
          <div
            className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            style={{
              padding: "3rem 2rem",
              borderRadius: "1.5rem",
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.2s ease"
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📤</div>
            <h3 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Drag & Drop Files Here</h3>
            <p className="product-description" style={{ fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
              or click to browse your computer
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
              >
                📁 Select Files
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => folderInputRef.current?.click()}
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
              >
                📂 Select Folder
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              style={{ display: "none" }}
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              webkitdirectory="true"
              directory="true"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFolderInput}
              style={{ display: "none" }}
            />
          </div>

          {/* Upload Progress Loader */}
          {isUploading && (
            <div style={{ marginTop: "1.5rem", background: "rgba(148, 163, 184, 0.08)", padding: "1rem", borderRadius: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${uploadProgress}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #7c3aed)", transition: "width 0.15s ease" }}></div>
              </div>
            </div>
          )}

          {/* Files List Display */}
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
              <span>Selected Files ({documents.length})</span>
              {documents.length > 0 && (
                <button
                  type="button"
                  onClick={clearDocuments}
                  style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.85rem", cursor: "pointer", fontWeight: "600" }}
                >
                  Clear All
                </button>
              )}
            </h3>

            {documents.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed rgba(148,163,184,0.15)", borderRadius: "1.25rem" }}>
                <p className="product-description" style={{ margin: 0 }}>No documents selected yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "350px", overflowY: "auto", paddingRight: "0.5rem" }}>
                {documents.map((file, index) => (
                  <div
                    key={index}
                    className="file-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1.25rem",
                      borderRadius: "1rem",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                      <span style={{ fontSize: "1.4rem" }}>{getFileEmoji(file.name)}</span>
                      <div style={{ minWidth: 0 }}>
                        <p className="file-name" style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {file.webkitRelativePath || file.name}
                        </p>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {formatBytes(file.size || 15000)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem", padding: "0.25rem" }}
                      title="Remove file"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Print Settings & Live Pricing */}
        <div className="product-card" style={{ padding: "2rem", margin: 0 }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.75rem" }}>
            Print Specifications
          </h3>

          {/* 1. Print Mode selector */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "700", marginBottom: "0.5rem" }}>Color Palette</label>
            <div className="payment-method-selector" style={{ margin: "0.5rem 0 0" }}>
              <button
                type="button"
                className={`method-tab ${printType === "bw" ? "active" : ""}`}
                onClick={() => setPrintType("bw")}
                style={{ fontSize: "0.85rem", padding: "0.75rem" }}
              >
                📄 Black & White (₹2/p)
              </button>
              <button
                type="button"
                className={`method-tab ${printType === "color" ? "active" : ""}`}
                onClick={() => setPrintType("color")}
                style={{ fontSize: "0.85rem", padding: "0.75rem" }}
              >
                🎨 Full Color (₹10/p)
              </button>
            </div>
          </div>

          {/* 2. Double-Sided option */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "700", marginBottom: "0.5rem" }}>Sides</label>
            <div className="payment-method-selector" style={{ margin: "0.5rem 0 0" }}>
              <button
                type="button"
                className={`method-tab ${sides === "double" ? "active" : ""}`}
                onClick={() => setSides("double")}
                style={{ fontSize: "0.85rem", padding: "0.75rem" }}
              >
                🔄 Double-Sided
              </button>
              <button
                type="button"
                className={`method-tab ${sides === "single" ? "active" : ""}`}
                onClick={() => setSides("single")}
                style={{ fontSize: "0.85rem", padding: "0.75rem" }}
              >
                📄 Single-Sided
              </button>
            </div>
          </div>

          {/* 3. Estimated Pages input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="pagesInput" style={{ fontWeight: "700", marginBottom: "0.5rem" }}>Total Page Count (Optional)</label>
            <input
              id="pagesInput"
              type="number"
              min="1"
              className="form-input"
              value={customPages}
              onChange={(e) => setCustomPages(e.target.value)}
              placeholder={`Estimate: ${documents.length * 3} pages (${documents.length || 0} files)`}
              style={{ width: "100%" }}
            />
            <span className="checkout-helper-text">
              Leave blank to automatically estimate 3 pages per uploaded document.
            </span>
          </div>

          {/* 4. Copies counter */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ fontWeight: "700", marginBottom: "0.5rem" }}>Copies</label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => setCopies(Math.max(1, copies - 1))}
                className="secondary-button"
                style={{ padding: "0.5rem 1rem", fontSize: "1rem", width: "40px" }}
              >
                -
              </button>
              <span style={{ fontSize: "1.2rem", fontWeight: "700", minWidth: "30px", textAlign: "center" }}>
                {copies}
              </span>
              <button
                type="button"
                onClick={() => setCopies(copies + 1)}
                className="secondary-button"
                style={{ padding: "0.5rem 1rem", fontSize: "1rem", width: "40px" }}
              >
                +
              </button>
            </div>
          </div>

          {/* 5. Pricing summary and action group */}
          <div
            className="cart-total-section"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <span style={{ fontSize: "0.85rem", color: "#64748b", display: "block", textTransform: "uppercase" }}>Estimated Total</span>
              <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#3b82f6" }}>₹{calculateTotalPrice()}</span>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={handlePrint}
              style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
              disabled={documents.length === 0}
            >
              🖨️ Manifest
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="button"
              onClick={addPrintOrderToCart}
              disabled={documents.length === 0}
              style={{ width: "100%", padding: "0.95rem" }}
            >
              🛒 Add Print Job to Cart
            </button>
            {documents.length > 0 && (
              <Link
                to="/checkout"
                className="button"
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)"
                }}
              >
                💳 Instant Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
