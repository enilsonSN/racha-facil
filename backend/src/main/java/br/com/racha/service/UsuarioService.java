package br.com.racha.service;

import br.com.racha.domain.Usuario;
import br.com.racha.dto.UsuarioAtualizacaoRequest;
import br.com.racha.dto.UsuarioRequest;
import br.com.racha.dto.UsuarioResponse;
import br.com.racha.exception.ConflictException;
import br.com.racha.exception.NotFoundException;
import br.com.racha.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repository.findAll().stream().map(UsuarioResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscar(Long id) {
        return UsuarioResponse.from(entidade(id));
    }

    public UsuarioResponse criar(UsuarioRequest req) {
        if (repository.existsByEmailIgnoreCase(req.email())) {
            throw new ConflictException("Já existe usuário com o e-mail " + req.email());
        }
        Usuario u = new Usuario();
        u.setNome(req.nome());
        u.setEmail(req.email());
        u.setTelefone(req.telefone());
        u.setSenhaHash(passwordEncoder.encode(req.senha()));
        u.setPlano(req.plano());
        return UsuarioResponse.from(repository.save(u));
    }

    public UsuarioResponse atualizar(Long id, UsuarioAtualizacaoRequest req) {
        Usuario u = entidade(id);
        if (repository.existsByEmailIgnoreCaseAndIdNot(req.email(), id)) {
            throw new ConflictException("Já existe usuário com o e-mail " + req.email());
        }
        u.setNome(req.nome());
        u.setEmail(req.email());
        u.setTelefone(req.telefone());
        u.setPlano(req.plano());
        return UsuarioResponse.from(u);
    }

    public void remover(Long id) {
        repository.delete(entidade(id));
    }

    Usuario entidade(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Usuário", id));
    }
}
