import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Predict from './pages/Predict';
import History from './pages/History';
import About from './pages/About';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/history" element={<History />} />
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
  );
}

export default App;
