import * as SQLite from "expo-sqlite";

export const initDatabase = async (db) => {
  await db.execAsync(`
   PRAGMA foreign_keys = ON;

-- Tabela Cliente
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL
);

-- Tabela Telefone
CREATE TABLE IF NOT EXISTS telefone (
    id_telefone INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    numero TEXT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_telefone_cliente ON telefone(id_cliente);

-- Tabela Email
CREATE TABLE IF NOT EXISTS email (
    id_email INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    email TEXT NOT NULL,
    tipo TEXT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_email_cliente ON email(id_cliente);

-- Tabela Endereço
CREATE TABLE IF NOT EXISTS endereco (
    id_endereco INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    cep TEXT NOT NULL,
    rua TEXT NOT NULL,
    numero TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    complemento TEXT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_endereco_cliente ON endereco(id_cliente);

-- Tabela Produtos (Incluído ano_safra)
CREATE TABLE IF NOT EXISTS produtos (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT,
    preco REAL NOT NULL,
    descricao TEXT,
    ano_safra INTEGER, 
    estoque INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome);

-- Tabela Imagens do Produto
CREATE TABLE IF NOT EXISTS produto_imagens (
    id_imagem INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL,
    url TEXT NOT NULL,
    is_principal INTEGER NOT NULL DEFAULT 0 CHECK (is_principal IN (0,1)),
    ordem INTEGER,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_imagem_produto ON produto_imagens(id_produto);

-- Tabela Compras
CREATE TABLE IF NOT EXISTS compras (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_endereco INTEGER NULL,
    data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'pago', 'enviado', 'cancelado')),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_endereco) REFERENCES endereco(id_endereco)
);
CREATE INDEX IF NOT EXISTS idx_compras_cliente ON compras(id_cliente);

-- Tabela Itens da Compra
CREATE TABLE IF NOT EXISTS itens_compra (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_compra INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario REAL NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);
CREATE INDEX IF NOT EXISTS idx_itens_compra_compra ON itens_compra(id_compra);
CREATE INDEX IF NOT EXISTS idx_itens_compra_produto ON itens_compra(id_produto);

-- Tabela Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE,
    UNIQUE (id_cliente, id_produto)
);

-- Tabela Feedback (Avaliações)
CREATE TABLE IF NOT EXISTS feedback (
    id_feedback INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    avaliacao INTEGER NOT NULL CHECK (avaliacao BETWEEN 1 AND 5),
    comentario TEXT,
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_feedback_produto ON feedback(id_produto);
CREATE INDEX IF NOT EXISTS idx_feedback_cliente ON feedback(id_cliente);

-- Inserts Iniciais
INSERT OR IGNORE INTO produtos (nome, categoria, preco, descricao, estoque, ano_safra) VALUES
('10.00', 'VINHO BARATO', 10.00, 'VINHO BAIXA QUALIDADE', 30, 2023),
('DRAFT', 'VINHO BARATO', 15.00, 'VINHO CHOPP', 20, 2024),
('PÉRGOLA', 'VINHO BARATO', 25.00, 'VINHO BOM', 15, 2022);


-- ADMIN PADRÃO
INSERT OR IGNORE INTO cliente (id_cliente, nome, senha, cpf)
VALUES (1, 'Admin', '$2b$10$2F1g5pKYllgZlnRbP975P.zi7jA3YKHxXy8J2JNo77PPlet.aJBu2', '00000000000');

INSERT OR IGNORE INTO email (id_cliente, email, tipo)
VALUES (1, 'admin@admin.com', 'principal');
  `);
};

export async function resetDatabase() {
  await SQLite.deleteDatabaseAsync("dewine.db");
}
