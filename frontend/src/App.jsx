import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ErroPage from './pages/ErroPage.jsx';
import UsuariosPage from './pages/UsuariosPage.jsx';
import GruposPage from './pages/GruposPage.jsx';
import DespesasPage from './pages/DespesasPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas que exigem login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/grupos" element={<GruposPage />} />
          <Route path="/despesas" element={<DespesasPage />} />
        </Route>

        <Route path="*" element={<ErroPage />} />
      </Route>
    </Routes>
  );
}
