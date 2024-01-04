#  Energy Invoices Backend

O teste prático consiste em criar uma API REST para gerenciamento de faturas de energia elétrica.
  
Sendo eles

- Extrair os dados relevantes dessas faturas.

- Organizar esses dados de maneira estruturada em um banco de dados PostgreSQL.

- Apresentar esses dados em uma aplicação web, criada a partir de protótipos.


## Pré requisitos
- [Node.js](https://nodejs.org/en/download)
- [PostgreSQL](https://www.postgresql.org/download/)

##  Getting Started

Criando o banco localmente
```
- psql
- CREATE DATABASE lumiinvoices;
```
Migrando o banco
```
npx prisma migrate dev
```
Iniciando Localmente
```
npm run start:dev
```
##  Endpoints
/upload - POST - http://localhost:3000/api/invoices/upload
/invoices - GET - http://localhost:3000/api/invoices

## TODOS

- [x] Criar o banco de dados
- [x] Criar o modelo de dados
- [x] Criar o endpoint de upload
- [ ] Criar o endpoint de listagem
- [ ] Criar o endpoint de download
- [ ] Criar o endpoint de exclusão
- [ ] Criar o endpoint de dashboard
- [ ] Criar em Docker
- [ ] Criar testes unitários
