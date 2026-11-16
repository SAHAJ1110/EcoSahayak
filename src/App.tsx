import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { HomePage } from './pages/HomePage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MyReportsPage } from './pages/MyReportsPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { EcoRewardsPage } from './pages/EcoRewardsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DroneSurveyPage } from './pages/DroneSurveyPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { AuthPage } from './pages/AuthPage';

export function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#FFF8E7] text-[#29332B] font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/report" element={<ReportIssuePage />} />
                <Route path="/my-reports" element={<MyReportsPage />} />
                <Route path="/heatmap" element={<HeatmapPage />} />
                <Route path="/rewards" element={<EcoRewardsPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/drone" element={<DroneSurveyPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;
