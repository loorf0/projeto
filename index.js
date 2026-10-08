require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("./db")

const app = express()
const port = process.env.API_PORT || 3000
app.use(express.json())
app.use(cors())

function autenticar(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ erro: "Token não enviado, usar Authorization Bearer <token>" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ erro: "Token inválido ou expirado" })
        req.usuario = usuario
        next()
    })
}

app.post("/cliente", async (req, res) => {
    try {
        const { nome, cpf, celular, email, senha } = req.body
        if (!nome || !cpf || !celular || !email || !senha) {
            return res.status(400).json({ erro: "Preencha nome, cpf, celular, email e senha." })
        }
        const senhaCript = await bcrypt.hash(String(senha), 10)
        const [resultado] = await db.pool.query(
            `INSERT INTO cliente (nome, cpf, celular, email, senha)
             VALUES (?, ?, ?, ?, ?)`,
            [nome, cpf, celular, email, senhaCript]
        )
        res.status(201).json({ msg: "Cliente cadastrado, ID = " + resultado.insertId })
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ erro: "CPF ou email já cadastrado." })
        }
        res.status(500).json({ erro: error.message })
    }
})

// Login: devolve nome e token JWT
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body
        if (!email || !senha) {
            return res.status(400).json({ erro: "Informe email e senha." })
        }
        const [linhas] = await db.pool.query(
            "SELECT id, nome, email, senha FROM cliente WHERE email = ?", [email]
        )
        const cliente = linhas[0]
        // mesma mensagem para email inexistente e senha errada (não revela quais emails existem)
        if (!cliente || !(await bcrypt.compare(String(senha), cliente.senha))) {
            return res.status(401).json({ erro: "Email ou senha inválidos!" })
        }
        const payload = { id: cliente.id, email: cliente.email }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })
        res.status(200).json({ nome: cliente.nome, token: token })
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
})

app.get("/cliente/perfil", autenticar, async (req, res) => {
    try {
        const [linhas] = await db.pool.query(
            "SELECT id, nome, cpf, celular, email FROM cliente WHERE id = ?",
            [req.usuario.id]
        )
        if (!linhas[0]) return res.status(404).json({ erro: "Cliente não encontrado" })
        res.status(200).json(linhas[0])
    } catch (error) {
        res.status(500).json({ erro: "Erro interno" })
    }
})

app.listen(port, () => {
    console.log("API rodando na porta " + port)
})
