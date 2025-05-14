// src/controllers/feedbackController.js

/**
 * Módulo Controller para gerenciar as requisições HTTP relacionadas aos feedbacks.
 * Recebe as requisições das rotas, valida entradas, chama os métodos do Model
 * apropriados e envia as respostas HTTP ou delega erros para o middleware.
 */

const Feedback = require('../models/feedbackModel'); // Importa o Model

const feedbackController = {
  /**
   * Manipulador para a rota POST /api/feedbacks.
   * Cria um novo registro de feedback com base nos dados enviados no corpo da requisição.
   * @async
   * @param {object} req - Objeto da requisição Express. Espera-se req.body com os dados do feedback.
   * @param {object} res - Objeto da resposta Express.
   * @param {function} next - Função para chamar o próximo middleware (usado para tratamento de erro).
   */
  criarNovoFeedback: async (req, res, next) => {
    try {
      const feedbackData = req.body;

      // --- Validação de Entrada (Essencial para produção) ---
      // Exemplo de validação básica. Idealmente, usar uma biblioteca como Joi ou express-validator.
      if (!feedbackData.bus_number || typeof feedbackData.bus_number !== 'string' || feedbackData.bus_number.trim() === '') {
        const error = new Error('O campo "bus_number" (Número do ônibus) é obrigatório e deve ser um texto não vazio.');
        error.status = 400; // Bad Request
        throw error; // Lança o erro para ser pego pelo catch -> next(error)
      }
      if (!feedbackData.bus_line || typeof feedbackData.bus_line !== 'string' || feedbackData.bus_line.trim() === '') {
        const error = new Error('O campo "bus_line" (Linha do ônibus) é obrigatório e deve ser um texto não vazio.');
        error.status = 400;
        throw error;
      }
      // Validação para campos numéricos obrigatórios (exemplo)
      const requiredRatings = ['overall_rating', 'safety_rating'];
      for (const field of requiredRatings) {
        if (feedbackData[field] === undefined || typeof feedbackData[field] !== 'number') {
          const error = new Error(`O campo "${field}" é obrigatório e deve ser um número.`);
          error.status = 400;
          throw error;
        }
      }
      // Adicionar outras validações conforme necessário (tipos, formatos, limites, etc.)

      // Chama o método do Model para inserir os dados no banco.
      const feedbackId = await Feedback.criarFeedback(feedbackData);

      // Responde com status 201 (Created) e os dados do recurso criado (ID).
      res.status(201).json({ id: feedbackId, message: 'Feedback criado com sucesso!' });

    } catch (error) {
      // Se ocorrer qualquer erro (validação ou do Model), loga no console do servidor.
      console.error("[Controller Error] Falha ao criar feedback:", error.message);
      // Passa o erro para o middleware de tratamento de erros centralizado (definido em app.js).
      next(error);
    }
  },

  /**
   * Manipulador para a rota GET /api/feedbacks.
   * Retorna uma lista de todos os feedbacks registrados.
   * @async
   * @param {object} req - Objeto da requisição Express.
   * @param {object} res - Objeto da resposta Express.
   * @param {function} next - Função para chamar o próximo middleware.
   */
  obterTodosFeedbacks: async (req, res, next) => {
    try {
      // Chama o método do Model para buscar todos os feedbacks.
      const feedbacks = await Feedback.listarFeedbacks();
      // Responde com status 200 (OK) e o array de feedbacks em formato JSON.
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("[Controller Error] Falha ao obter todos os feedbacks:", error.message);
      next(error);
    }
  },

  /**
   * Manipulador para a rota GET /api/feedbacks/:id.
   * Retorna um feedback específico com base no ID fornecido na URL.
   * @async
   * @param {object} req - Objeto da requisição Express. Espera-se req.params.id.
   * @param {object} res - Objeto da resposta Express.
   * @param {function} next - Função para chamar o próximo middleware.
   */
  obterFeedbackPorId: async (req, res, next) => {
    try {
      // Extrai o ID do parâmetro da rota e converte para inteiro.
      const id = parseInt(req.params.id, 10);

      // Validação: Verifica se o ID é um número válido.
      if (isNaN(id) || id <= 0) {
        const error = new Error('O ID fornecido na URL é inválido. Deve ser um número inteiro positivo.');
        error.status = 400; // Bad Request
        throw error;
      }

      // Chama o método do Model para buscar o feedback pelo ID.
      const feedback = await Feedback.buscarFeedbackPorId(id);

      // Verifica se o feedback foi encontrado.
      if (feedback) {
        // Responde com status 200 (OK) e o objeto do feedback encontrado.
        res.status(200).json(feedback);
      } else {
        // Se não encontrado, cria um erro 404 (Not Found).
        const error = new Error(`Feedback com ID ${id} não encontrado.`);
        error.status = 404;
        throw error;
      }
    } catch (error) {
      console.error(`[Controller Error] Falha ao obter feedback por ID (${req.params.id}):`, error.message);
      next(error);
    }
  },

  /**
   * Manipulador para a rota PUT /api/feedbacks/:id.
   * Atualiza um feedback existente com base no ID da URL e nos dados do corpo da requisição.
   * @async
   * @param {object} req - Objeto da requisição Express. Espera-se req.params.id e req.body com dados a atualizar.
   * @param {object} res - Objeto da resposta Express.
   * @param {function} next - Função para chamar o próximo middleware.
   */
  atualizarUmFeedback: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        const error = new Error('O ID fornecido na URL para atualização é inválido.');
        error.status = 400;
        throw error;
      }

      const feedbackData = req.body;
      // Validação: Verifica se há dados no corpo da requisição para atualizar.
      if (!feedbackData || Object.keys(feedbackData).length === 0) {
        const error = new Error('Nenhum dado foi fornecido no corpo da requisição para atualização.');
        error.status = 400;
        throw error;
      }

      // Opcional: Validar se os campos em feedbackData são permitidos/válidos.

      // Chama o método do Model para tentar atualizar o feedback.
      const affectedRows = await Feedback.atualizarFeedback(id, feedbackData);

      // Verifica se alguma linha foi afetada (se o update ocorreu).
      if (affectedRows > 0) {
        // Se atualizado, busca os dados atualizados para retornar ao cliente.
        const feedbackAtualizado = await Feedback.buscarFeedbackPorId(id);
        // Responde com status 200 (OK) e o feedback atualizado.
        res.status(200).json({ message: `Feedback com ID ${id} atualizado com sucesso.`, feedback: feedbackAtualizado });
      } else {
        // Se nenhuma linha foi afetada, verifica se o feedback ao menos existia.
        const feedbackExistente = await Feedback.buscarFeedbackPorId(id);
        if (!feedbackExistente) {
          // Se não existia, retorna 404 (Not Found).
          const error = new Error(`Feedback com ID ${id} não encontrado para atualização.`);
          error.status = 404;
          throw error;
        } else {
          // Se existia mas não foi alterado (dados eram os mesmos), informa o cliente.
          // Isso evita que o cliente pense que houve um erro. Um status 200 é apropriado.
           res.status(200).json({ message: `Nenhuma alteração aplicada ao feedback com ID ${id}. Os dados podem ser os mesmos já existentes.`, feedback: feedbackExistente });
           // Alternativa: Status 304 Not Modified (requer lógica de cache/ETag mais complexa).
        }
      }
    } catch (error) {
      console.error(`[Controller Error] Falha ao atualizar feedback ID ${req.params.id}:`, error.message);
      next(error);
    }
  },

  /**
   * Manipulador para a rota DELETE /api/feedbacks/:id.
   * Deleta um feedback específico com base no ID fornecido na URL.
   * @async
   * @param {object} req - Objeto da requisição Express. Espera-se req.params.id.
   * @param {object} res - Objeto da resposta Express.
   * @param {function} next - Função para chamar o próximo middleware.
   */
  deletarUmFeedback: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        const error = new Error('O ID fornecido na URL para deleção é inválido.');
        error.status = 400;
        throw error;
      }

      // Chama o método do Model para tentar deletar o feedback.
      const affectedRows = await Feedback.deletarFeedback(id);

      // Verifica se alguma linha foi afetada (se a deleção ocorreu).
      if (affectedRows > 0) {
        // Responde com sucesso. Status 200 com mensagem ou 204 (No Content) são comuns.
        res.status(200).json({ message: `Feedback com ID ${id} deletado com sucesso.` });
        // Alternativa (sem corpo de resposta): res.status(204).send();
      } else {
        // Se nenhuma linha foi afetada, o feedback com esse ID não foi encontrado.
        const error = new Error(`Feedback com ID ${id} não encontrado para deleção.`);
        error.status = 404; // Not Found
        throw error;
      }
    } catch (error) {
      console.error(`[Controller Error] Falha ao deletar feedback ID ${req.params.id}:`, error.message);
      next(error);
    }
  }
};

// Exporta o objeto controller para ser usado nas rotas.
module.exports = feedbackController;