import { useState } from 'react';
import { despesaService, grupoService, usuarioService } from '../services/entidades.js';
import useLista from '../hooks/useLista.js';
import Campo, { estiloInput } from '../components/Campo.jsx';
import Mensagem from '../components/Mensagem.jsx';

const STATUS = ['PENDENTE', 'PAGO', 'ATRASADO'];
const VAZIO = { descricao: '', valor: '', vencimento: '', status: 'PENDENTE', grupoId: '', pagaPorId: '' };

const formatarValor = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function DespesasPage() {
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const grupos = useLista(() => grupoService.listar());
  const usuarios = useLista(() => usuarioService.listar());
  const despesas = useLista(
    () => despesaService.listar(filtroGrupo || null),
    [filtroGrupo],
  );

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

  const editar = (d) => {
    setEditandoId(d.id);
    setForm({
      descricao: d.descricao,
      valor: String(d.valor),
      vencimento: d.vencimento,
      status: d.status,
      grupoId: String(d.grupoId),
      pagaPorId: String(d.pagaPorId),
    });
    setSucesso('');
    setErro('');
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCampos({});
    const dados = {
      ...form,
      valor: Number(form.valor),
      grupoId: Number(form.grupoId),
      pagaPorId: Number(form.pagaPorId),
    };
    try {
      if (editandoId) {
        await despesaService.atualizar(editandoId, dados);
        setSucesso('Despesa atualizada.');
      } else {
        await despesaService.criar(dados);
        setSucesso('Despesa criada.');
      }
      limpar();
      despesas.recarregar();
    } catch (err) {
      setCampos(err.campos ?? {});
      setErro(err.message);
    }
  };

  const remover = async (id) => {
    if (!window.confirm('Remover esta despesa?')) return;
    setErro('');
    setSucesso('');
    try {
      await despesaService.remover(id);
      setSucesso('Despesa removida.');
      despesas.recarregar();
    } catch (err) {
      setErro(err.message);
    }
  };

  const erroGeral = erro || despesas.erro || grupos.erro || usuarios.erro;

  return (
    <section className="max-w-[1100px] mx-auto px-5 py-10">
      <h1 className="text-[1.6rem] font-bold text-gray-900 mb-1">Despesas</h1>
      <p className="text-gray-500 mb-6">Registre gastos, veja quem pagou e atualize o status.</p>

      <Mensagem tipo="sucesso">{sucesso}</Mensagem>
      <Mensagem>{erroGeral}</Mensagem>

      <form onSubmit={salvar} className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">
          {editandoId ? `Editar despesa #${editandoId}` : 'Nova despesa'}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Campo id="d-descricao" label="Descrição *" erro={campos.descricao}>
            <input id="d-descricao" required value={form.descricao} onChange={alterar('descricao')} className={estiloInput} />
          </Campo>
          <Campo id="d-valor" label="Valor (R$) *" erro={campos.valor}>
            <input id="d-valor" type="number" step="0.01" min="0.01" required value={form.valor}
              onChange={alterar('valor')} className={estiloInput} />
          </Campo>
          <Campo id="d-vencimento" label="Vencimento *" erro={campos.vencimento}>
            <input id="d-vencimento" type="date" required value={form.vencimento}
              onChange={alterar('vencimento')} className={estiloInput} />
          </Campo>
          <Campo id="d-grupo" label="Grupo *" erro={campos.grupoId}>
            <select id="d-grupo" required value={form.grupoId} onChange={alterar('grupoId')} className={estiloInput}>
              <option value="" disabled>Selecione...</option>
              {grupos.itens.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}
            </select>
          </Campo>
          <Campo id="d-pagador" label="Pago por *" erro={campos.pagaPorId}>
            <select id="d-pagador" required value={form.pagaPorId} onChange={alterar('pagaPorId')} className={estiloInput}>
              <option value="" disabled>Selecione...</option>
              {usuarios.itens.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </Campo>
          <Campo id="d-status" label="Status *" erro={campos.status}>
            <select id="d-status" value={form.status} onChange={alterar('status')} className={estiloInput}>
              {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
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
            {editandoId ? 'Salvar alterações' : 'Registrar despesa'}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3 mb-3">
        <label htmlFor="filtro-grupo" className="text-sm font-medium text-gray-700">Filtrar por grupo:</label>
        <select id="filtro-grupo" value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)}
          className="border border-gray-300 rounded-[0.4rem] px-3 py-2 text-sm bg-white">
          <option value="">Todos</option>
          {grupos.itens.map((g) => <option key={g.id} value={g.id}>{g.nome}</option>)}
        </select>
      </div>

      {despesas.carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full border-collapse bg-white text-sm">
            <thead className="bg-green-50">
              <tr>
                {['ID', 'Descrição', 'Valor', 'Grupo', 'Pago por', 'Vencimento', 'Status', 'Ações'].map((t) => (
                  <th key={t} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {despesas.itens.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">Nenhuma despesa encontrada.</td></tr>
              )}
              {despesas.itens.map((d) => (
                <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{d.id}</td>
                  <td className="px-4 py-3">{d.descricao}</td>
                  <td className="px-4 py-3">{formatarValor(d.valor)}</td>
                  <td className="px-4 py-3">{d.grupoNome}</td>
                  <td className="px-4 py-3">{d.pagaPorNome}</td>
                  <td className="px-4 py-3">{new Date(`${d.vencimento}T00:00:00`).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">{d.status}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button type="button" onClick={() => editar(d)} className="text-green-600 font-semibold hover:underline">Editar</button>
                    <button type="button" onClick={() => remover(d.id)} className="text-red-600 font-semibold hover:underline">Remover</button>
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
