// app.js
// Este é o ponto de entrada principal da sua aplicação API.

// --- Importações de Módulos ---
const express = require('express');       // Framework web para Node.js
const cors = require('cors');             // Middleware para habilitar Cross-Origin Resource Sharing
const dotenv = require('dotenv');         // Carrega variáveis de ambiente do arquivo .env

// --- Configuração Inicial ---
dotenv.config(); // <<<<<<< CORREÇÃO APLICADA: Carrega .env PRIMEIRO <<<<<<<
                 // Garante que as variáveis de ambiente estejam disponíveis antes de serem usadas

const feedbackRoutes = require('./src/routes/feedbackRoutes'); // Importa as rotas definidas para feedbacks
// Agora que .env está carregado, a configuração do banco pode acessar process.env
require('./src/config/database'); // Importa a configuração do banco para executar o teste de conexão

const app = express(); // Cria uma instância da aplicação Express
// Agora process.env.PORT (se definido no .env) estará disponível
const PORT = process.env.PORT || 8800; // Define a porta: usa a variável PORT do .env ou 8800 como padrão

// --- Middlewares Globais ---
// Habilita o CORS para permitir requisições de diferentes origens
app.use(cors());

// Habilita o parsing (análise) de corpos de requisição no formato JSON
app.use(express.json());

// Habilita o parsing de corpos de requisição no formato URL-encoded
app.use(express.urlencoded({ extended: true }));

// --- Rotas da Aplicação ---
// Define um prefixo '/api' para todas as rotas definidas em feedbackRoutes.
app.use('/api', feedbackRoutes);

// Rota de "health check" ou boas-vindas para a raiz da API
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo à API de Feedback de Transporte!' });
});

// Middleware para lidar com rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// Middleware para tratamento de erros genéricos
app.use((err, req, res, next) => {
  console.error("ERRO NÃO TRATADO:", err.stack || err.message || err);
  res.status(err.status || 500).json({
      message: err.message || 'Ocorreu um erro interno no servidor.',
  });
});

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor iniciado e escutando na porta ${PORT}`);
  console.log(`Acesse a API em: http://localhost:${PORT}`);
});