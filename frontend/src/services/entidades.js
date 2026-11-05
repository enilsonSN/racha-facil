// Uma função por endpoint do backend. Cada controller do Spring tem um service aqui.
import { apiFetch } from './api.js';

export const authService = {
  login: (email, senha) =>
    apiFetch('/auth/login', { method: 'POST', body: { email, senha }, auth: false }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
};

export const usuarioService = {
  listar: () => apiFetch('/usuarios'),
  criar: (dados) => apiFetch('/usuarios', { method: 'POST', body: dados, auth: false }),
  atualizar: (id, dados) => apiFetch(`/usuarios/${id}`, { method: 'PUT', body: dados }),
  remover: (id) => apiFetch(`/usuarios/${id}`, { method: 'DELETE' }),
};

export const grupoService = {
  listar: () => apiFetch('/grupos'),
  criar: (dados) => apiFetch('/grupos', { method: 'POST', body: dados }),
  atualizar: (id, dados) => apiFetch(`/grupos/${id}`, { method: 'PUT', body: dados }),
  remover: (id) => apiFetch(`/grupos/${id}`, { method: 'DELETE' }),
};

export const despesaService = {
  listar: (grupoId) =>
    apiFetch(grupoId ? `/despesas?grupoId=${grupoId}` : '/despesas'),
  criar: (dados) => apiFetch('/despesas', { method: 'POST', body: dados }),
  atualizar: (id, dados) => apiFetch(`/despesas/${id}`, { method: 'PUT', body: dados }),
  remover: (id) => apiFetch(`/despesas/${id}`, { method: 'DELETE' }),
};
