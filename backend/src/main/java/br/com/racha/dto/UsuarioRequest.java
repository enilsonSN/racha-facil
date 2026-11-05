package br.com.racha.dto;

import br.com.racha.domain.PlanoTipo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Criação de usuário: exige senha. */
public record UsuarioRequest(
        @NotBlank @Size(max = 100) String nome,
        @NotBlank @Email @Size(max = 150) String email,
        @Size(max = 20) String telefone,
        @NotBlank @Size(min = 8, max = 72) String senha,
        @NotNull PlanoTipo plano
) {
}
