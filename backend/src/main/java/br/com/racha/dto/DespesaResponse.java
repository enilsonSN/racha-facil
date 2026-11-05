package br.com.racha.dto;

import br.com.racha.domain.Despesa;
import br.com.racha.domain.StatusDespesa;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DespesaResponse(
        Long id,
        String descricao,
        BigDecimal valor,
        LocalDate vencimento,
        StatusDespesa status,
        Long grupoId,
        String grupoNome,
        Long pagaPorId,
        String pagaPorNome
) {
    public static DespesaResponse from(Despesa d) {
        return new DespesaResponse(d.getId(), d.getDescricao(), d.getValor(), d.getVencimento(),
                d.getStatus(), d.getGrupo().getId(), d.getGrupo().getNome(),
                d.getPagaPor().getId(), d.getPagaPor().getNome());
    }
}
