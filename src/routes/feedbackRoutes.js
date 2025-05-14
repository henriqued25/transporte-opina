// src/routes/feedbackRoutes.js

/**
 * Módulo de roteamento para os endpoints relacionados a feedbacks.
 * Define as rotas HTTP (GET, POST, PUT, DELETE) e as associa
 * aos métodos correspondentes do feedbackController.
 */

const express = require('express');
const router = express.Router(); // Cria uma instância do roteador do Express
const feedbackController = require('../controllers/feedbackController'); // Importa o controller

// --- Definição das Rotas de Feedback ---

/**
 * @route POST /api/feedbacks
 * @description Cria um novo registro de feedback.
 * @access Public (ou adicionar autenticação/autorização se necessário)
 */
router.post('/feedbacks', feedbackController.criarNovoFeedback);

/**
 * @route GET /api/feedbacks
 * @description Retorna a lista de todos os feedbacks registrados.
 * @access Public
 */
router.get('/feedbacks', feedbackController.obterTodosFeedbacks);

/**
 * @route GET /api/feedbacks/:id
 * @description Retorna um feedback específico pelo seu ID.
 * @access Public
 * @param {number} id - O ID do feedback a ser buscado (parâmetro de rota).
 */
router.get('/feedbacks/:id', feedbackController.obterFeedbackPorId);

/**
 * @route PUT /api/feedbacks/:id
 * @description Atualiza um feedback existente pelo seu ID.
 *              Espera os dados a serem atualizados no corpo da requisição (JSON).
 * @access Public (ou restrito)
 * @param {number} id - O ID do feedback a ser atualizado (parâmetro de rota).
 */
router.put('/feedbacks/:id', feedbackController.atualizarUmFeedback);

/**
 * @route DELETE /api/feedbacks/:id
 * @description Deleta um feedback específico pelo seu ID.
 * @access Public (ou restrito)
 * @param {number} id - O ID do feedback a ser deletado (parâmetro de rota).
 */
router.delete('/feedbacks/:id', feedbackController.deletarUmFeedback);

// Exporta o roteador configurado para ser usado no app.js (via app.use('/api', feedbackRoutes)).
module.exports = router;