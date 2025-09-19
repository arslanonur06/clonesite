import { Routes, Route } from 'react-router-dom';
import ComprehensiveDashboard from './components/ComprehensiveDashboard';
import ProfessionalIGamingTools from './components/ProfessionalIGamingTools';
import { WebSocketProvider } from './hooks/useWebSocket';

function App() {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/" element={<ComprehensiveDashboard />} />
        <Route path="/igaming-tools" element={<ProfessionalIGamingTools />} />
        <Route path="/*" element={<ComprehensiveDashboard />} />
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
