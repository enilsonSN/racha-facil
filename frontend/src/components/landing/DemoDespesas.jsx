// Exemplo ilustrativo (dados fixos da landing). As telas reais de despesas ficam em /despesas.
const EXEMPLOS = [
  { icone: '🏠', nome: 'Aluguel', valor: 'R$ 2.000,00', pagoPor: 'Amanda', vencimento: '20/06/2026', status: 'Pago' },
  { icone: '🌊', nome: 'Viagem', valor: 'R$ 850,00', pagoPor: 'Carlos', vencimento: '25/06/2026', status: 'Pendente' },
  { icone: '🛒', nome: 'Mercado', valor: 'R$ 320,40', pagoPor: 'Julia', vencimento: '18/06/2026', status: 'Pago' },
  { icone: '🎬', nome: 'Netflix', valor: 'R$ 55,90', pagoPor: 'Pedro', vencimento: '30/06/2026', status: 'Atrasado' },
];

const ESTILO_STATUS = {
  Pago: 'bg-green-100 text-green-600',
  Pendente: 'bg-orange-100 text-orange-600',
  Atrasado: 'bg-red-100 text-red-600',
};

const celula = 'px-4 py-[0.85rem] text-sm text-gray-700 border-t border-gray-100';

export default function DemoDespesas() {
  return (
    <section id="despesas" className="py-16">
      <div className="max-w-[1100px] mx-auto px-5">
        <h2 className="text-[1.6rem] font-bold text-gray-900 mb-1">
          Veja um exemplo de como fica fácil visualizar...
        </h2>
        <p className="text-gray-500 mb-8">Veja quem pagou e quem ainda deve</p>

        <div className="overflow-x-auto">
          <div className="rounded-xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-green-50">
                <tr>
                  {['Despesa', 'Valor', 'Pago por', 'Vencimento', 'Status'].map((titulo) => (
                    <th
                      key={titulo}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
                    >
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXEMPLOS.map((e) => (
                  <tr key={e.nome} className="hover:bg-gray-50">
                    <td className={celula}>{e.icone} {e.nome}</td>
                    <td className={celula}>{e.valor}</td>
                    <td className={celula}>{e.pagoPor}</td>
                    <td className={celula}>{e.vencimento}</td>
                    <td className={celula}>
                      <span className={`inline-block px-[0.65rem] py-1 rounded-full text-xs font-semibold ${ESTILO_STATUS[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
