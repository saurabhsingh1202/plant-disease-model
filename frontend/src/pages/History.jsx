import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Trash2, RefreshCw, Scan } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function SeverityBadge({ severity, isHealthy }) {
  if (isHealthy || severity === 'none') return <span className="badge badge-healthy">Healthy</span>;
  if (severity === 'medium') return <span className="badge badge-medium">Moderate</span>;
  if (severity === 'high') return <span className="badge badge-high">High Risk</span>;
  if (severity === 'critical') return <span className="badge badge-critical">Critical</span>;
  return <span className="badge badge-medium">{severity}</span>;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchHistory = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/predictions/history?page=${p}&limit=12`);
      setPredictions(data.predictions);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Could not load history — is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/predictions/stats`);
      setStats(data.stats);
    } catch {}
  };

  useEffect(() => {
    fetchHistory(page);
    fetchStats();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/predictions/${id}`);
      toast.success('Prediction deleted');
      fetchHistory(page);
      fetchStats();
    } catch {
      toast.error('Failed to delete prediction');
    }
  };

  return (
    <div className="history-page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="section-label"><Clock size={13} /> History</div>
            <h1 className="section-title">Prediction History</h1>
            <p className="page-subtitle">All your past plant disease analyses</p>
          </div>
          <button className="btn btn-ghost" onClick={() => fetchHistory(page)}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Stats Row */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
            {[
              { label: 'Total Analyses', value: stats.total, icon: '📊' },
              { label: 'Healthy Plants', value: stats.healthy, icon: '✅' },
              { label: 'Diseased Plants', value: stats.diseased, icon: '⚠️' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 32 }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: 'var(--green-400)' }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <div className="loading-text">Loading history…</div>
          </div>
        ) : predictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <h3 className="empty-title">No Predictions Yet</h3>
            <p className="empty-sub">Upload a plant leaf image to get your first diagnosis.</p>
            <Link to="/predict" className="btn btn-primary">
              <Scan size={16} /> Analyze a Plant
            </Link>
          </div>
        ) : (
          <>
            <div className="history-grid">
              {predictions.map((pred) => (
                <div key={pred._id} className="history-card">
                  {pred.imagePath ? (
                    <img
                      src={`${BACKEND_URL}${pred.imagePath}`}
                      alt={`${pred.plant} leaf`}
                      className="history-card-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="history-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🌿</div>
                  )}
                  <div className="history-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div className="history-card-plant">{pred.plant}</div>
                        <div className="history-card-disease">{pred.disease}</div>
                      </div>
                      <SeverityBadge severity={pred.severity} isHealthy={pred.isHealthy} />
                    </div>
                    <div className="history-card-meta">
                      <span className="history-card-conf">
                        {pred.confidence?.toFixed(1)}% confidence
                      </span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className="history-card-date">{formatDate(pred.createdAt)}</span>
                        <button
                          className="preview-btn preview-btn-remove"
                          onClick={() => handleDelete(pred._id)}
                          title="Delete"
                          style={{ width: 28, height: 28 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  ← Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                  Page {page} of {pagination.pages}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
