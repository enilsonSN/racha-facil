import { Link } from 'react-router-dom';

// Página personalizada para rotas inexistentes (404 do SPA).
export default function ErroPage() {
  return (
    <section className="py-24">
      <div className="max-w-[520px] mx-auto px-5 text-center">
        <span className="text-[4rem] block mb-2">🍃</span>
        <p className="text-green-600 font-bold text-sm uppercase tracking-wide">Erro 404</p>
        <h1 className="text-[2rem] font-bold text-gray-900 mt-2 mb-3">Ops, esta página não existe</h1>
        <p className="text-gray-500 mb-8">
          O endereço que você acessou não foi encontrado. Que tal voltar para a página inicial?
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
