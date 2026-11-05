import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Campo, { estiloInput } from '../components/Campo.jsx';
import Mensagem from '../components/Mensagem.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from ?? '/usuarios';
  const cadastrado = location.state?.cadastrado;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async (evento) => {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await login(email, senha);
      navigate(destino, { replace: true });
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-[420px] mx-auto px-5">
        <h1 className="text-[1.6rem] font-bold text-gray-900 mb-1">Entrar</h1>
        <p className="text-gray-500 mb-8">Acesse sua conta do RachaFácil</p>

        <form onSubmit={entrar} className="bg-white border border-gray-200 rounded-xl p-8">
          <Mensagem tipo="sucesso">{cadastrado && 'Conta criada! Agora é só entrar.'}</Mensagem>
          <Mensagem>{erro}</Mensagem>

          <Campo id="login-email" label="E-mail">
            <input id="login-email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
              autoComplete="email" className={estiloInput} />
          </Campo>
          <Campo id="login-senha" label="Senha">
            <input id="login-senha" type="password" required value={senha}
              onChange={(e) => setSenha(e.target.value)} autoComplete="current-password"
              className={estiloInput} />
          </Campo>

          <button type="submit" disabled={enviando}
            className="w-full px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors border-none disabled:opacity-50">
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  );
}
