package br.com.racha.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CrudIntegrationTest {

    private static final Pattern ID = Pattern.compile("\"id\":(\\d+)");
    private static final Pattern TOKEN = Pattern.compile("\"token\":\"([^\"]+)\"");

    @Autowired
    private MockMvc mvc;

    private String token;

    private String loginSeed() throws Exception {
        MvcResult r = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"teste@racha.com\",\"senha\":\"racha1234\"}"))
                .andExpect(status().isOk())
                .andReturn();
        Matcher m = TOKEN.matcher(r.getResponse().getContentAsString());
        m.find();
        return m.group(1);
    }

    private static long idDe(MvcResult r) throws Exception {
        Matcher m = ID.matcher(r.getResponse().getContentAsString());
        m.find();
        return Long.parseLong(m.group(1));
    }

    @Test
    void loginEProtecaoDeRotas() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"teste@racha.com\",\"senha\":\"errada\"}"))
                .andExpect(status().isUnauthorized());

        mvc.perform(get("/api/usuarios")).andExpect(status().isUnauthorized());

        // Cadastro público: criar conta não exige token.
        mvc.perform(post("/api/usuarios").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Visitante\",\"email\":\"visitante@racha.com\","
                                + "\"senha\":\"senhaSegura1\",\"plano\":\"FREE\"}"))
                .andExpect(status().isCreated());

        mvc.perform(get("/api/usuarios").header("Authorization", "Bearer token-falso"))
                .andExpect(status().isUnauthorized());

        token = loginSeed();
        mvc.perform(get("/api/usuarios").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mvc.perform(post("/api/auth/logout").header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/usuarios").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crudCompletoDasTresEntidades() throws Exception {
        token = loginSeed();
        String auth = "Bearer " + token;

        // Usuario: criar (senha nunca volta na resposta)
        String usuarioJson = """
                {"nome":"Amanda","email":"amanda@racha.com","telefone":"11999999999",
                 "senha":"senhaSegura1","plano":"FREE"}
                """;
        MvcResult criado = mvc.perform(post("/api/usuarios").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(usuarioJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.senhaHash").doesNotExist())
                .andReturn();
        long usuarioId = idDe(criado);

        // Usuario: e-mail duplicado -> 409
        mvc.perform(post("/api/usuarios").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(usuarioJson))
                .andExpect(status().isConflict());

        // Usuario: validação -> 400 com campos
        mvc.perform(post("/api/usuarios").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"\",\"email\":\"x\",\"senha\":\"curta\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.email").exists());

        mvc.perform(get("/api/usuarios/" + usuarioId).header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Amanda"));

        // Grupo: criar, consultar, atualizar
        MvcResult grupo = mvc.perform(post("/api/grupos").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Apê SP\",\"tipoUso\":\"MORADIA\",\"criadoPorId\":" + usuarioId + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.criadoPorNome").value("Amanda"))
                .andReturn();
        long grupoId = idDe(grupo);

        mvc.perform(get("/api/grupos/" + grupoId).header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Apê SP"));

        mvc.perform(put("/api/grupos/" + grupoId).header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Apê SP 2\",\"tipoUso\":\"VIAGEM\",\"criadoPorId\":" + usuarioId + "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipoUso").value("VIAGEM"));

        // Despesa: criar, filtrar por grupo, atualizar, remover
        MvcResult despesa = mvc.perform(post("/api/despesas").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"descricao\":\"Aluguel\",\"valor\":2000.00,\"vencimento\":\"2026-06-20\","
                                + "\"status\":\"PENDENTE\",\"grupoId\":" + grupoId + ",\"pagaPorId\":" + usuarioId + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.valor").value(2000.00))
                .andReturn();
        long despesaId = idDe(despesa);

        mvc.perform(get("/api/despesas").param("grupoId", String.valueOf(grupoId))
                        .header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mvc.perform(put("/api/despesas/" + despesaId).header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"descricao\":\"Aluguel\",\"valor\":2000.00,\"vencimento\":\"2026-06-20\","
                                + "\"status\":\"PAGO\",\"grupoId\":" + grupoId + ",\"pagaPorId\":" + usuarioId + "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAGO"));

        mvc.perform(delete("/api/despesas/" + despesaId).header("Authorization", auth))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/despesas/" + despesaId).header("Authorization", auth))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("não encontrado")));

        // Usuario referenciado por grupo não pode ser removido -> 409
        mvc.perform(delete("/api/usuarios/" + usuarioId).header("Authorization", auth))
                .andExpect(status().isConflict());
    }
}
