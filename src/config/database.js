// src/config/database.js

const mysql = require('mysql2');

// Carrega as variáveis de ambiente definidas no arquivo .env
// (O dotenv.config() já foi chamado no app.js)

// Cria um pool de conexões com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000 // Aumenta o timeout para 20 segundos (o padrão é 10000ms = 10s)
});

// Teste opcional de conexão ao iniciar
pool.getConnection((err, connection) => {
  if (err) {
    console.error('DATABASE ERROR ao tentar conectar:', err.message || err.code);
    if (err.code === 'ECONNREFUSED') {
        console.error('VERIFIQUE: O servidor MySQL está rodando? As credenciais em .env estão corretas (host, user, password, database)?');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
        console.error(`VERIFIQUE: O banco de dados "${process.env.DB_NAME}" existe no servidor MySQL?`);
    }
    return;
  }
  if (connection) {
    console.log(`Conectado ao banco de dados MySQL "${process.env.DB_NAME}" com sucesso!`);
    connection.release(); // Libera a conexão de volta para o pool
  }
});

// --- CORREÇÃO AQUI ---
// Exporta o pool com suporte a Promises habilitado
module.exports = pool.promise(); // <<<<<<< CERTIFIQUE-SE QUE ESTÁ EXPORTANDO pool.promise() E NÃO APENAS pool
// --- FIM DA CORREÇÃO ---