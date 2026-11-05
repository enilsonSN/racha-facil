import { useState } from 'react';
import { grupoService, usuarioService } from '../services/entidades.js';
import useLista from '../hooks/useLista.js';
import Campo, { estiloInput } from '../components/Campo.jsx';
import Mensagem from '../components/Mensagem.jsx';

const TIPOS = ['MORADIA', 'VIAGEM', 'MERCADO', 'FESTAS'];
const VAZIO = { nome: '', tipoUso: 'MORADIA', criadoPorId: '' };

export default function GruposPage() {
  const grupos = useLista(() => grupoService.listar());
  const usuarios = useLista(() => usuarioService.listar());
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [campos, setCampos] = useState({});
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const alterar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const limpar = () => {
    setForm(VAZIO);
    setEditandoId(null);
    setCampos({});
  };

  const editar = (g) => {
    setEditandoId(g.id);
    setForm({ nome: g.nome, tipoUso: g.tipoUso, criadoPorId: String(g.criadoPorId) });
    setSucesso('');
    setErro('');
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCampos({});
    const dados = { ...form, criadoPorId: Number(form.criadoPorId) };
    try {
      if (editandoId) {
        await grupoService.atualizar(editandoId, dados);
        setSucesso('Grupo atualizado.');
      } else {
        await grupoService.criar(dados);
        setSucesso('Grupo criado.');
      }
      limpar();
      grupos.recarregar();
    } catch (err) {
      setCampos(err.campos ?? {});
      setErro(err.message);
    }
  };

  const remover = async (id) => {
    if (!window.confirm('Remover este grupo? As despesas dele também serão afetadas.')) return;
    setErro('');
    setSucesso('');
    try {
      await grupoService.remover(id);
      setSucesso('Grupo removido.');
      grupos.recarregar();
    } catch (err) {
      setErro(err.message);
    }
  };

  const erroGeral = erro || grupos.erro || usuarios.erro;

  return (
    <section className="max-w-[1100px] mx-auto px-5 py-10">
      <h1 className="text-[1.6rem] font-bold text-gray-900 mb-1">Grupos</h1>
      <p className="text-gray-500 mb-6">Cada grupo é um racha: consulte, crie, edite e remova.</p>

      <Mensagem tipo="sucesso">{sucesso}</Mensagem>
      <Mensagem>{erroGeral}</Mensagem>

      <form onSubmit={salvar} className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">
          {editandoId ? `Editar grupo #${editandoId}` : 'Novo grupo'}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Campo id="g-nome" label="Nome *" erro={campos.nome}>
            <input id="g-nome" required value={form.nome} onChange={alterar('nome')} className={estiloInput} />
          </Campo>
          <Campo id="g-tipo" label="Tipo de uso *" erro={campos.tipoUso}>
            <select id="g-tipo" value={form.tipoUso} onChange={alterar('tipoUso')} className={estiloInput}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Campo>
          <Campo id="g-criador" label="Criado por *" erro={campos.criadoPorId}>
            <select id="g-criador" required value={form.criadoPorId} onChange={alterar('criadoPorId')} className={estiloInput}>
              <option value="" disabled>Selecione...</option>
              {usuarios.itens.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </Campo>
        </div>
        <div className="flex gap-3 justify-end">
          {editandoId && (
            <button type="button" onClick={limpar}
              className="px-5 py-2 rounded-lg text-sm font-semibold border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors">
              Cancelar
            </button>
          )}
          <button type="submit"
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors border-none">
            {editandoId ? 'Salvar alterações' : 'Criar grupo'}
          </button>
        </div>
      </form>

      {grupos.carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full border-collapse bg-white text-sm">
            <thead className="bg-green-50">
              <tr>
                {['ID', 'Nome', 'Tipo de uso', 'Criado por', 'Ações'].map((t) => (
                  <th key={t} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grupos.itens.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Nenhum grupo cadastrado.</td></tr>
              )}
              {grupos.itens.map((g) => (
                <tr key={g.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{g.id}</td>
                  <td className="px-4 py-3">{g.nome}</td>
                  <td className="px-4 py-3">{g.tipoUso}</td>
                  <td className="px-4 py-3">{g.criadoPorNome}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button type="button" onClick={() => editar(g)} className="text-green-600 font-semibold hover:underline">Editar</button>
                    <button type="button" onClick={() => remover(g.id)} className="text-red-600 font-semibold hover:underline">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
