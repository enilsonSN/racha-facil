import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkMenu = 'text-gray-500 hover:text-green-600 transition-colors';
const linkAtivo = ({ isActive }) =>
  isActive ? 'text-green-600 font-semibold' : linkMenu;

export default function Header() {
  const { sessao, logout } = useAuth();
  const navigate = useNavigate();

  const sair = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
      <div className="max-w-[1100px] mx-auto px-5 flex items-center justify-between gap-4 py-4">
        <Link to="/" className="text-xl font-bold text-green-600 whitespace-nowrap">
          🍃 RachaFácil
        </Link>

        <nav className="hidden md:flex gap-6 text-sm">
          {sessao ? (
            <>
              <NavLink to="/usuarios" className={linkAtivo}>Usuários</NavLink>
              <NavLink to="/grupos" className={linkAtivo}>Grupos</NavLink>
              <NavLink to="/despesas" className={linkAtivo}>Despesas</NavLink>
            </>
          ) : (
            <>
              <Link to="/#como-funciona" className={linkMenu}>Como Funciona</Link>
              <Link to="/#despesas" className={linkMenu}>Recursos</Link>
              <Link to="/#planos" className={linkMenu}>Planos</Link>
              <Link to="/#contato" className={linkMenu}>Contato</Link>
            </>
          )}
        </nav>

        <div className="flex gap-2">
          {sessao ? (
            <button
              type="button"
              onClick={sair}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
            >
              Sair
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
              >
                Entrar
              </button>
              <Link
                to="/#contato"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors border-none"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
