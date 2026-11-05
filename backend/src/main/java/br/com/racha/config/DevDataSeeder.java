package br.com.racha.config;

import br.com.racha.domain.Despesa;
import br.com.racha.domain.Grupo;
import br.com.racha.domain.PlanoTipo;
import br.com.racha.domain.StatusDespesa;
import br.com.racha.domain.TipoUso;
import br.com.racha.domain.Usuario;
import br.com.racha.repository.DespesaRepository;
import br.com.racha.repository.GrupoRepository;
import br.com.racha.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Dados de exemplo para o perfil dev: um usuário de teste, um grupo e duas despesas.
 * Roda só uma vez (se o usuário de teste ainda não existir).
 */
@Component
@Profile("dev")
public class DevDataSeeder implements CommandLineRunner {

    public static final String EMAIL_TESTE = "teste@racha.com";
    public static final String SENHA_TESTE = "racha1234";

    private final UsuarioRepository usuarios;
    private final GrupoRepository grupos;
    private final DespesaRepository despesas;
    private final PasswordEncoder passwordEncoder;

    public DevDataSeeder(UsuarioRepository usuarios, GrupoRepository grupos,
                         DespesaRepository despesas, PasswordEncoder passwordEncoder) {
        this.usuarios = usuarios;
        this.grupos = grupos;
        this.despesas = despesas;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarios.existsByEmailIgnoreCase(EMAIL_TESTE)) {
            return;
        }

        Usuario teste = new Usuario();
        teste.setNome("Usuário Teste");
        teste.setEmail(EMAIL_TESTE);
        teste.setTelefone("11999999999");
        teste.setSenhaHash(passwordEncoder.encode(SENHA_TESTE));
        teste.setPlano(PlanoTipo.PRO);
        usuarios.save(teste);

        Grupo apartamento = new Grupo();
        apartamento.setNome("Apê");
        apartamento.setTipoUso(TipoUso.MORADIA);
        apartamento.setCriadoPor(teste);
        grupos.save(apartamento);

        despesas.save(despesa("Aluguel", "2000.00", LocalDate.of(2026, 6, 20),
                StatusDespesa.PAGO, apartamento, teste));
        despesas.save(despesa("Mercado", "320.40", LocalDate.of(2026, 6, 25),
                StatusDespesa.PENDENTE, apartamento, teste));
    }

    private static Despesa despesa(String descricao, String valor, LocalDate vencimento,
                                   StatusDespesa status, Grupo grupo, Usuario pagador) {
        Despesa d = new Despesa();
        d.setDescricao(descricao);
        d.setValor(new BigDecimal(valor));
        d.setVencimento(vencimento);
        d.setStatus(status);
        d.setGrupo(grupo);
        d.setPagaPor(pagador);
        return d;
    }
}
