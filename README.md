# 🍷 DeWine

> Aplicativo mobile de e-commerce especializado em vinhos, desenvolvido com React Native (Expo) e Node.js.

---

## 📋 Sobre o Projeto

O **DeWine** é uma plataforma de compra e venda de vinhos que oferece experiência de navegação por categorias, carrinho de compras com validação de estoque, checkout integrado ao PagSeguro e painel administrativo para gestão de produtos. O projeto é dividido em dois repositórios: **frontend mobile** e **backend API REST**.

---

## 🏗️ Arquitetura

```
DeWine
├── dewine-front   → Aplicativo React Native (Expo)
└── dewine-back    → API REST Node.js / Express
```

### Fluxo de Dados

```
App Mobile (Expo)
    │
    ├── SQLite local (expo-sqlite)   ← dados offline / carrinho
    │
    └── HTTP REST ──► Express API (porta 3000)
                          ├── /users   → auth JWT
                          ├── /produtos → CRUD de vinhos
                          └── /cart    → validação + checkout PagSeguro
```

---

## 🖥️ Frontend — `dewine-front`

**Repositório:** https://github.com/leoLopesRibeiro/dewine-front

### Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ^54.0.34 | Plataforma de build |
| expo-sqlite | ~16.0.10 | Banco local (carrinho/pedidos) |
| React Navigation | ^7.x | Navegação Stack + Bottom Tabs |
| AsyncStorage | 2.2.0 | Persistência de sessão (token JWT) |
| jwt-decode | ^4.0.0 | Decodificação do token |
| react-native-toast-message | ^2.3.3 | Feedback visual |

### Pré-requisitos

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Dispositivo físico ou emulador (Android/iOS)
- Expo Go (para desenvolvimento rápido)

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/leoLopesRibeiro/dewine-front.git
cd dewine-front

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
# Edite o arquivo .env com o IP da sua máquina:
echo "EXPO_PUBLIC_API_BASE_URL=http://<SEU_IP>:3000/" > .env

# 4. Inicie o projeto
npm start           # Expo DevTools
npm run android     # Emulador Android
npm run ios         # Simulador iOS
npm run web         # Versão web
```

### Estrutura de Pastas

```
dewine-front/
├── App.js                          # Entry point — providers e navegação raiz
├── assets/                         # Imagens, ícones e assets estáticos
│   └── icons/                      # Ícones customizados
├── src/
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── AddToCartButton.js      # Botão de adicionar ao carrinho (com validação API)
│   │   ├── BottomNav.js            # Navegação inferior customizada
│   │   ├── Header.js               # Cabeçalho global
│   │   ├── QntItem.js              # Controle de quantidade
│   │   └── WineCard.js             # Card de produto (vinho)
│   ├── context/
│   │   └── auth.js                 # Context de autenticação (login, logout, JWT)
│   ├── routes/
│   │   ├── stack.routes.js         # Navegação em pilha (auth guard)
│   │   └── tab.routes.js           # Bottom tabs (Home, Carrinho, Vinhos)
│   ├── screens/
│   │   ├── Home.js                 # Tela inicial — lançamentos
│   │   ├── Vinhos.js               # Catálogo de vinhos
│   │   ├── DescricaoVinho.js       # Detalhes do produto
│   │   ├── CartScreen.js           # Carrinho de compras
│   │   ├── PedidosScreen.js        # Histórico de pedidos
│   │   ├── Assinatura.js           # Planos de assinatura
│   │   ├── Exclusivos.js           # Produtos exclusivos
│   │   ├── WineBox.js              # Kits de vinhos
│   │   ├── Login.js                # Tela de login
│   │   ├── Cadastro.js             # Cadastro de usuário
│   │   ├── AdminProdutos.js        # Painel admin — listagem
│   │   ├── CadProdutos.js          # Painel admin — cadastro/edição
│   │   └── SplashScreen.js         # Tela de carregamento inicial
│   └── services/
│       ├── api.js                  # Base URL da API
│       └── initDatabase.js         # Inicialização e schema do SQLite
```

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL base da API backend | `http://192.168.1.38:3000/` |

> ⚠️ **Importante:** Use o IP local da sua máquina (não `localhost`) para que dispositivos físicos e emuladores consigam acessar a API.

---

## ⚙️ Backend — `dewine-back`

**Repositório:** https://github.com/HLN-lobo/dewine-back

### Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | >= 18 | Runtime |
| Express | ^5.2.1 | Framework HTTP |
| bcrypt | ^6.0.0 | Hash de senhas |
| jsonwebtoken | ^9.0.3 | Autenticação JWT |
| dotenv | ^16.6.1 | Variáveis de ambiente |
| morgan | ^1.10.1 | Logger de requisições |
| nodemon | ^3.1.14 | Recarga automática (dev) |

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/HLN-lobo/dewine-back.git
cd dewine-back

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Inicie o servidor
npm run dev       # Modo desenvolvimento (nodemon)
node server.js    # Modo produção
```

O servidor inicia na porta **3000** e aceita conexões de qualquer IP (`0.0.0.0`).

### Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `SECRET` | Chave secreta para assinatura JWT |
| `PAGSEGURO_TOKEN` | Token de acesso à API do PagSeguro |
| `PAGSEGURO_API_URL` | URL da API PagSeguro (sandbox ou produção) |

### Endpoints da API

#### Usuários — `/users`

| Método | Rota | Descrição | Body |
|---|---|---|---|
| POST | `/users/cadastro` | Cadastro de cliente | `{ nome, email, senha, confirmarSenha, cpf, cep }` |
| POST | `/users/login` | Login + geração de JWT | `{ email, senha, senhaHash }` |

#### Produtos — `/produtos`

| Método | Rota | Descrição | Body |
|---|---|---|---|
| POST | `/produtos/cadastro` | Cadastra novo vinho | `{ nome, preco, categoria, descricao, ano_safra, url_imagem, estoque }` |
| GET | `/produtos/listar` | Lista todos os vinhos | — |
| PUT | `/produtos/editar/:id` | Atualiza produto | campos opcionais do produto |
| DELETE | `/produtos/excluir/:id` | Remove produto | — |

#### Carrinho — `/cart`

| Método | Rota | Descrição | Body |
|---|---|---|---|
| POST | `/cart/validate` | Valida item antes de salvar localmente | `{ id_cliente, id_produto, nome, preco, estoque, quantidade }` |
| POST | `/cart/checkout` | Finaliza pedido via PagSeguro | `{ id_cliente, id_endereco, itens[] }` |

### Arquitetura do Backend

```
dewine-back/
├── server.js               # Entry point — inicializa Express na porta 3000
├── index.js                # App Express — middlewares e rotas
├── gerar-hash.js           # Utilitário para gerar hash bcrypt
└── src/
    ├── controllers/
    │   └── cart.controller.js  # Lógica de validação e checkout PagSeguro
    └── routes/
        ├── user.routes.js      # Rotas de usuário (cadastro, login JWT)
        ├── prod.routes.js      # Rotas de produtos (CRUD em memória)
        └── cart.routes.js      # Rotas de carrinho
```

> ⚠️ **Nota:** O armazenamento de produtos é **em memória**. Ao reiniciar o servidor, os dados são perdidos. Para produção, integre um banco de dados persistente (PostgreSQL, MySQL, etc.).

---

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Token)** com validade de **1 dia**:

1. Cliente faz login enviando `email`, `senha` e `senhaHash` (hash armazenado localmente via SQLite)
2. Backend compara a senha com bcrypt e retorna um token JWT
3. Token é armazenado no `AsyncStorage` do dispositivo
4. A cada abertura do app, o token é validado e decodificado
5. Usuários com `email` contendo a string `"admin"` são identificados como administradores

---

## 📱 Funcionalidades

- ✅ Splash screen com verificação de sessão
- ✅ Cadastro e login de usuários
- ✅ Painel administrativo (cadastro, edição e exclusão de produtos)
- ✅ Catálogo de vinhos com cards
- ✅ Tela de detalhes do produto
- ✅ Adição ao carrinho com validação de estoque via API
- ✅ Persistência local do carrinho (SQLite)
- ✅ Checkout integrado ao PagSeguro (sandbox)
- ✅ Histórico de pedidos
- ✅ Seções especiais: Exclusivos, WineBox, Assinatura

---

## 👥 Equipe

| Membro | GitHub | Papel |
|---|---|---|
| Leonardo Lopes Ribeiro | [@leoLopesRibeiro](https://github.com/leoLopesRibeiro) | Frontend (React Native) |
| HLN Lobo | [@HLN-lobo](https://github.com/HLN-lobo) | Backend (Node.js / API) |

---

## 📄 Licença

Este projeto é de uso acadêmico/educacional. Todos os direitos reservados aos autores.
