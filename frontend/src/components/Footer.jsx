import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-10 pb-4">
      <div className="max-w-[1100px] mx-auto px-5 flex gap-12 flex-wrap pb-8 border-b border-gray-700 mb-5">
        <div>
          <p className="text-xl font-bold text-white mb-1">🍃 RachaFácil</p>
          <p className="text-[0.85rem]">Divida contas. Viva em harmonia.</p>
        </div>

        <nav className="flex flex-col gap-[0.4rem] text-sm">
          <strong className="text-white mb-1">Navegação</strong>
          <Link to="/#como-funciona" className="text-gray-400 hover:text-white transition-colors">Como Funciona</Link>
          <Link to="/#despesas" className="text-gray-400 hover:text-white transition-colors">Recursos</Link>
          <Link to="/#planos" className="text-gray-400 hover:text-white transition-colors">Planos</Link>
        </nav>

        <address className="flex flex-col gap-[0.4rem] text-sm not-italic">
          <strong className="text-white mb-1">Contato</strong>
          <a href="mailto:contato@rachafacil.com.br" className="text-gray-400 hover:text-white transition-colors">
            contato@rachafacil.com.br
          </a>
          <span>São Paulo, SP</span>
        </address>
      </div>

      <p className="text-center text-[0.8rem] text-gray-600 px-5">
        © 2026 RachaFácil. Todos os direitos reservados.
      </p>
    </footer>
  );
}
