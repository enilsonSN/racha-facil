package br.com.racha.dto;

import br.com.racha.domain.PlanoTipo;
import br.com.racha.domain.Usuario;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        PlanoTipo plano,
        LocalDateTime criadoEm
) {
    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(),
                u.getTelefone(), u.getPlano(), u.getCriadoEm());
    }
}
