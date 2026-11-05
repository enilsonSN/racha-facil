// Cliente HTTP único: adiciona o token, trata erros e expira a sessão no 401.

export const CHAVE_SESSAO = 'racha.sessao';
export const EVENTO_SESSAO_EXPIRADA = 'racha:sessao-expirada';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

export function getToken() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO))?.token ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  }

  if (res.status === 401 && auth) {
    localStorage.removeItem(CHAVE_SESSAO);
    window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const erro = new Error(data?.message ?? 'Erro inesperado na requisição.');
    erro.status = res.status;
    erro.campos = data?.campos ?? {};
    throw erro;
  }
  return data;
}
