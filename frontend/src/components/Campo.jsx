// Campo de formulário reutilizável: label + input/select/textarea + erro de validação.
export default function Campo({ id, label, erro, children, className = '' }) {
  return (
    <div className={`campo flex flex-col mb-4 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-[0.35rem]">
        {label}
      </label>
      {children}
      {erro && <span className="text-xs text-red-600 mt-1">{erro}</span>}
    </div>
  );
}

export const estiloInput =
  'border border-gray-300 rounded-[0.4rem] px-3 py-[0.6rem] text-[0.9rem] text-gray-700 bg-white w-full transition-colors focus:outline-none focus:border-green-600 focus:shadow-[0_0_0_2px_rgba(22,163,74,0.15)]';
