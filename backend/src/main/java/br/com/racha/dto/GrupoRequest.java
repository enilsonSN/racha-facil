package br.com.racha.dto;

import br.com.racha.domain.TipoUso;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GrupoRequest(
        @NotBlank @Size(max = 100) String nome,
        @NotNull TipoUso tipoUso,
        @NotNull Long criadoPorId
) {
}
