# API CRUD Recados

Este repositório contém as informações e arquivos necessários para o uso da API PostNotes para CRUD de Recados, que consiste na criação e login de usuário e na criação, listagem, atualização e exclusão de recados.

## Demonstração   
[PostNotes](https://postnotes-recados.vercel.app/login.html)

## Documentação
[Postman](https://documenter.getpostman.com/view/34248306/2sA3BrYqB5)

## Endpoints

### Rota padrão

```http
  GET /
```

Retorna uma mensagem de boas-vindas.

### Signup

```http
  POST /signup
```

Cria um novo usuário.

### Login

```http
  POST /login
```

Autentica um usuário existente.

### Listar Usuários

```http
  GET /users
```

Retorna todos os usuários cadastrados.

### Criar Recado

```http
  POST /message
```

Cria um novo recado. Necessita de autenticação.

### Listar Recados

```http
  GET /message/:email
```

Retorna os recados do usuário autenticado.

### Atualizar Recado

```http
  PUT /message/:id
```

Atualiza um recado específico pelo ID.

### Deletar Recado

```http
  DEL /message/:id
```

Deleta um recado específico pelo ID.

# Instalação

Clonar o repositório

```bash
  git clone https://github.com/JoannaBraccini/PostNotes-API
```

Instalar as depêndencias do projeto

```bash
  npm install
```

Iniciar o projeto

```bash
  npm run dev
```
