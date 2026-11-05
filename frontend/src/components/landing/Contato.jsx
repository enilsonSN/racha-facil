import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Campo, { estiloInput } from '../Campo.jsx';
import Mensagem from '../Mensagem.jsx';
import { usuarioService } from '../../services/entidades.js';

const ABAS = [
  { id: 'fale', rotulo: '💬 Dúvidas / Fale Conosco' },
  { id: 'cadastro', rotulo: '📝 Cadastrar' },
];

// Seção com duas abas, controladas por estado (antes era um truque de radio + CSS).
export default function Contato() {
  const [aba, setAba] = useState('fale');

  return (
    <section id="contato" className="py-16 bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-5">
        <h2 className="text-[1.6rem] font-bold text-gray-900 mb-1">Fale com a gente</h2>
        <p className="text-gray-500 mb-8">Escolha uma opção abaixo</p>

        <div role="tablist" className="flex border-b-2 border-gray-200 mb-6">
          {ABAS.map((a) => (
            <button
              key={a.id}
              role="tab"
              type="button"
              aria-selected={aba === a.id}
              onClick={() => setAba(a.id)}
              className={`px-6 py-3 text-[0.9rem] font-semibold cursor-pointer border-b-[3px] -mb-[2px] transition-colors hover:text-green-600 ${
                aba === a.id ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent'
              }`}
            >
              {a.rotulo}
            </button>
          ))}
        </div>

        {aba === 'fale' ? <FormFaleConosco /> : <FormCadastro />}
      </div>
    </section>
  );
}

// A API ainda não tem endpoint para mensagens de contato: o envio é só visual.
function FormFaleConosco() {
  const [enviado, setEnviado] = useState(false);

  const enviar = (evento) => {
    evento.preventDefault();
    setEnviado(true);
    evento.target.reset();
  };

  return (
    <form onSubmit={enviar} className="bg-white border border-gray-200 rounded-xl p-8">
      <Mensagem tipo="sucesso">{enviado && 'Mensagem recebida! Responderemos em breve.'}</Mensagem>

      <div className="grid gap-4 md:grid-cols-2">
        <Campo id="c-nome" label="Nome *"><input id="c-nome" name="nome" required minLength={3} placeholder="Seu nome" className={estiloInput} /></Campo>
        <Campo id="c-email" label="E-mail *"><input id="c-email" name="email" type="email" required placeholder="seu@email.com" className={estiloInput} /></Campo>
        <Campo id="c-telefone" label="Telefone"><input id="c-telefone" name="telefone" type="tel" placeholder="(11) 99999-9999" className={estiloInput} /></Campo>
        <Campo id="c-assunto" label="Assunto *">
          <select id="c-assunto" name="assunto" required defaultValue="" className={estiloInput}>
            <option value="" disabled>Escolha...</option>
            <option>Dúvida sobre o plano Pro</option>
            <option>Problema técnico</option>
            <option>Sugestão de melhoria</option>
            <option>Parceria comercial</option>
          </select>
        </Campo>
      </div>

      <Campo id="c-mensagem" label="Mensagem *">
        <textarea id="c-mensagem" name="mensagem" rows={5} required minLength={10} maxLength={500}
          placeholder="Escreva sua mensagem..." className={estiloInput} />
      </Campo>

      <div className="flex justify-end">
        <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors border-none">
          Enviar mensagem
        </button>
      </div>
    </form>
  );
}

const VAZIO = { nome: '', email: '', telefone: '', senha: '', senha2: '', plano: 'FREE', termos: false };

function FormCadastro() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (evento) => {
    const valor = evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value;
    setDados((d) => ({ ...d, [campo]: valor }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setErroGeral('');

    const novosErros = {};
    if (dados.senha.length < 8) novosErros.senha = 'A senha precisa ter pelo menos 8 caracteres.';
    if (dados.senha !== dados.senha2) novosErros.senha2 = 'As senhas não conferem.';
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;

    setEnviando(true);
    try {
      await usuarioService.criar({
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone || null,
        senha: dados.senha,
        plano: dados.plano,
      });
      navigate('/login', { state: { cadastrado: true } });
    } catch (erro) {
      // Erros de campo do backend (ex.: e-mail inválido) aparecem junto de cada campo.
      setErros(erro.campos ?? {});
      setErroGeral(erro.message);
    } finally {
      setEnviando(false);
    }
  };

  const erroDe = (campo) => erros[campo];

  return (
    <form onSubmit={enviar} className="bg-white border border-gray-200 rounded-xl p-8" noValidate>
      <Mensagem>{erroGeral}</Mensagem>

      <div className="grid gap-4 md:grid-cols-2">
        <Campo id="r-nome" label="Nome completo *" erro={erroDe('nome')}>
          <input id="r-nome" value={dados.nome} onChange={alterar('nome')} placeholder="Seu nome completo" className={estiloInput} />
        </Campo>
        <Campo id="r-email" label="E-mail *" erro={erroDe('email')}>
          <input id="r-email" type="email" value={dados.email} onChange={alterar('email')} placeholder="seu@email.com" className={estiloInput} />
        </Campo>
        <Campo id="r-telefone" label="Telefone" erro={erroDe('telefone')}>
          <input id="r-telefone" type="tel" value={dados.telefone} onChange={alterar('telefone')} placeholder="(11) 99999-9999" className={estiloInput} />
        </Campo>
        <Campo id="r-senha" label="Senha *" erro={erroDe('senha')}>
          <input id="r-senha" type="password" value={dados.senha} onChange={alterar('senha')} placeholder="Mínimo 8 caracteres" autoComplete="new-password" className={estiloInput} />
        </Campo>
        <Campo id="r-senha2" label="Confirmar senha *" erro={erroDe('senha2')}>
          <input id="r-senha2" type="password" value={dados.senha2} onChange={alterar('senha2')} placeholder="Repita a senha" autoComplete="new-password" className={estiloInput} />
        </Campo>
      </div>

      <Campo id="r-plano" label="Plano desejado">
        <div className="flex gap-3 flex-wrap mt-[0.35rem]">
          {[
            { valor: 'FREE', rotulo: 'Plano Free' },
            { valor: 'PRO', rotulo: 'Plano Pro — R$ 14,90/mês' },
          ].map((p) => (
            <label
              key={p.valor}
              className={`flex items-center gap-[0.4rem] px-5 py-2 border-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                dados.plano === p.valor ? 'border-green-600 text-green-600 bg-green-50' : 'border-gray-300 text-gray-500'
              }`}
            >
              <input
                type="radio"
                name="r-plano"
                value={p.valor}
                checked={dados.plano === p.valor}
                onChange={alterar('plano')}
                className="hidden"
              />
              {p.rotulo}
            </label>
          ))}
        </div>
      </Campo>

      <label className="flex items-center gap-2 text-sm cursor-pointer mb-4">
        <input type="checkbox" checked={dados.termos} onChange={alterar('termos')} className="w-4 h-4 accent-green-600" />
        Li e aceito os <span className="text-green-600">Termos de Uso</span> e a <span className="text-green-600">Política de Privacidade</span> *
      </label>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={enviando || !dados.termos}
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? 'Criando conta...' : 'Criar minha conta'}
        </button>
      </div>
    </form>
  );
}
