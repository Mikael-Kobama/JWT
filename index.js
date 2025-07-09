// index.js
require("dotenv-safe").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  if (user === "luiz" && password === "123") {
    const id = 1;

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.envJWT_EXPIRES),
    });

    return res.json({ token });
  }

  res.status(401).json({ message: "Credenciais inválidas" });
});

const blacklist = {};

app.post("logout", (req, res) => {
  const token = req.headers["authorization"].replace("Bearer", "");
  blacklist[token] = true;
  setTimeout(
    () => delete blacklist[token],
    parseInt(process.env.JWT_EXPIRES) * 1000
  );
});

// Rota principal
app.get("/", (req, res, next) => {
  res.send("Tudo Ok por aqui");
});

// Rota para listar clientes
app.get("/clientes", (req, res, next) => {
  console.log("Retornou todos clientes");
  res.json({ message: "Tudo ok por aqui" });
});

// Iniciando o servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
