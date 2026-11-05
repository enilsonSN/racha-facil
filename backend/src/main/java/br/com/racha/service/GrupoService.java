package br.com.racha.service;

import br.com.racha.domain.Grupo;
import br.com.racha.domain.Usuario;
import br.com.racha.dto.GrupoRequest;
import br.com.racha.dto.GrupoResponse;
import br.com.racha.exception.NotFoundException;
import br.com.racha.repository.GrupoRepository;
import br.com.racha.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final UsuarioRepository usuarioRepository;

    public GrupoService(GrupoRepository grupoRepository, UsuarioRepository usuarioRepository) {
        this.grupoRepository = grupoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<GrupoResponse> listar() {
        return grupoRepository.findAll().stream().map(GrupoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public GrupoResponse buscar(Long id) {
        return GrupoResponse.from(buscarEntidade(id));
    }

    public GrupoResponse criar(GrupoRequest req) {
        Grupo grupo = new Grupo();
        preencher(grupo, req);
        return GrupoResponse.from(grupoRepository.save(grupo));
    }

    public GrupoResponse atualizar(Long id, GrupoRequest req) {
        Grupo grupo = buscarEntidade(id);
        preencher(grupo, req);
        return GrupoResponse.from(grupo);
    }

    public void remover(Long id) {
        grupoRepository.delete(buscarEntidade(id));
    }

    private void preencher(Grupo grupo, GrupoRequest req) {
        Usuario criador = usuarioRepository.findById(req.criadoPorId())
                .orElseThrow(() -> new NotFoundException("Usuário", req.criadoPorId()));
        grupo.setNome(req.nome());
        grupo.setTipoUso(req.tipoUso());
        grupo.setCriadoPor(criador);
    }

    private Grupo buscarEntidade(Long id) {
        return grupoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Grupo", id));
    }
}
