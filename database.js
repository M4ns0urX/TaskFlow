const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,           // Obrigatório para Azure SQL
    trustServerCertificate: false
  }
};

let pool = null;

async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('✅ Conectado ao Azure SQL Database');
  }
  return pool;
}

async function initDatabase() {
  const conn = await getConnection();
  await conn.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tarefas' AND xtype='U')
    CREATE TABLE Tarefas (
      id          INT IDENTITY(1,1) PRIMARY KEY,
      titulo      NVARCHAR(200)  NOT NULL,
      descricao   NVARCHAR(1000) NULL,
      prioridade  NVARCHAR(20)   NOT NULL DEFAULT 'media',
      status      NVARCHAR(20)   NOT NULL DEFAULT 'pendente',
      criado_em   DATETIME       NOT NULL DEFAULT GETDATE(),
      atualizado_em DATETIME     NOT NULL DEFAULT GETDATE()
    )
  `);
  console.log('✅ Tabela Tarefas pronta');
}

module.exports = { getConnection, initDatabase, sql };
