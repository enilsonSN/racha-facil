package br.com.racha.dto;

import br.com.racha.domain.StatusDespesa;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DespesaRequest(
        @NotBlank @Size(max = 150) String descricao,
        @NotNull @DecimalMin("0.01") @Digits(integer = 10, fraction = 2) BigDecimal valor,
        @NotNull LocalDate vencimento,
        @NotNull StatusDespesa status,
        @NotNull Long grupoId,
        @NotNull Long pagaPorId
) {
}
