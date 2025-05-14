// src/models/feedbackModel.js

/**
 * Módulo responsável pela interação direta com a tabela 'feedback_users' no banco de dados.
 * Utiliza o pool de conexões configurado com suporte a Promises.
 */

// Importa o pool de conexão já configurado com suporte a Promises.
// 'db' aqui representa o objeto pool.promise().
const db = require('../config/database');

const Feedback = {
  /**
   * Insere um novo registro de feedback na tabela 'feedback_users'.
   * @async
   * @param {object} newFeedbackData - Objeto contendo os dados do novo feedback.
   *        Espera-se que as chaves correspondam aos nomes das colunas da tabela.
   * @returns {Promise<number>} Retorna o ID (id_feedback) do registro recém-inserido.
   * @throws {Error} Lança um erro se a inserção no banco de dados falhar.
   */
  criarFeedback: async (newFeedbackData) => {
    // Desestrutura os dados esperados do objeto de entrada.
    const {
      bus_number, bus_line, excessive_delay, bus_overcrowded,
      lack_of_accessibility, air_conditioning_broken, driver_misconduct,
      route_change, vehicle_poor_condition, comment, boarding_point,
      occurrence_location, overall_rating, safety_rating, improvement_suggestions
    } = newFeedbackData;

    // Template SQL para inserção, usando placeholders (?) para prevenir SQL Injection.
    const sql = `INSERT INTO feedback_users (
                    bus_number, bus_line, excessive_delay, bus_overcrowded,
                    lack_of_accessibility, air_conditioning_broken, driver_misconduct,
                    route_change, vehicle_poor_condition, comment, boarding_point,
                    occurrence_location, overall_rating, safety_rating, improvement_suggestions
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Array de valores na ordem correta dos placeholders na query SQL.
    const values = [
      bus_number, bus_line, excessive_delay, bus_overcrowded,
      lack_of_accessibility, air_conditioning_broken, driver_misconduct,
      route_change, vehicle_poor_condition, comment, boarding_point,
      occurrence_location, overall_rating, safety_rating, improvement_suggestions
    ];

    try {
      // Executa a query de inserção usando o pool com promises.
      // A desestruturação [result] pega o primeiro elemento do array retornado por db.query,
      // que contém informações sobre a operação (como insertId).
      const [result] = await db.query(sql, values);
      console.log(`[Model] Feedback inserido com sucesso. ID: ${result.insertId}`);
      // Retorna o ID do novo registro.
      return result.insertId;
    } catch (error) {
      // Em caso de erro na query, loga o erro detalhado no servidor.
      console.error("[Model Error] Falha ao inserir feedback:", error);
      // Lança um novo erro com uma mensagem mais genérica para ser tratado pelo controller.
      // Isso evita expor detalhes da infraestrutura (como nomes de coluna inválidos) diretamente.
      throw new Error(`Erro ao salvar feedback no banco de dados: ${error.message}`);
    }
  },

  /**
   * Recupera todos os registros de feedback da tabela 'feedback_users'.
   * Os resultados são ordenados pela data de envio (mais recentes primeiro).
   * @async
   * @returns {Promise<Array<object>>} Retorna um array de objetos, onde cada objeto representa um feedback.
   * @throws {Error} Lança um erro se a consulta ao banco de dados falhar.
   */
  listarFeedbacks: async () => {
    // Query SQL para selecionar todos os campos de todos os feedbacks.
    const sql = "SELECT * FROM feedback_users ORDER BY submission_datetime DESC";
    try {
      // Executa a query de seleção.
      // [rows] contém o array de resultados (os feedbacks).
      const [rows] = await db.query(sql);
      // Retorna o array de feedbacks encontrados.
      return rows;
    } catch (error) {
      console.error("[Model Error] Falha ao listar feedbacks:", error);
      throw new Error(`Erro ao buscar feedbacks no banco de dados: ${error.message}`);
    }
  },

  /**
   * Busca um único registro de feedback pelo seu ID (chave primária).
   * @async
   * @param {number} id - O id_feedback a ser buscado.
   * @returns {Promise<object|null>} Retorna o objeto do feedback encontrado ou null se nenhum registro
   *         com o ID fornecido for encontrado.
   * @throws {Error} Lança um erro se a consulta ao banco de dados falhar.
   */
  buscarFeedbackPorId: async (id) => {
    // Query SQL para selecionar um feedback específico pela chave primária.
    const sql = "SELECT * FROM feedback_users WHERE id_feedback = ?";
    try {
      // Executa a query passando o ID como parâmetro seguro.
      const [rows] = await db.query(sql, [id]);
      // Retorna o primeiro (e único esperado) resultado se encontrado, caso contrário, retorna null.
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("[Model Error] Falha ao buscar feedback por ID:", error);
      throw new Error(`Erro ao buscar feedback por ID no banco de dados: ${error.message}`);
    }
  },

  /**
   * Atualiza um registro de feedback existente na tabela 'feedback_users'.
   * A query é construída dinamicamente para atualizar apenas os campos fornecidos.
   * @async
   * @param {number} id - O id_feedback do registro a ser atualizado.
   * @param {object} feedbackData - Objeto contendo pares chave-valor dos campos a serem atualizados.
   *        As chaves devem corresponder aos nomes das colunas.
   * @returns {Promise<number>} Retorna o número de linhas afetadas pela operação UPDATE.
   *         Normalmente será 1 se a atualização for bem-sucedida e o registro existir,
   *         ou 0 se o registro não for encontrado ou nenhum dado for alterado.
   * @throws {Error} Lança um erro se a atualização no banco de dados falhar.
   */
  atualizarFeedback: async (id, feedbackData) => {
    // Obtém as chaves (nomes das colunas) do objeto de dados a serem atualizados.
    const fieldsToUpdate = Object.keys(feedbackData);

    // Validação: Se nenhum campo foi fornecido para atualização, retorna 0 (nenhuma linha afetada).
    if (fieldsToUpdate.length === 0) {
      console.warn(`[Model] Tentativa de atualização para ID ${id} sem dados fornecidos.`);
      return 0;
    }

    // Constrói a cláusula SET dinamicamente (ex: "coluna1 = ?, coluna2 = ?").
    const setClause = fieldsToUpdate.map(field => `\`${field}\` = ?`).join(', '); // Usa backticks para nomes de coluna

    // Cria o array de valores correspondentes aos placeholders na cláusula SET.
    const values = fieldsToUpdate.map(field => feedbackData[field]);
    // Adiciona o ID ao final do array de valores para a cláusula WHERE.
    values.push(id);

    // Monta a query SQL UPDATE completa.
    const sql = `UPDATE feedback_users SET ${setClause} WHERE id_feedback = ?`;

    try {
      // Executa a query de atualização.
      const [result] = await db.query(sql, values);
      console.log(`[Model] Tentativa de atualizar feedback ID ${id}. Linhas afetadas: ${result.affectedRows}`);
      // Retorna quantas linhas foram realmente modificadas.
      return result.affectedRows;
    } catch (error) {
      console.error("[Model Error] Falha ao atualizar feedback:", error);
      throw new Error(`Erro ao atualizar feedback no banco de dados: ${error.message}`);
    }
  },

  /**
   * Deleta um registro de feedback da tabela 'feedback_users' pelo seu ID.
   * @async
   * @param {number} id - O id_feedback do registro a ser deletado.
   * @returns {Promise<number>} Retorna o número de linhas afetadas pela operação DELETE.
   *         Será 1 se o registro for encontrado e deletado, 0 caso contrário.
   * @throws {Error} Lança um erro se a deleção no banco de dados falhar.
   */
  deletarFeedback: async (id) => {
    // Query SQL para deletar um registro específico pela chave primária.
    const sql = "DELETE FROM feedback_users WHERE id_feedback = ?";
    try {
      // Executa a query de deleção passando o ID como parâmetro seguro.
      const [result] = await db.query(sql, [id]);
      console.log(`[Model] Tentativa de deletar feedback ID ${id}. Linhas afetadas: ${result.affectedRows}`);
      // Retorna quantas linhas foram deletadas.
      return result.affectedRows;
    } catch (error) {
      console.error("[Model Error] Falha ao deletar feedback:", error);
      throw new Error(`Erro ao deletar feedback no banco de dados: ${error.message}`);
    }
  },
};

// Exporta o objeto Feedback contendo todos os métodos de interação com o banco.
module.exports = Feedback;