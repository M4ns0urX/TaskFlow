-- ============================================================
--  SCRIPT SQL - Gerenciador de Tarefas
--  FIAP - Cloud Computing CP2
--  Execute no Azure SQL Database via Query Editor ou SSMS
-- ============================================================

-- Criar tabela Tarefas
CREATE TABLE Tarefas (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    titulo        NVARCHAR(200)  NOT NULL,
    descricao     NVARCHAR(1000) NULL,
    prioridade    NVARCHAR(20)   NOT NULL DEFAULT 'media',
    status        NVARCHAR(20)   NOT NULL DEFAULT 'pendente',
    criado_em     DATETIME       NOT NULL DEFAULT GETDATE(),
    atualizado_em DATETIME       NOT NULL DEFAULT GETDATE()
);

-- Inserir dados iniciais de teste
INSERT INTO Tarefas (titulo, descricao, prioridade, status)
VALUES
  ('Configurar VM na Azure',   'Criar e configurar a máquina virtual no portal Azure', 'alta',  'concluida'),
  ('Configurar Banco de Dados','Criar Azure SQL Server e banco, liberar firewall',     'alta',  'concluida'),
  ('Deploy da Aplicação',      'Clonar repositório e instalar dependências na VM',     'alta',  'em-andamento'),
  ('Testar CRUD completo',     'Validar INSERT, SELECT, UPDATE e DELETE na tabela',    'media', 'pendente'),
  ('Gravar vídeo do projeto',  'Mostrar recursos Azure, App funcionando e CRUD',       'media', 'pendente');

-- Verificar dados inseridos
SELECT * FROM Tarefas;

-- ============================================================
--  EXEMPLOS DAS OPERAÇÕES CRUD (para evidenciar no vídeo)
-- ============================================================

-- INSERT
INSERT INTO Tarefas (titulo, descricao, prioridade)
VALUES ('Nova tarefa via SQL', 'Inserida diretamente pelo SQL Editor', 'baixa');

SELECT * FROM Tarefas;

-- UPDATE
UPDATE Tarefas
SET status = 'concluida', atualizado_em = GETDATE()
WHERE titulo = 'Nova tarefa via SQL';

SELECT * FROM Tarefas WHERE titulo = 'Nova tarefa via SQL';

-- DELETE
DELETE FROM Tarefas WHERE titulo = 'Nova tarefa via SQL';

SELECT * FROM Tarefas;
