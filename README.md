# API CRUD Recados

Este repositório contém as informações e arquivos necessários para o projeto da API para CRUD de Recados, que consiste na criação e login de usuário e na criação, listagem, atualização e exclusão de recados.

## Estrutura do Projeto

1. **Bibliotecas:**
    - `express`
    - `cors`
    - `bcrypt`

2. **Dependências:**
    - `nodemon`
    - `sucrase`

3. **Arquivo Javascript:**
    - `index.js`
    - `validateMessage.js`(Middleware)

## Avaliação e critérios

### Funções
#### Regras gerais
Não pode ter mais de uma pessoa usuária com o mesmo e-mail   
O login deve ser feito com e-mail e senha   
Cada recado deve ser uma pessoa usuária. Ou seja, uma pessoa pode ter vários recados. Porém um recado só pode ter uma pessoa.

#### Recados
Criar recado, ler todos os recados, atualizar recado (filtrado por ID), remover recado.   

#### Usuários
Criar usuário, logar usuário. A senha deve ser criptografada.

#### Deploy
Realizar o deploy no render e a documentação da API no Postman.

## Link

**Documentação Postman:**   
https://documenter.getpostman.com/view/34248306/2sA3BrYqB5
