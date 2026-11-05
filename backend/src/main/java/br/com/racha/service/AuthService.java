package br.com.racha.service;

import br.com.racha.domain.SessaoToken;
import br.com.racha.domain.Usuario;
import br.com.racha.dto.LoginRequest;
import br.com.racha.dto.LoginResponse;
import br.com.racha.dto.UsuarioResponse;
import br.com.racha.exception.UnauthorizedException;
import br.com.racha.repository.SessaoTokenRepository;
import br.com.racha.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@Transactional
public class AuthService {

    private static final long HORAS_DE_VALIDADE = 8;

    private final UsuarioRepository usuarios;
    private final SessaoTokenRepository sessoes;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    public AuthService(UsuarioRepository usuarios, SessaoTokenRepository sessoes,
                       PasswordEncoder passwordEncoder) {
        this.usuarios = usuarios;
        this.sessoes = sessoes;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest req) {
        // Mesma mensagem para e-mail inexistente e senha errada, para não revelar contas.
        Usuario u = usuarios.findByEmailIgnoreCase(req.email())
                .filter(x -> passwordEncoder.matches(req.senha(), x.getSenhaHash()))
                .orElseThrow(() -> new UnauthorizedException("E-mail ou senha inválidos."));

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime expira = agora.plusHours(HORAS_DE_VALIDADE);
        sessoes.save(new SessaoToken(token, u, agora, expira));

        return new LoginResponse(token, expira, UsuarioResponse.from(u));
    }

    public void logout(String token) {
        sessoes.findById(token).ifPresent(sessoes::delete);
    }

    /** Valida o token e devolve o usuário dono da sessão. */
    @Transactional(readOnly = true)
    public Usuario validar(String token) {
        SessaoToken sessao = sessoes.findById(token)
                .orElseThrow(() -> new UnauthorizedException("Token inválido."));
        if (sessao.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Sessão expirada. Faça login novamente.");
        }
        return sessao.getUsuario();
    }
}
