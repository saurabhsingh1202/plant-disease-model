import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import { BarChart3, PieChart, ShieldAlert, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE}/predictions/stats`),
          axios.get(`${API_BASE}/predictions/history?limit=5`)
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (historyRes.data.success) {
          setRecent(historyRes.data.predictions);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Could not load dashboard data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: 20, color: 'var(--text-muted)' }}>Loading analytics dashboard...</p>
      </div>
    );
  }

  // Fallback defaults if no data exists
  const total = stats?.total || 0;
  const healthy = stats?.healthy || 0;
  const diseased = stats?.diseased || 0;
  const healthyPct = total > 0 ? ((healthy / total) * 100).toFixed(0) : 0;
  const diseasedPct = total > 0 ? ((diseased / total) * 100).toFixed(0) : 0;

  // Process severity groupings
  const severityMap = { none: 0, medium: 0, high: 0, critical: 0, unknown: 0 };
  if (stats?.bySeverity) {
    stats.bySeverity.forEach(item => {
      const id = item._id || 'unknown';
      severityMap[id] = item.count;
    });
  }

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div className="section-label"><BarChart3 size={13} /> {t('navDashboard')}</div>
        <h1 className="section-title">Analytics Dashboard</h1>
        <p className="page-subtitle">Agricultural health statistics and diagnostic history insights</p>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid var(--green-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>{t('totalPredictions')}</span>
            <BarChart3 size={20} style={{ color: 'var(--green-400)' }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 44, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--green-400)' }}>{total}</span>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Total leaf images analyzed</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>{t('healthyCount')}</span>
            <CheckCircle size={20} style={{ color: '#10b981' }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 44, fontWeight: 800, fontFamily: 'Outfit', color: '#10b981' }}>{healthy}</span>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{healthyPct}% of total crops healthy</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>{t('diseasedCount')}</span>
            <AlertTriangle size={20} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 44, fontWeight: 800, fontFamily: 'Outfit', color: '#ef4444' }}>{diseased}</span>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{diseasedPct}% disease rate detected</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24, marginBottom: 40 }}>
        {/* Crop Health Ratio Card */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={16} style={{ color: 'var(--green-400)' }} /> Crop Health Summary
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '20px 0' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span>Healthy Crops</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{healthyPct}%</span>
              </div>
              <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#10b981', width: `${healthyPct}%` }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '20px 0' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span>Diseased Crops</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>{diseasedPct}%</span>
              </div>
              <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#ef4444', width: `${diseasedPct}%` }}></div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            💡 <strong>Agricultural insight:</strong> Continuous monitoring helps identify disease outbreaks early, saving up to 40% of crop yields.
          </div>
        </div>

        {/* Severity Distribution Card */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={16} style={{ color: 'var(--green-400)' }} /> {t('severityTitle')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Critical / ☠️', count: severityMap.critical, color: '#f43f5e' },
              { label: 'High / 🔴', count: severityMap.high, color: '#f97316' },
              { label: 'Moderate / ⚠️', count: severityMap.medium, color: '#eab308' },
              { label: 'Healthy / ✅', count: severityMap.none || healthy, color: '#10b981' }
            ].map(sev => {
              const percentage = total > 0 ? ((sev.count / total) * 100).toFixed(0) : 0;
              return (
                <div key={sev.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 110, fontSize: 13, fontWeight: 600 }}>{sev.label}</div>
                  <div style={{ flex: 1, height: 12, background: 'var(--bg-secondary)', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', background: sev.color, width: `${percentage}%` }}></div>
                  </div>
                  <div style={{ width: 45, fontSize: 13, textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {sev.count} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Predictions Panel */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={16} style={{ color: 'var(--green-400)' }} /> Recent Diagnostics Log
        </h3>

        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            No predictions found. Go to the Diagnose page to analyze a leaf!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="mandi-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Plant</th>
                  <th style={{ padding: '12px 16px' }}>Diagnosis</th>
                  <th style={{ padding: '12px 16px' }}>Severity</th>
                  <th style={{ padding: '12px 16px' }}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((pred) => (
                  <tr key={pred._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {new Date(pred.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{pred.plant}</td>
                    <td style={{ padding: '12px 16px', color: pred.isHealthy ? 'var(--green-400)' : 'var(--text-primary)' }}>
                      {pred.disease}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${pred.isHealthy ? 'healthy' : pred.severity}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                        {pred.isHealthy ? 'Healthy' : pred.severity.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'Outfit', fontWeight: 600 }}>
                      {pred.confidence.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
