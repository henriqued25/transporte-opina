import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente

const app = express();
const port = process.env.PORT || 3000; // Use a porta da variável de ambiente ou 3000 por padrão

app.use(express.json());
app.use(cors());

// Configurar a conexão com o banco de dados MySQL na AWS RDS
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conectado ao banco de dados MySQL!");
});

// Definir as rotas da API aqui





// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
