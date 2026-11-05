package br.com.racha.service;

import br.com.racha.domain.Despesa;
import br.com.racha.domain.Grupo;
import br.com.racha.domain.Usuario;
import br.com.racha.dto.DespesaRequest;
import br.com.racha.dto.DespesaResponse;
import br.com.racha.exception.NotFoundException;
import br.com.racha.repository.DespesaRepository;
import br.com.racha.repository.GrupoRepository;
import br.com.racha.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DespesaService {

    private final DespesaRepository despesaRepository;
    private final GrupoRepository grupoRepository;
    private final UsuarioRepository usuarioRepository;

    public DespesaService(DespesaRepository despesaRepository, GrupoRepository grupoRepository,
                          UsuarioRepository usuarioRepository) {
        this.despesaRepository = despesaRepository;
        this.grupoRepository = grupoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<DespesaResponse> listar(Long grupoId) {
        List<Despesa> despesas = grupoId == null
                ? despesaRepository.findAll()
                : despesaRepository.findByGrupoId(grupoId);
        return despesas.stream().map(DespesaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public DespesaResponse buscar(Long id) {
        return DespesaResponse.from(buscarEntidade(id));
    }

    public DespesaResponse criar(DespesaRequest req) {
        Despesa despesa = new Despesa();
        preencher(despesa, req);
        return DespesaResponse.from(despesaRepository.save(despesa));
    }

    public DespesaResponse atualizar(Long id, DespesaRequest req) {
        Despesa despesa = buscarEntidade(id);
        preencher(despesa, req);
        return DespesaResponse.from(despesa);
    }

    public void remover(Long id) {
        despesaRepository.delete(buscarEntidade(id));
    }

    private void preencher(Despesa despesa, DespesaRequest req) {
        Grupo grupo = grupoRepository.findById(req.grupoId())
                .orElseThrow(() -> new NotFoundException("Grupo", req.grupoId()));
        Usuario pagador = usuarioRepository.findById(req.pagaPorId())
                .orElseThrow(() -> new NotFoundException("Usuário", req.pagaPorId()));

        despesa.setDescricao(req.descricao());
        despesa.setValor(req.valor());
        despesa.setVencimento(req.vencimento());
        despesa.setStatus(req.status());
        despesa.setGrupo(grupo);
        despesa.setPagaPor(pagador);
    }

    private Despesa buscarEntidade(Long id) {
        return despesaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Despesa", id));
    }
}
