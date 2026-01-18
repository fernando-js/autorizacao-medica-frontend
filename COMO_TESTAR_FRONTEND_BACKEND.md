# 🚀 Como Testar Frontend e Backend Juntos

Guia para rodar e testar o frontend integrado com o backend.

## 📋 Pré-requisitos

- Backend instalado e funcional
- Frontend servido via HTTP (não pode ser `file://`)

## 🚀 Passo a Passo

### 1. Iniciar o Backend

Em um terminal:

```bash
cd /home/fernando/Documentos/projetoTFD/backend
source venv/bin/activate
python3 main.py
```

O backend deve iniciar em: **http://localhost:8001**

Verifique acessando: http://localhost:8001/health

### 2. Iniciar o Frontend

Em outro terminal:

```bash
cd /home/fernando/Documentos/projetoTFD/frontend
python3 -m http.server 8000
```

O frontend deve iniciar em: **http://localhost:8000**

### 3. Acessar o Sistema

Abra no navegador:
- **Frontend**: http://localhost:8000
- **Backend API Docs**: http://localhost:8001/docs

## 🧪 Testar a Integração

### 1. Testar Cadastro

1. Acesse: http://localhost:8000/cadastro.html
2. Preencha o formulário
3. Clique em "Criar Conta"
4. Deve criar o usuário no backend

### 2. Testar Login

1. Acesse: http://localhost:8000/login.html
2. Use o e-mail e senha cadastrados
3. Clique em "Entrar"
4. Deve fazer login e obter o token JWT

### 3. Testar Criar Autorização

1. Após login, acesse: http://localhost:8000/nova-autorizacao.html
2. Preencha o formulário
3. Clique em "Salvar Autorização"
4. Deve criar a autorização no backend

### 4. Testar Listagem

1. Acesse: http://localhost:8000/autorizacoes.html
2. Deve listar as autorizações do banco de dados

## 🔧 Configuração da API

O frontend está configurado para usar:
- **API URL**: `http://localhost:8001`

Se o backend estiver em outra porta ou URL, edite:
- Arquivo: `frontend/assets/js/api.js`
- Linha: `const API_URL = 'http://localhost:8001';`

## ✅ Checklist

- [ ] Backend rodando na porta 8001
- [ ] Frontend rodando na porta 8000
- [ ] CORS configurado no backend (já está configurado para localhost:8000)
- [ ] Token sendo salvo no localStorage após login
- [ ] Requisições autenticadas funcionando

## 🐛 Troubleshooting

**Erro de CORS:**
- Verifique se `CORS_ORIGINS` no backend inclui `http://localhost:8000`
- Backend já está configurado com CORS para localhost:8000

**Erro de conexão:**
- Verifique se o backend está rodando
- Verifique se a URL da API está correta em `api.js`

**Erro 401 (Unauthorized):**
- Faça login primeiro para obter o token
- Verifique se o token está sendo salvo no localStorage

**Erro 404:**
- Verifique se os endpoints estão corretos
- Consulte a documentação em http://localhost:8001/docs

## 📝 Nota Importante

O frontend agora usa a API do backend ao invés de localStorage. Certifique-se de que:

1. O backend está rodando antes de testar o frontend
2. Você faz login primeiro para obter o token JWT
3. O token é salvo automaticamente no localStorage após login
