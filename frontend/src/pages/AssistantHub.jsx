import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/LanguageContext';
import { CloudRain, Sun, Wind, Droplets, BookOpen, MapPin, Landmark, Calendar, Leaf, IndianRupee, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AssistantHub() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('weather');

  // Weather states
  const [cityInput, setCityInput] = useState('Varanasi');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Schemes states
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const [schemes, setSchemes] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(false);

  // Soil Advisor states
  const [soilType, setSoilType] = useState('Alluvial Soil');
  const [soilList, setSoilList] = useState([]);
  const [soilLoading, setSoilLoading] = useState(false);

  // Crop Calendar states
  const [calendarState, setCalendarState] = useState('Uttar Pradesh');
  const [calendarCrop, setCalendarCrop] = useState('');
  const [calendarData, setCalendarData] = useState(null);
  const [calendarOptions, setCalendarOptions] = useState({});
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Mandi states
  const [mandiState, setMandiState] = useState('Uttar Pradesh');
  const [mandiList, setMandiList] = useState([]);
  const [mandiFilter, setMandiFilter] = useState('');
  const [mandiLoading, setMandiLoading] = useState(false);

  const statesList = ["Uttar Pradesh", "Bihar", "Punjab", "Maharashtra", "Tamil Nadu"];

  // 1. Fetch Weather
  const fetchWeather = async (city = 'Varanasi') => {
    setWeatherLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/assistant/weather?city=${city}`);
      if (data.success) {
        setWeatherData(data);
      }
    } catch (err) {
      toast.error("Could not fetch weather data.");
    } finally {
      setWeatherLoading(false);
    }
  };

  // 2. Fetch Schemes
  const fetchSchemes = async (state) => {
    setSchemesLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/assistant/schemes?state=${state}`);
      if (data.success) {
        setSchemes(data.schemes);
      }
    } catch (err) {
      toast.error("Could not load schemes.");
    } finally {
      setSchemesLoading(false);
    }
  };

  // 3. Fetch Soil Info
  const fetchSoil = async () => {
    setSoilLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/assistant/soil`);
      if (res.data.success) {
        setSoilList(res.data.soil);
      }
    } catch (err) {
      toast.error("Could not load soil database.");
    } finally {
      setSoilLoading(false);
    }
  };

  // 4. Fetch Crop Calendar
  const fetchCalendar = async (state) => {
    setCalendarLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/assistant/calendar?state=${state}`);
      if (data.success) {
        setCalendarOptions(data.calendar);
        const crops = Object.keys(data.calendar);
        if (crops.length > 0) {
          setCalendarCrop(crops[0]);
          setCalendarData(data.calendar[crops[0]]);
        } else {
          setCalendarCrop('');
          setCalendarData(null);
        }
      }
    } catch (err) {
      toast.error("Could not load crop calendar.");
    } finally {
      setCalendarLoading(false);
    }
  };

  // 5. Fetch Mandi Prices
  const fetchMandi = async (state) => {
    setMandiLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/assistant/mandi?state=${state}`);
      if (data.success) {
        setMandiList(data.mandi);
      }
    } catch (err) {
      toast.error("Could not fetch mandi rates.");
    } finally {
      setMandiLoading(false);
    }
  };

  // Trigger loads on tab change
  useEffect(() => {
    if (activeTab === 'weather') {
      fetchWeather(cityInput);
    } else if (activeTab === 'schemes') {
      fetchSchemes(selectedState);
    } else if (activeTab === 'soil') {
      fetchSoil();
    } else if (activeTab === 'calendar') {
      fetchCalendar(calendarState);
    } else if (activeTab === 'mandi') {
      fetchMandi(mandiState);
    }
  }, [activeTab]);

  // Handle State changes
  const handleStateChange = (state) => {
    setSelectedState(state);
    fetchSchemes(state);
  };

  const handleCalendarStateChange = (state) => {
    setCalendarState(state);
    fetchCalendar(state);
  };

  const handleMandiStateChange = (state) => {
    setMandiState(state);
    fetchMandi(state);
  };

  // Weather Code mapper to icons
  const getWeatherIcon = (code) => {
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={48} style={{ color: '#38bdf8' }} />;
    return <Sun size={48} style={{ color: '#fbbf24' }} />;
  };

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div className="section-label"><Landmark size={13} /> {t('navHub')}</div>
        <h1 className="section-title">Farmer Support Hub</h1>
        <p className="page-subtitle">Interactive smart agriculture dashboard, weather advisor, schemes browser, soil guide, and market rates tracker.</p>
      </div>

      {/* Tabs Row */}
      <div className="hub-tabs" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 32, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'weather', label: t('weatherTitle'), icon: Sun },
          { id: 'schemes', label: t('govSchemes'), icon: Landmark },
          { id: 'soil', label: t('soilInfo'), icon: Leaf },
          { id: 'calendar', label: t('cropCalendar'), icon: Calendar },
          { id: 'mandi', label: t('mandiPrices'), icon: IndianRupee }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', borderRadius: 12 }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}
      <div className="tab-contents">
        
        {/* 1. WEATHER TAB */}
        {activeTab === 'weather' && (
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                <input
                  type="text"
                  className="search-input"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder={t('enterCity')}
                  style={{
                    flex: 1,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
                    fontSize: 14
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWeather(cityInput)}
                />
                <button className="btn btn-primary" onClick={() => fetchWeather(cityInput)} disabled={weatherLoading} style={{ borderRadius: 12 }}>
                  <Search size={16} style={{ marginRight: 6 }} /> {t('search')}
                </button>
              </div>

              {weatherLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div className="spinner"></div>
                </div>
              ) : weatherData ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        <MapPin size={12} /> Live Coordinates: {weatherData.coordinates.lat.toFixed(2)}°, {weatherData.coordinates.lon.toFixed(2)}°
                      </div>
                      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 0', fontFamily: 'Outfit' }}>{weatherData.city}</h2>
                    </div>
                    {getWeatherIcon(weatherData.current.weatherCode)}
                  </div>

                  <div className="weather-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Sun size={24} style={{ color: '#fbbf24' }} />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('temp')}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit' }}>{weatherData.current.temp}°C</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Droplets size={24} style={{ color: '#38bdf8' }} />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('humidity')}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit' }}>{weatherData.current.humidity}%</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <CloudRain size={24} style={{ color: '#60a5fa' }} />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('rain')}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit' }}>{weatherData.current.rainChance}%</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '16px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Wind size={24} style={{ color: '#cbd5e1' }} />
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('wind')}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit' }}>{weatherData.current.windSpeed} km/h</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderLeft: '4px solid var(--green-400)', background: 'var(--bg-secondary)', padding: '18px 22px', borderRadius: '0 12px 12px 0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green-400)', marginBottom: 6 }}>
                      🌾 {t('weatherAdvice')}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>{weatherData.advice}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* 2. GOVERNMENT SCHEMES TAB */}
        {activeTab === 'schemes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{t('govSchemes')}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('selectState')}:</span>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '8px 16px',
                    borderRadius: 10,
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    outline: 'none'
                  }}
                >
                  {statesList.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            {schemesLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}><div className="spinner"></div></div>
            ) : (
              <div className="schemes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                {schemes.map((sch, i) => (
                  <div key={i} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'inline-block', background: 'var(--green-glow)', border: '1px solid var(--border-green)', color: 'var(--green-400)', fontSize: 11, padding: '4px 10px', borderRadius: 20, marginBottom: 12, fontWeight: 600 }}>
                        🏛️ Government of India
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{sch.name}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>{sch.description}</p>
                      
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12, fontSize: 13 }}>
                        <strong>Eligibility:</strong> <span style={{ color: 'var(--text-secondary)' }}>{sch.eligibility}</span>
                      </div>
                      <div style={{ marginTop: 6, fontSize: 13, marginBottom: 16 }}>
                        <strong>Benefits:</strong> <span style={{ color: 'var(--green-400)', fontWeight: 600 }}>{sch.benefits}</span>
                      </div>
                    </div>
                    
                    <a href={sch.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'block', textAlign: 'center', padding: '8px 0', fontSize: 13 }}>
                      Apply / Learn More
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SOIL ADVISOR TAB */}
        {activeTab === 'soil' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {/* Sidebar list of Soils */}
            <div className="card" style={{ padding: 20, height: 'fit-content' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{t('selectSoil')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {soilList.map(soil => (
                  <button
                    key={soil.type}
                    onClick={() => setSoilType(soil.type)}
                    className={`btn ${soilType === soil.type ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ textAlign: 'left', display: 'block', width: '100%', borderRadius: 10, fontSize: 14, padding: '10px 14px' }}
                  >
                    🌱 {soil.type}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Detail Panel */}
            <div className="card" style={{ padding: 28, flex: 2 }}>
              {soilList.filter(s => s.type === soilType).map(soil => (
                <div key={soil.type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, fontFamily: 'Outfit' }}>{soil.type}</h2>
                    <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
                      pH: {soil.pH}
                    </span>
                  </div>

                  <div className="soil-info-section" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green-400)', margin: '0 0 6px 0' }}>
                        💡 {t('soilAdvantages')}
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{soil.advantages}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#f87171', margin: '0 0 6px 0' }}>
                        ⚠️ Limitations
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{soil.limitations}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green-400)', margin: '0 0 6px 0' }}>
                        🌾 {t('soilCrops')}
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{soil.crops}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green-400)', margin: '0 0 6px 0' }}>
                        🧪 {t('soilFertilizer')}
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{soil.fertilizer}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green-400)', margin: '0 0 6px 0' }}>
                        🐛 Pest Management
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{soil.pest}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CROP CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="card" style={{ padding: 28 }}>
              {/* Selectors Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{t('selectState')}</label>
                  <select
                    value={calendarState}
                    onChange={(e) => handleCalendarStateChange(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      padding: '10px 16px',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      fontSize: 14
                    }}
                  >
                    {statesList.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Select Season</label>
                  <select
                    value={calendarCrop}
                    onChange={(e) => {
                      setCalendarCrop(e.target.value);
                      setCalendarData(calendarOptions[e.target.value]);
                    }}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      padding: '10px 16px',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      fontSize: 14
                    }}
                  >
                    {Object.keys(calendarOptions).map(cr => <option key={cr} value={cr}>{cr}</option>)}
                  </select>
                </div>
              </div>

              {calendarLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}><div className="spinner"></div></div>
              ) : calendarData ? (
                <div>
                  {/* Timeline Graphic */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: 40, marginTop: 10 }}>
                    <div style={{ position: 'absolute', top: 12, left: 16, right: 16, height: 4, background: 'var(--border)', zIndex: 1 }} />
                    
                    {[
                      { step: '1', title: t('sowingPeriod'), val: calendarData.sowing, emoji: '🌱' },
                      { step: '2', title: 'Planting Period', val: calendarData.planting || 'Jul-Aug', emoji: '🚜' },
                      { step: '3', title: t('harvestPeriod'), val: calendarData.harvest, emoji: '🌾' }
                    ].map(st => (
                      <div key={st.step} style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-glow)', border: '1px solid var(--border-green)', display: 'flex', alignItems: 'center', justify: 'center', fontSize: 12, fontWeight: 700, color: 'var(--green-400)', marginBottom: 8 }}>
                          {st.emoji}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{st.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{st.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Details Card */}
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green-400)' }}>🚿 Season-specific Advice</span>
                      <p style={{ margin: '6px 0 0 0', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        {calendarCrop === 'Kharif Season' 
                          ? 'Kharif crops require hot and wet conditions. Ensure good field drainage to prevent waterlogging during heavy monsoon rains. Post-rain weeding is crucial.' 
                          : 'Rabi crops require warm weather for germination and cold weather for growth. Ensure regular winter irrigation at critical crop development phases.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  No calendar details found for this combination.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. MANDI PRICES TAB */}
        {activeTab === 'mandi' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px 0' }}>{t('mandiPrices')}</h2>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>⚡ Prices fluctuate by +/- 25 Rs based on real-time market simulation</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Search crop */}
                <input
                  type="text"
                  placeholder="Filter crop..."
                  value={mandiFilter}
                  onChange={(e) => setMandiFilter(e.target.value)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '8px 12px',
                    borderRadius: 10,
                    color: 'var(--text-primary)',
                    fontSize: 14
                  }}
                />
                
                {/* Select state */}
                <select
                  value={mandiState}
                  onChange={(e) => handleMandiStateChange(e.target.value)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    padding: '8px 16px',
                    borderRadius: 10,
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    outline: 'none'
                  }}
                >
                  {statesList.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            {mandiLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}><div className="spinner"></div></div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="mandi-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'left' }}>
                      <th style={{ padding: '16px 20px' }}>{t('mandiName')}</th>
                      <th style={{ padding: '16px 20px' }}>{t('mandiCrop')}</th>
                      <th style={{ padding: '16px 20px' }}>{t('mandiArrival')}</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>{t('mandiPrice')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mandiList
                      .filter(item => item.crop.toLowerCase().includes(mandiFilter.toLowerCase()))
                      .map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '16px 20px', fontWeight: 600 }}>📍 {item.mandi}</td>
                          <td style={{ padding: '16px 20px' }}>{item.crop}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{item.arrival}</td>
                          <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: 'var(--green-400)', fontFamily: 'Outfit', fontSize: 16 }}>
                            ₹{item.price} / {item.unit}
                          </td>
                        </tr>
                      ))}
                    {mandiList.filter(item => item.crop.toLowerCase().includes(mandiFilter.toLowerCase())).length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No crops match your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
