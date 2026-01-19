import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './shared/layout/MainLayout';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { RegisterPage } from './modules/auth/pages/RegisterPage';
import { DashboardPage } from './modules/dashboard/pages/DashboardPage';
import { VacasPage } from './modules/vaca/pages/VacasPage';
import { OrdenoPage } from './modules/ordeno/pages/OrdenoPage';
import { AuthProvider } from './modules/auth/AuthContext';
import { ProtectedRoute } from './modules/auth/ProtectedRoute';
import { PublicRoute } from './modules/auth/PublicRoute';
import { ProfilePage } from './modules/auth/pages/ProfileInfoPage';
import { GanaderiaProvider } from './shared/context/GanaderiaContext';

function App() {
  return (
    <AuthProvider>
      <GanaderiaProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes (Redirect to dashboard if logged in) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Private Routes (Redirect to login if NOT logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/vacas" element={<VacasPage />} />
                <Route path="/ordeno" element={<OrdenoPage />} />
                <Route path="/ordenos" element={<OrdenoPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GanaderiaProvider>
    </AuthProvider>
  )
}

export default App
