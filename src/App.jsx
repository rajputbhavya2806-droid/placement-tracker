import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PlacementProvider } from './context/PlacementContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Companies } from './pages/Companies';
import { Applications } from './pages/Applications';
import { Interviews } from './pages/Interviews';
import { Preparation } from './pages/Preparation';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <PlacementProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/preparation" element={<Preparation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </PlacementProvider>
  );
}

