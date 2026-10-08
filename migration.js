// Também cadastra um cliente de teste (teste@email.com / 123456).
require("dotenv").config()
const mysql = require("mysql2/promise")

async function criar_tabelas() {
    let conexao
    try {
        conexao = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        })
        const bd = process.env.DB_DATABASE
        await conexao.query(
            `CREATE DATABASE IF NOT EXISTS \`${bd}\`
             CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`
        )
        await conexao.query(`USE \`${bd}\``)
        await conexao.query(`
            CREATE TABLE IF NOT EXISTS cliente (
                id INT NOT NULL AUTO_INCREMENT,
                nome VARCHAR(100) NOT NULL,
                cpf CHAR(14) NOT NULL,
                celular CHAR(15) NOT NULL,
                email VARCHAR(100) NOT NULL,
                senha VARCHAR(512) NOT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY cpf (cpf),
                UNIQUE KEY email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        `)
        await conexao.query(
            `INSERT IGNORE INTO cliente (nome, cpf, celular, email, senha)
             VALUES (?, ?, ?, ?, ?)`,
            ["Cliente Teste", "111.222.333-44", "(42)99999-0000",
             "teste@email.com", "$2b$10$2BdjUtYvS6c4QjN7ywS8/.bzSFi7mkf6Xb8n5tEn3Q7.VDtzchABK"]
        )
        console.log("Migration concluída: tabela 'cliente' pronta!")
        process.exit(0)
    } catch (error) {
        console.error("Erro na migration:", error.message)
        process.exit(1)
    }
}
criar_tabelas()
