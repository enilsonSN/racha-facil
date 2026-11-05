const PASSOS = [
  { icone: '📝', titulo: 'Crie sua conta', texto: 'Cadastro gratuito em menos de 1 minuto' },
  { icone: '👥', titulo: 'Monte seu grupo', texto: 'Adicione amigos, família ou colegas' },
  { icone: '💸', titulo: 'Registre as despesas', texto: 'Adicione contas e escolha como dividir' },
  { icone: '✅', titulo: 'Pague com Pix', texto: 'Quitação rápida direto pelo app' },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-16 bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-5">
        <h2 className="text-[1.6rem] font-bold text-gray-900 mb-1">Como Funciona</h2>
        <p className="text-gray-500 mb-8">Em 4 passos simples você já está dividindo</p>

        <div className="flex gap-5 flex-wrap">
          {PASSOS.map((p) => (
            <article
              key={p.titulo}
              className="flex-1 basis-[180px] bg-white border border-gray-200 rounded-xl p-6 text-center transition-all hover:shadow-[0_4px_12px_rgba(22,163,74,0.12)] hover:border-green-300"
            >
              <span className="text-[2rem] block mb-3">{p.icone}</span>
              <h3 className="text-[0.95rem] font-semibold text-gray-900 mb-1">{p.titulo}</h3>
              <p className="text-[0.85rem] text-gray-500">{p.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
