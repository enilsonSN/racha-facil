import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/entidades.js';
import { CHAVE_SESSAO, EVENTO_SESSAO_EXPIRADA } from '../services/api.js';

const AuthContext = createContext(null);

function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessao);

  // Quando qualquer requisição recebe 401, a sessão local é encerrada.
  useEffect(() => {
    const expirou = () => setSessao(null);
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, expirou);
    return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, expirou);
  }, []);

  const login = useCallback(async (email, senha) => {
    const resposta = await authService.login(email, senha);
    const nova = {
      token: resposta.token,
      expiraEm: resposta.expiraEm,
      usuario: resposta.usuario,
    };
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(nova));
    setSessao(nova);
    return nova;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (sessao) await authService.logout();
    } catch {
      // Mesmo que o servidor falhe, a sessão local é encerrada.
    }
    localStorage.removeItem(CHAVE_SESSAO);
    setSessao(null);
  }, [sessao]);

  const valor = useMemo(() => ({ sessao, login, logout }), [sessao, login, logout]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return contexto;
}
