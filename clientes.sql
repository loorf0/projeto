CREATE DATABASE IF NOT EXISTS teste3dsc
    CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE teste3dsc;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Cliente de teste  ->  login: teste@email.com  |  senha: 123456
INSERT IGNORE INTO cliente (nome, cpf, celular, email, senha) VALUES (
    'Cliente Teste',
    '111.222.333-44',
    '(42)99999-0000',
    'teste@email.com',
    '$2b$10$2BdjUtYvS6c4QjN7ywS8/.bzSFi7mkf6Xb8n5tEn3Q7.VDtzchABK'
);

SELECT id, nome, cpf, celular, email FROM cliente;
