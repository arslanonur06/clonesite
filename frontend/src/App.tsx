import { Routes, Route } from 'react-router-dom';
import MainDashboard from './components/MainDashboard';
import BrandScanner from './components/BrandScanner';
import ProfessionalIGamingTools from './components/ProfessionalIGamingTools';
import { WebSocketProvider } from './hooks/useWebSocket';

function App() {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/scanner" element={<BrandScanner />} />
        <Route path="/igaming-tools" element={<ProfessionalIGamingTools />} />
        <Route path="/*" element={<MainDashboard />} />
      </Routes>
    </WebSocketProvider>
  );
}

export default App;