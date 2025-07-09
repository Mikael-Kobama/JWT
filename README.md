# 🔐 Simulador de Autenticação JWT com Node.js

Este projeto é uma API simples em Node.js com Express que demonstra como funciona a autenticação com JWT (JSON Web Tokens). O objetivo é entender os princípios básicos de autenticação segura usando tokens, como eles são gerados, verificados e protegem rotas privadas.

---

## 🚀 Funcionalidades

- [x] Simulação de login com retorno de token JWT
- [x] Validação de token em rotas protegidas
- [x] Uso de variáveis de ambiente com segurança (`dotenv-safe`)
- [x] Boas práticas com `.gitignore` e estrutura simples

---

## 📌 Por que usar JWT?

O JWT é uma forma leve e segura de autenticação:

- Os tokens são assinados digitalmente com um segredo.
- Não exigem armazenar sessões no servidor (stateless).
- São amplamente utilizados em aplicações modernas (APIs, SPAs, microserviços).

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** – runtime para JavaScript
- **Express** – framework leve para criação da API
- **jsonwebtoken** – biblioteca para geração e verificação de tokens
- **dotenv-safe** – carregamento seguro de variáveis de ambiente

---

## 📂 Estrutura do Projeto

```bash
.
├── index.js
├── authMiddleware.js
├── .env
├── .env.example
├── .gitignore
└── README.md
```
