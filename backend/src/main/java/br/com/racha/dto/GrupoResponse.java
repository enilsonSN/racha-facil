package br.com.racha.dto;

import br.com.racha.domain.Grupo;
import br.com.racha.domain.TipoUso;

public record GrupoResponse(
        Long id,
        String nome,
        TipoUso tipoUso,
        Long criadoPorId,
        String criadoPorNome
) {
    public static GrupoResponse from(Grupo g) {
        return new GrupoResponse(g.getId(), g.getNome(), g.getTipoUso(),
                g.getCriadoPor().getId(), g.getCriadoPor().getNome());
    }
}
