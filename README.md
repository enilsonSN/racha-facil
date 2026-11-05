# 🍃 RachaFácil

Aplicação (faculdade) para dividir contas entre grupos (moradia, viagens, mercado, festas).
Projeto dividido em **backend** (API REST em Java / Spring Boot) e **frontend** (SPA em React).

## Estrutura

```
racha-facil/
├── backend/    API REST — Java 21, Spring Boot 3.3, Spring Data JPA, Maven
├── frontend/   SPA — React 19, React Router 7, Vite 7
└── README.md
```

## Tecnologias

**Backend**
- Java 21
- Spring Boot 3.3.5 (Web, Data JPA, Validation)
- Hibernate 6.5
- `spring-security-crypto` (hash de senhas)
- Maven

**Frontend**
- React 19.2
- React Router 7 (`react-router-dom`)
- Vite 7 e `@vitejs/plugin-react` 5
- Node.js 20.19+ (recomendado: 22 LTS)

Entidades (CRUD completo no backend e páginas correspondentes no frontend):

| Entidade | Endpoint | Descrição |
|---|---|---|
| Usuário | `/api/usuarios` | Pessoas que usam o app |
| Grupo | `/api/grupos` | Rachas (moradia, viagem, mercado, festas) |
| Despesa | `/api/despesas` | Gastos de um grupo, com quem pagou e status |

Autenticação: `POST /api/auth/login` devolve um token. As demais rotas `/api/**` exigem o cabeçalho
`Authorization: Bearer <token>`. O cadastro de usuário (`POST /api/usuarios`) é público.

---

## Pré-requisitos

- Java 21+
- Maven 3.9+
- Node.js 20.19+ (recomendado: 22 LTS) e npm

---

## 1. Backend

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. Por padrão usa o perfil `dev`, com banco H2 em memória
(criado e populado automaticamente a cada execução).

Console do H2 (opcional): `http://localhost:8080/h2-console`
(JDBC URL `jdbc:h2:mem:racha`, usuário `sa`, senha vazia).

Rodar os testes:

```bash
cd backend
mvn test
```

---

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O Vite redireciona `/api` para o backend em `localhost:8081`,
então o backend precisa estar rodando.

Build de produção:

```bash
npm run build
```

---

## Usuário de teste (login)

| Campo | Valor |
|---|---|
| E-mail | `teste@racha.com` |
| Senha | `racha1234` |

Disponível no perfil `dev` (padrão). 

No perfil `dev` também são criados, na primeira execução, um grupo (`Apê`) e duas despesas (`Aluguel` e `Mercado`),
para as telas já terem dados.

---

## Ordem de execução e integração

1. Suba o **backend primeiro** (`mvn spring-boot:run` na pasta `backend`) e espere a linha `Started RachaFacilApplication`.
2. Depois suba o **frontend** (`npm run dev` na pasta `frontend`).
3. Abra `http://localhost:5173`, clique em **Entrar** e use o usuário de teste.

O frontend não fala direto com a porta 8081: ele chama `/api`, e o Vite encaminha essas chamadas para o backend.


---

## Rotas do frontend

| Rota | Página | Acesso |
|---|---|---|
| `/` | Página inicial (landing, cadastro) | público |
| `/login` | Autenticação | público |
| `/usuarios` | Consulta, inserção, edição e remoção de usuários | login |
| `/grupos` | Consulta, inserção, edição e remoção de grupos | login |
| `/despesas` | Consulta, inserção, edição e remoção de despesas | login |
| qualquer outra | Página de erro personalizada (404) | público |

