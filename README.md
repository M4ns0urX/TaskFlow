# 📋 TaskFlow — Gerenciador de Tarefas em Nuvem
**FIAP — Engenharia Mecatrônica | Cloud Computing & MaaS | 2º CP - 1º Semestre**

---

## 🏗️ Arquitetura
```
[Browser Local] → [VM Azure (Node.js/Express)] → [Azure SQL Server] → [Azure SQL Database]
```

---

## ☁️ PASSO 1 — Criar a VM na Azure

1. Acesse o **Portal Azure** → "Máquinas Virtuais" → **Criar**
2. Configure:
   - **Nome**: `vm-taskflow-RM{SEU_RM}` *(substitua pelo seu RM)*
   - **Imagem**: almalinux 10.1
   - **Tamanho**: Standard DC1ds v3
   - **Autenticação**: Senha (anote login/senha)
3. Em **Portas de entrada**: libere **SSH (22)** e **HTTP (80)**
4. Finalize a criação e anote o **IP Público da VM**

---

## 🗄️ PASSO 2 — Criar o Banco de Dados na Azure

1. Portal Azure → "SQL Database" → **Criar**
2. Configure:
   - **Servidor**: Criar novo → Nome: `sql-taskflow-RM{SEU_RM}`
   - **Banco**: `taskflow-db`
   - **Autenticação**: SQL — anote usuário e senha
3. Em **Rede** → adicione seu IP e o IP da VM ao firewall
4. Após criar, vá em **Query Editor** e execute o conteúdo de `setup.sql`

---

## 🔧 PASSO 3 — Configurar a VM

### Conecte via SSH:
```bash
ssh usuario@IP_DA_VM
```

### Instale Node.js e Git:
```bash
sudo def update && sudo def upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo def install -y nodejs git
node -v && npm -v
```

---

## 🚀 PASSO 4 — Fazer Deploy do App

### Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/task-manager-azure.git
cd task-manager-azure
```

### Instale as dependências:
```bash
npm install
```

### Configure o ambiente:
```bash
vi .env
```

Edite o `.env` com os dados do seu banco Azure:
```env
DB_SERVER=sql-taskflow-SEORM.database.windows.net
DB_NAME=taskflow-db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=1433
PORT=3000
```

### Inicie o servidor:
```bash
node server.js
```

---

## 🌐 PASSO 5 — Liberar a Porta no Azure

1. Portal Azure → sua VM → **Rede** → **Adicionar regra de porta de entrada**
2. Porta: **3000** | Protocolo: TCP | Ação: Permitir
3. Acesse no browser: `http://IP_DA_VM:3000`

---

## 🔄 CRUD — Operações disponíveis

| Operação | Método | Endpoint           |
|----------|--------|--------------------|
| Listar   | GET    | `/api/tarefas`     |
| Buscar   | GET    | `/api/tarefas/:id` |
| Criar    | POST   | `/api/tarefas`     |
| Atualizar| PUT    | `/api/tarefas/:id` |
| Deletar  | DELETE | `/api/tarefas/:id` |

---

## 🛠️ Tecnologias
- **Runtime**: Node.js 20
- **Framework**: Express 4
- **Banco**: Azure SQL (Microsoft SQL Server)
- **Driver**: mssql
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
