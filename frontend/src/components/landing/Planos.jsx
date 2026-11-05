import { Link } from 'react-router-dom';

export default function Planos() {
  return (
    <section id="planos" className="py-16">
      <div className="max-w-[1100px] mx-auto px-5">
        <h2 className="text-[1.6rem] font-bold text-gray-900 mb-1">Escolha seu plano</h2>
        <p className="text-gray-500 mb-8">Comece de graça, evolua quando quiser</p>

        <div className="flex gap-6 flex-wrap justify-center">
          <div className="flex-1 basis-[280px] max-w-[360px] border-2 border-gray-200 rounded-xl p-8 text-center">
            <h3 className="text-[1.1rem] font-bold text-gray-900 my-2">Plano Free</h3>
            <p className="text-[2.2rem] font-bold text-green-600 mt-3 mb-1">R$ 0</p>
            <p className="text-[0.85rem] text-gray-400 mb-5">Para sempre gratuito</p>
            <ul className="text-left text-sm text-gray-700 mb-6 space-y-1">
              <li>✅ Até 3 grupos</li>
              <li>✅ Até 5 membros por grupo</li>
              <li>✅ Pix integrado</li>
              <li>❌ Lembretes automáticos</li>
              <li>❌ Relatórios avançados</li>
            </ul>
            <Link
              to="/#contato"
              className="block w-full px-5 py-2 rounded-lg text-sm font-semibold bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
            >
              Começar grátis
            </Link>
          </div>

          <div className="flex-1 basis-[280px] max-w-[360px] border-2 border-green-600 rounded-xl p-8 text-center bg-gradient-to-br from-green-600 to-green-700">
            <span className="inline-block px-[0.65rem] py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
              Mais popular
            </span>
            <h3 className="text-[1.1rem] font-bold text-white my-2">Plano Pro</h3>
            <p className="text-[2.2rem] font-bold text-white mt-3 mb-1">
              R$ 14,90<small className="text-base font-normal">/mês</small>
            </p>
            <p className="text-[0.85rem] text-green-200 mb-5">Tudo do Free, mais:</p>
            <ul className="text-left text-sm text-white mb-6 space-y-1">
              <li>✅ Grupos ilimitados</li>
              <li>✅ Membros ilimitados</li>
              <li>✅ Pix integrado</li>
              <li>✅ Lembretes automáticos</li>
              <li>✅ Relatórios avançados</li>
            </ul>
            <Link
              to="/#contato"
              className="block w-full px-5 py-2 rounded-lg text-sm font-semibold bg-white text-green-600 hover:bg-green-50 transition-colors"
            >
              Assinar Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
