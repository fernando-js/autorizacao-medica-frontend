# Sistema de Autorização Médica - Frontend

Frontend do sistema de autorização médica e tratamento fora de domicílio, desenvolvido com HTML, Bootstrap 5 e JavaScript.

## 📋 Características

- **Tecnologias**: HTML5, CSS3 (Bootstrap 5), JavaScript (Vanilla)
- **Design**: Responsivo e moderno com Bootstrap 5
- **Armazenamento**: LocalStorage (temporário - será substituído pela API do backend)

## 🚀 Como Usar

### Desenvolvimento Local

1. Clone este repositório
2. Abra o arquivo `index.html` em um navegador web moderno
3. Não é necessário instalar dependências (Bootstrap via CDN)

### Estrutura do Projeto

```
frontend/
├── index.html                 # Página inicial
├── nova-autorizacao.html      # Formulário de nova autorização
├── autorizacoes.html          # Listagem de autorizações
├── assets/
│   ├── css/
│   │   └── style.css          # Estilos customizados
│   └── js/
│       └── app.js             # Lógica JavaScript
└── README.md
```

## 📱 Funcionalidades

### Página Inicial
- Dashboard com estatísticas (Total, Aprovadas, Pendentes, Rejeitadas)
- Listagem das últimas 5 autorizações
- Cards informativos

### Nova Autorização
- Formulário completo com:
  - Dados do paciente (nome, CPF, telefone, etc.)
  - Dados do médico solicitante (nome, CRM, UF)
  - Dados do tratamento (tipo, local, datas, frequência, justificativa)
- Validação de campos obrigatórios
- Máscaras de input (CPF, telefone, CEP)

### Listagem de Autorizações
- Tabela com todas as autorizações
- Filtros por status, paciente e datas
- Visualização de detalhes em modal
- Busca e ordenação

## 🔧 Tecnologias Utilizadas

- **Bootstrap 5.3.2**: Framework CSS para layout responsivo
- **Bootstrap Icons**: Ícones do Bootstrap
- **JavaScript Vanilla**: Lógica de aplicação
- **LocalStorage**: Armazenamento temporário (será substituído por backend)

## 📦 Deploy no Easypanel

O frontend estático pode ser facilmente deployado no Easypanel:

1. Crie um novo projeto no Easypanel
2. Escolha "Static Site" como tipo de aplicação
3. Conecte este repositório GitHub
4. Configure o diretório raiz como `/`
5. O Easypanel servirá os arquivos HTML/CSS/JS automaticamente

### Preparação para Deploy

Certifique-se de que:
- Todos os arquivos estão no repositório
- O `index.html` está na raiz do projeto
- Os caminhos dos assets estão relativos (sem `/` no início)

## 🔄 Integração com Backend

Quando o backend estiver pronto, será necessário:

1. Configurar a URL da API no arquivo `assets/js/app.js`
2. Substituir as funções que usam `localStorage` por chamadas à API REST
3. Implementar autenticação e tokens de acesso

## 📝 Observações

- Atualmente os dados são armazenados no `localStorage` do navegador
- Este é apenas o frontend - o backend está em outro repositório
- O sistema está preparado para receber dados de uma API REST

## 👨‍💻 Desenvolvimento

Este projeto faz parte de um sistema maior que inclui:
- **Frontend**: Este repositório (HTML/CSS/JS)
- **Backend**: Repositório separado (Python/API REST)
