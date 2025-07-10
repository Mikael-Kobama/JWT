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
  const token = req.headers["authorization"];
  if (!token) res.sendStatus(401);

  token = token.replace("Bearer", "");

  blacklist[token] = true;
  setTimeout(
    () => delete blacklist[token],
    parseInt(process.env.JWT_EXPIRES) * 1000
  );
  res.json({ token: null });
});

function verifyJWT(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) res.sendStatus(401).json({ message: "Token Required" });

  token = token.replace("Bearer", "");
  if (blacklist[token])
    return res.status(403).json({ message: "Blacklisted Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(403).json({ message: "Invalid Token" });

    res.locals.token = decoded;
    return next();
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

// Rota para listar clientes
app.get("/clientes", verifyJWT, (req, res, next) => {
  console.log("Retornou todos clientes");
  res.json([{ id: 1, nome: "luiz" }]);
});

// Rota principal
app.get("/", (req, res, next) => {
  res.send("Tudo Ok por aqui");
});

// Iniciando o servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
