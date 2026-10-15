# Aula 08 — Microsserviços

## Sobre o projeto

Projeto acadêmico desenvolvido com Node.js, Express e TypeScript, composto por dois microsserviços independentes para gerenciamento de recursos e agendamentos.

## Tecnologias

- Node.js
- Express
- TypeScript
- Thunder Client

## Serviços e rotas

### Catálogo — Porta 3001

| Método | Rota | Descrição |
|---|---|---|
| GET | `/recursos` | Lista recursos |
| GET | `/recursos/:id` | Consulta recurso |
| POST | `/recursos` | Cadastra recurso |
| PATCH | `/recursos/:id/status` | Atualiza status |

### Agendamentos — Porta 3000

| Método | Rota | Descrição |
|---|---|---|
| GET | `/agendamentos` | Lista agendamentos |
| GET | `/agendamentos/:id` | Consulta agendamento |
| POST | `/agendamentos` | Cria agendamento |
| PATCH | `/agendamentos/:id/status` | Atualiza status |
| DELETE | `/agendamentos/:id` | Exclui agendamento |

O serviço de agendamentos consulta o catálogo antes de criar um registro, verificando se o recurso existe e está disponível.

## Instalação e execução

Em cada pasta de serviço, instale as dependências:

```bash
npm install
```

Inicie cada serviço em um terminal separado:

```bash
npm run dev
```

Para verificar a compilação:

```bash
npm run build
```

## Autenticação

As rotas protegidas exigem o cabeçalho:

```text
Authorization: Bearer ifms2026
```

## Tratamento de erros

O sistema utiliza validação de dados, logs e tratamento de erros HTTP, incluindo `400`, `401`, `404`, `409`, `500` e `502`.

## Testes

Os endpoints foram preparados para testes com Thunder Client, incluindo cadastros, consultas, filtros, autenticação, atualização e exclusão.

As evidências dos testes devem ser armazenadas na pasta `evidencias/`.

## Observação

Os dados são armazenados em memória e são perdidos quando o serviço correspondente é reiniciado.