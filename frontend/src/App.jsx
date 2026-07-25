import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Predict from './pages/Predict';
import History from './pages/History';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import AssistantHub from './pages/AssistantHub';
import Chatbot from './pages/Chatbot';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/history" element={<History />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assistant" element={<AssistantHub />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1f2e',
                color: '#e2e8f0',
                border: '1px solid rgba(100, 200, 100, 0.2)',
                borderRadius: '12px',
                fontSize: '14px'
              },
              success: {
                iconTheme: { primary: '#4ade80', secondary: '#1a1f2e' }
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: '#1a1f2e' }
              }
            }}
          />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
