import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, Scan, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function SeverityBadge({ severity, isHealthy }) {
  if (isHealthy || severity === 'none') return <span className="badge badge-healthy">✅ Healthy</span>;
  if (severity === 'medium') return <span className="badge badge-medium">⚠️ Moderate</span>;
  if (severity === 'high') return <span className="badge badge-high">🔴 High Risk</span>;
  if (severity === 'critical') return <span className="badge badge-critical">☠️ Critical</span>;
  return <span className="badge badge-medium">{severity}</span>;
}

function ResultCard({ result }) {
  const [barWidth, setBarWidth] = useState(0);

  // Animate bar after mount
  setTimeout(() => setBarWidth(result.confidence), 100);

  return (
    <div className="result-card">
      <div className="result-header">
        <div>
          <div className="result-plant">{result.plant}</div>
          <div className="result-disease">{result.disease}</div>
        </div>
        <SeverityBadge severity={result.severity} isHealthy={result.is_healthy} />
      </div>

      <div className="result-body">
        {/* Confidence */}
        <div className="confidence-section">
          <div className="confidence-label">
            <span className="confidence-label-text">Confidence Score</span>
            <span className="confidence-value">{result.confidence.toFixed(1)}%</span>
          </div>
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="result-info-grid">
          <div className="result-info-item">
            <div className="result-info-label">Plant</div>
            <div className="result-info-value">{result.plant}</div>
          </div>
          <div className="result-info-item">
            <div className="result-info-label">Disease</div>
            <div className="result-info-value">{result.disease}</div>
          </div>
          <div className="result-info-item">
            <div className="result-info-label">Status</div>
            <div className="result-info-value" style={{ color: result.is_healthy ? 'var(--green-400)' : 'var(--red-400)' }}>
              {result.is_healthy ? '✅ Healthy' : '⚠️ Diseased'}
            </div>
          </div>
          <div className="result-info-item">
            <div className="result-info-label">Severity</div>
            <div className="result-info-value" style={{ textTransform: 'capitalize' }}>{result.severity}</div>
          </div>
        </div>

        {/* Description */}
        <div className="result-description">
          <div className="result-label">🔬 About This Condition</div>
          <p className="result-text">{result.description}</p>
        </div>

        {/* Treatment */}
        {!result.is_healthy && (
          <div className="result-treatment">
            <div className="result-label">💊 Recommended Treatment</div>
            <p className="result-text">{result.treatment}</p>
          </div>
        )}

        {/* Top Predictions */}
        {result.top_predictions && result.top_predictions.length > 1 && (
          <div className="top-predictions">
            <div className="top-pred-title">Top Predictions</div>
            {result.top_predictions.map((pred, i) => (
              <div key={i} className="top-pred-item">
                <div className="top-pred-name" title={pred.class}>
                  {i + 1}. {pred.class.replace(/_/g, ' ').replace(/___/g, ' - ')}
                </div>
                <div className="top-pred-bar-bg">
                  <div
                    className="top-pred-bar-fill"
                    style={{ width: `${Math.min(pred.confidence, 100)}%`, opacity: i === 0 ? 1 : 0.5 }}
                  />
                </div>
                <div className="top-pred-pct">{pred.confidence.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Predict() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post(`${API_BASE}/predictions/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000
      });

      if (data.success) {
        setResult(data.prediction);
        toast.success(`Analysis complete! ${data.prediction.plant} detected.`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Analysis failed. Please try again.';
      setError(msg);
      toast.error(msg.length > 80 ? 'Analysis failed. Check that the ML service is running.' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-page">
      <div className="container">
        <div className="page-header">
          <div className="section-label"><Scan size={13} /> Disease Detection</div>
          <h1 className="section-title">Analyze Your Plant</h1>
          <p className="page-subtitle">
            Upload a clear photo of a plant leaf to detect diseases and get treatment recommendations.
          </p>
        </div>

        <div className="predict-layout">
          {/* Left: Upload */}
          <div>
            {!preview ? (
              <div
                {...getRootProps()}
                className={`upload-box ${isDragActive ? 'dragging' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="upload-icon">📸</div>
                <div className="upload-text-main">
                  {isDragActive ? 'Drop the leaf image here...' : 'Upload a Plant Leaf Image'}
                </div>
                <p className="upload-text-sub">
                  Drag & drop, or click to browse your files<br />
                  (Max 10MB)
                </p>
                <div className="upload-formats">
                  {['JPG', 'JPEG', 'PNG', 'WEBP', 'BMP'].map(f => (
                    <span key={f} className="format-tag">{f}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="image-preview-wrapper">
                  <img src={preview} alt="Uploaded plant leaf" />
                  <div className="preview-overlay">
                    <button className="preview-btn preview-btn-remove" onClick={handleReset} title="Remove">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                  <button
                    className={`btn btn-primary ${loading ? 'disabled' : ''}`}
                    onClick={handleAnalyze}
                    disabled={loading}
                    style={{ flex: 1 }}
                    id="analyze-btn"
                  >
                    {loading ? (
                      <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing…</>
                    ) : (
                      <><Scan size={17} /> Analyze Disease</>
                    )}
                  </button>
                  <button className="btn btn-ghost" onClick={handleReset}>
                    <RefreshCw size={16} /> Reset
                  </button>
                </div>

                {/* File info */}
                <div style={{ marginTop: 14, padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>🖼️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{file?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(file?.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AlertTriangle size={18} style={{ color: 'var(--red-400)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--red-400)', marginBottom: 4 }}>Analysis Failed</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{error}</div>
                </div>
              </div>
            )}

            {/* Tips */}
            {!preview && (
              <div style={{ marginTop: 24, padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-400)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  📋 Tips for Best Results
                </div>
                {[
                  'Use a clear, well-lit photo of the leaf',
                  'Capture the affected area clearly',
                  'Avoid blurry or dark images',
                  'Single leaf works best (not whole plant)',
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} style={{ color: 'var(--green-400)', flexShrink: 0, marginTop: 2 }} />
                    {tip}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div>
            {loading && (
              <div className="loading-container" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-green)' }}>
                <div className="spinner" style={{ width: 52, height: 52 }} />
                <div className="loading-text">🧠 AI is analyzing your plant leaf…</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Running CNN inference on 38 disease classes</div>
              </div>
            )}

            {result && !loading && <ResultCard result={result} />}

            {!result && !loading && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)', padding: '60px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.4 }}>🌿</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>
                  {preview ? 'Ready to Analyze' : 'Upload an Image to Begin'}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {preview
                    ? 'Click "Analyze Disease" to run the AI model on your uploaded image.'
                    : 'Select or drag a plant leaf image on the left to get started with disease detection.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
