import { useState } from 'react';
import { usuarioService } from '../services/entidades.js';
import useLista from '../hooks/useLista.js';
import Campo, { estiloInput } from '../components/Campo.jsx';
import Mensagem from '../components/Mensagem.jsx';

const VAZIO = { nome: '', email: '', telefone: '', senha: '', plano: 'FREE' };

export default function UsuariosPage() {
  const { itens, carregando, erro, setErro, recarregar } = useLista(() => usuarioService.listar());
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [campos, setCampos] = useState({});
  const [sucesso, setSucesso] = useState('');

  const alterar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const limpar = () => {
    setForm(VAZIO);
    setEditandoId(null);
    setCampos({});
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setForm({ nome: u.nome, email: u.email, telefone: u.telefone ?? '', senha: '', plano: u.plano });
    setSucesso('');
    setErro('');
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCampos({});
    try {
      if (editandoId) {
        const { senha, ...dados } = form; // a senha não é alterada por este formulário
        await usuarioService.atualizar(editandoId, dados);
        setSucesso('Usuário atualizado.');
      } else {
        await usuarioService.criar({ ...form, telefone: form.telefone || null });
        setSucesso('Usuário criado.');
      }
      limpar();
      recarregar();
    } catch (err) {
      setCampos(err.campos ?? {});
      setErro(err.message);
    }
  };

  const remover = async (id) => {
    if (!window.confirm('Remover este usuário?')) return;
    setErro('');
    setSucesso('');
    try {
      await usuarioService.remover(id);
      setSucesso('Usuário removido.');
      recarregar();
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <section className="max-w-[1100px] mx-auto px-5 py-10">
      <h1 className="text-[1.6rem] font-bold text-gray-900 mb-1">Usuários</h1>
      <p className="text-gray-500 mb-6">Consulte, cadastre, edite e remova usuários.</p>

      <Mensagem tipo="sucesso">{sucesso}</Mensagem>
      <Mensagem>{erro}</Mensagem>

      <form onSubmit={salvar} className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">
          {editandoId ? `Editar usuário #${editandoId}` : 'Novo usuário'}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Campo id="u-nome" label="Nome *" erro={campos.nome}>
            <input id="u-nome" required value={form.nome} onChange={alterar('nome')} className={estiloInput} />
          </Campo>
          <Campo id="u-email" label="E-mail *" erro={campos.email}>
            <input id="u-email" type="email" required value={form.email} onChange={alterar('email')} className={estiloInput} />
          </Campo>
          <Campo id="u-telefone" label="Telefone" erro={campos.telefone}>
            <input id="u-telefone" value={form.telefone} onChange={alterar('telefone')} className={estiloInput} />
          </Campo>
          <Campo id="u-plano" label="Plano">
            <select id="u-plano" value={form.plano} onChange={alterar('plano')} className={estiloInput}>
              <option value="FREE">Free</option>
              <option value="PRO">Pro</option>
            </select>
          </Campo>
          {!editandoId && (
            <Campo id="u-senha" label="Senha * (mínimo 8)" erro={campos.senha}>
              <input id="u-senha" type="password" required minLength={8} value={form.senha}
                onChange={alterar('senha')} autoComplete="new-password" className={estiloInput} />
            </Campo>
          )}
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
            {editandoId ? 'Salvar alterações' : 'Cadastrar'}
          </button>
        </div>
      </form>

      {carregando ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full border-collapse bg-white text-sm">
            <thead className="bg-green-50">
              <tr>
                {['ID', 'Nome', 'E-mail', 'Telefone', 'Plano', 'Ações'].map((t) => (
                  <th key={t} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-700">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">Nenhum usuário cadastrado.</td></tr>
              )}
              {itens.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.nome}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.telefone ?? '—'}</td>
                  <td className="px-4 py-3">{u.plano}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button type="button" onClick={() => editar(u)} className="text-green-600 font-semibold hover:underline">Editar</button>
                    <button type="button" onClick={() => remover(u.id)} className="text-red-600 font-semibold hover:underline">Remover</button>
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
