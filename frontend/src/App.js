import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Styles/index.css';
import Home from './Pages/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}