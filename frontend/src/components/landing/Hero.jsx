import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="banner py-20">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="banner-texto max-w-[45%]">
          <h1 className="text-[2.5rem] font-bold text-gray-900 leading-tight mb-4">
            Divida contas.
            <br />
            <span className="text-green-600">Viva em harmonia.</span>
          </h1>
          <p className="text-gray-500 text-[1.05rem] mb-8">
            Organize os gastos da casa, das viagens e dos rachas com quem você divide a vida.
            Veja quem pagou, quem deve e pague com Pix sem complicação.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/#contato"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors border-none"
            >
              Criar conta grátis
            </Link>
            <Link
              to="/#como-funciona"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
