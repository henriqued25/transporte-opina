# API de Feedback de Transporte

Uma API RESTful construída com Node.js, Express e MySQL para gerenciar feedbacks de usuários sobre serviços de transporte. Permite criar, listar, buscar, atualizar e deletar registros de feedback.

## Tecnologias Utilizadas

*   **Node.js:** Ambiente de execução JavaScript no servidor.
*   **Yarn:** Gerenciador de pacotes (alternativa ao npm).
*   **Express.js:** Framework web minimalista para Node.js, usado para construir a API.
*   **MySQL:** Sistema de Gerenciamento de Banco de Dados Relacional.
    *   **mysql2:** Driver otimizado para Node.js para interagir com o MySQL.
*   **dotenv:** Módulo para carregar variáveis de ambiente de um arquivo `.env`.
*   **cors:** Middleware para habilitar Cross-Origin Resource Sharing (CORS).

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

1.  **Node.js (que inclui npm, mas usaremos Yarn):**
    *   Vá para [Node.js](https://nodejs.org/) e baixe a versão LTS recomendada para o seu sistema operacional.
    *   Siga as instruções de instalação. Isso também instalará o `npm`.

2.  **Yarn (Gerenciador de Pacotes):**
    *   Após instalar o Node.js, você pode instalar o Yarn globalmente usando o npm:
        ```bash
        npm install --global yarn
        ```
    *   Verifique a instalação:
        ```bash
        yarn --version
        ```

3.  **MySQL Server:**
    *   **Opção 1: MySQL Community Server:** Vá para [MySQL Downloads](https://dev.mysql.com/downloads/mysql/) e baixe o "MySQL Installer" para Windows ou os pacotes apropriados para macOS/Linux. Durante a instalação, certifique-se de instalar o "MySQL Server" e definir uma senha para o usuário `root`.
    *   **Opção 2: Docker:** Se preferir, você pode rodar o MySQL em um container Docker.
    *   **Opção 3: XAMPP/WAMP/MAMP/Laragon:** Esses pacotes incluem o MySQL Server e são fáceis de instalar e gerenciar.
    *   **Importante:** Certifique-se de que o serviço do MySQL Server esteja em execução.

## Configuração e Instalação do Projeto

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_NO_GITHUB>
    cd <NOME_DA_PASTA_DO_PROJETO>
    ```

2.  **Instale as dependências do projeto usando Yarn:**
    (O Yarn lerá o arquivo `package.json` para saber quais pacotes instalar: Express, mysql2, dotenv, cors, etc.)
    ```bash
    yarn install
    ```
    *Se preferir usar npm, o comando seria `npm install`.*

3.  **Configure o Banco de Dados MySQL:**
    *   Acesse seu servidor MySQL (usando um cliente como MySQL Workbench, DBeaver, ou a linha de comando).
    *   Crie um banco de dados para a aplicação (ex: `db_transporte_opina`):
        ```sql
        CREATE DATABASE db_transporte_opina;
        ```
    *   Use o banco de dados criado:
        ```sql
        USE db_transporte_opina;
        ```
    *   Crie a tabela `feedback_users` executando o seguinte script SQL:
        ```sql
        CREATE TABLE IF NOT EXISTS feedback_users (
            `id_feedback` INT AUTO_INCREMENT PRIMARY KEY,
            `bus_number` VARCHAR(50) NOT NULL,
            `bus_line` VARCHAR(200) NOT NULL,
            `excessive_delay` BOOLEAN DEFAULT NULL,
            `bus_overcrowded` BOOLEAN DEFAULT NULL,
            `lack_of_accessibility` BOOLEAN DEFAULT NULL,
            `air_conditioning_broken` BOOLEAN DEFAULT NULL,
            `driver_misconduct` BOOLEAN DEFAULT NULL,
            `route_change` BOOLEAN DEFAULT NULL,
            `vehicle_poor_condition` BOOLEAN DEFAULT NULL,
            `comment` VARCHAR(300) DEFAULT NULL,
            `boarding_point` VARCHAR(255) DEFAULT NULL,
            `occurrence_location` VARCHAR(255) DEFAULT NULL,
            `submission_datetime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `overall_rating` INT DEFAULT NULL,
            `safety_rating` INT DEFAULT NULL,
            `improvement_suggestions` TEXT DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        ```

4.  **Configure as Variáveis de Ambiente:**
    *   Na raiz do projeto, crie um arquivo chamado `.env`.
    *   Copie o conteúdo abaixo para o seu arquivo `.env` e **substitua os valores pelos seus dados de configuração do MySQL local**:

        ```dotenv
        # .env
        DB_HOST=localhost
        DB_USER=seu_usuario_mysql    # Ex: root
        DB_PASSWORD=sua_senha_mysql  # Senha do usuário MySQL
        DB_NAME=db_transporte_opina  # O mesmo nome do banco que você criou
        PORT=8800
        ```
    *   **Importante:** Adicione `.env` ao seu arquivo `.gitignore` para não enviar suas credenciais ao repositório.

## Rodando a Aplicação

1.  **Para iniciar o servidor em modo de desenvolvimento (com Nodemon, se configurado):**
    (Assumindo que você tem um script `dev` no seu `package.json` como `"dev": "nodemon app.js"`)
    ```bash
    yarn dev
    ```

2.  **Para iniciar o servidor normalmente:**
    (Assumindo que você tem um script `start` no seu `package.json` como `"start": "node app.js"`)
    ```bash
    yarn start
    ```
    *Se não tiver scripts definidos, use `node app.js`.*

3.  A API estará disponível em `http://localhost:8800` (ou a porta que você definiu em `.env`).

## Endpoints da API

O prefixo base para todos os endpoints é `/api`.

*   **`POST /feedbacks`**: Cria um novo feedback.
    *   Corpo da requisição (JSON):
        ```json
        {
            "bus_number": "XYZ-123",
            "bus_line": "101 - Centro",
            "overall_rating": 4,
            "safety_rating": 5,
            // ... outros campos obrigatórios e opcionais
        }
        ```
*   **`GET /feedbacks`**: Lista todos os feedbacks.
*   **`GET /feedbacks/:id`**: Busca um feedback específico pelo seu ID.
*   **`PUT /feedbacks/:id`**: Atualiza um feedback existente pelo seu ID.
    *   Corpo da requisição (JSON) com os campos a serem atualizados.
*   **`DELETE /feedbacks/:id`**: Deleta um feedback específico pelo seu ID.

---