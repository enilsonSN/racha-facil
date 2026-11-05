package br.com.racha.dto;

import br.com.racha.domain.PlanoTipo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Atualização de usuário: senha não é alterada por este endpoint. */
public record UsuarioAtualizacaoRequest(
        @NotBlank @Size(max = 100) String nome,
        @NotBlank @Email @Size(max = 150) String email,
        @Size(max = 20) String telefone,
        @NotNull PlanoTipo plano
) {
}
