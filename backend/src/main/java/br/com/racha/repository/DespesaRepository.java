package br.com.racha.repository;

import br.com.racha.domain.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByGrupoId(Long grupoId);
}
