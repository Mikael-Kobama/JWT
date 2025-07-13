// index.js
require("dotenv-safe").config();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const express = require("express");
const { ref } = require("vue");
const app = express();

app.use(express.json());
const refreshTokens = {};

function generateRefreshToken(userId) {
  const refreshTokens = uuidv4();
  refreshTokens[token] = userID;

  Object.keys(refreshTokens).forEach((t) => {
    if (t !== token && refreshTokens[t] === userId)
      refreshTokens[t] = undefined;
  });

  setTimeout(
    () => delete refreshTokens[token],
    parseInt(process.env.REFRESH_EXPIRES)
  );
}

app.post("/login", (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  if (user === "luiz" && password === "123") {
    const id = 1;

    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.envJWT_EXPIRES),
    });

    const refreshToken = generateRefreshToken(id);

    return res.json({ accessToken, refreshToken });
  }

  res.status(401).json({ message: "Credenciais inválidas" });
});

app.post("/refresh", (req, res) => {
  let token = req.headers["authorization"];
  if (!token) res.sendStatus(401).json({ message: "Token Required" });

  token = token.replace("Bearer", "");
  const userId = refreshTokens[token];
  if (!userId) return res.status(401).json({ message: "Invalid Token!" });

  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES),
  });

  return res.json({ accessToken, refreshToken: token });
});

const blacklist = {};

app.post("logout", verifyJWT, (req, res) => {
  let token = req.headers["authorization"];
  if (!token) res.sendStatus(401);

  token = token.replace("Bearer", "");

  blacklist[token] = true;
  setTimeout(
    () => delete blacklist[token],
    parseInt(process.env.JWT_EXPIRES) * 1000
  );

  Object.keys(refreshTokens).forEach((t) => {
    if (refreshTokens[t] === res.locals.token.id) refreshTokens[t] = undefined;
  });

  res.json({ accessToken: null, token: null });
});

function verifyJWT(req, res, next) {
  let token = req.headers["authorization"];
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
