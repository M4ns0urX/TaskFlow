const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { getConnection, initDatabase, sql } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────
//  ROTAS DA API
// ─────────────────────────────────────────

// GET /api/tarefas - Listar todas as tarefas
app.get('/api/tarefas', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.request().query(
      'SELECT * FROM Tarefas ORDER BY criado_em DESC'
    );
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('Erro ao listar tarefas:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tarefas/:id - Buscar tarefa por ID
app.get('/api/tarefas/:id', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Tarefas WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarefa não encontrada' });
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('Erro ao buscar tarefa:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tarefas - Criar nova tarefa
app.post('/api/tarefas', async (req, res) => {
  const { titulo, descricao, prioridade } = req.body;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ success: false, error: 'Título é obrigatório' });
  }

  try {
    const conn = await getConnection();
    const result = await conn.request()
      .input('titulo',     sql.NVarChar(200),  titulo.trim())
      .input('descricao',  sql.NVarChar(1000), descricao || null)
      .input('prioridade', sql.NVarChar(20),   prioridade || 'media')
      .query(`
        INSERT INTO Tarefas (titulo, descricao, prioridade)
        OUTPUT INSERTED.*
        VALUES (@titulo, @descricao, @prioridade)
      `);

    res.status(201).json({ success: true, data: result.recordset[0], message: 'Tarefa criada com sucesso!' });
  } catch (err) {
    console.error('Erro ao criar tarefa:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tarefas/:id - Atualizar tarefa
app.put('/api/tarefas/:id', async (req, res) => {
  const { titulo, descricao, prioridade, status } = req.body;

  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ success: false, error: 'Título é obrigatório' });
  }

  try {
    const conn = await getConnection();
    const result = await conn.request()
      .input('id',          sql.Int,           req.params.id)
      .input('titulo',      sql.NVarChar(200),  titulo.trim())
      .input('descricao',   sql.NVarChar(1000), descricao || null)
      .input('prioridade',  sql.NVarChar(20),   prioridade || 'media')
      .input('status',      sql.NVarChar(20),   status || 'pendente')
      .query(`
        UPDATE Tarefas
        SET titulo        = @titulo,
            descricao     = @descricao,
            prioridade    = @prioridade,
            status        = @status,
            atualizado_em = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarefa não encontrada' });
    }
    res.json({ success: true, data: result.recordset[0], message: 'Tarefa atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar tarefa:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tarefas/:id - Deletar tarefa
app.delete('/api/tarefas/:id', async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Tarefas OUTPUT DELETED.* WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: 'Tarefa não encontrada' });
    }
    res.json({ success: true, message: 'Tarefa deletada com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar tarefa:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────
//  INICIALIZAR SERVIDOR
// ─────────────────────────────────────────
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
}

start();
