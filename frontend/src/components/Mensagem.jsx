// Faixa de feedback (sucesso ou erro) usada nas páginas de CRUD.
export default function Mensagem({ tipo = 'erro', children }) {
  if (!children) return null;
  const estilo =
    tipo === 'sucesso'
      ? 'bg-green-50 border-green-300 text-green-700'
      : 'bg-red-50 border-red-300 text-red-700';
  return (
    <div role="alert" className={`border rounded-lg px-4 py-3 text-sm mb-4 ${estilo}`}>
      {children}
    </div>
  );
}
