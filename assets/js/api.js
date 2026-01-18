// Configuração da API e funções para comunicação com backend

// URL da API - Detecta automaticamente se está em produção ou desenvolvimento
// Para produção, defina a URL do seu backend no Easypanel
// Exemplo: const API_URL = 'https://autorizacao-medica-backend.seu-dominio.com';
const API_URL = (() => {
    // Se estiver rodando em localhost, use o backend local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8001';
    }
    // Caso contrário, use a URL do backend em produção
    // IMPORTANTE: Altere esta URL para a URL real do seu backend no Easypanel
    return 'https://seu-backend.easypanel.com'; // ⚠️ MUDE ISSO PARA SUA URL REAL
})();

// Função para obter token do localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Função para fazer requisições HTTP autenticadas
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const url = `${API_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || `Erro ${response.status}: ${response.statusText}`);
        }
        
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Funções de Autenticação
const authAPI = {
    // Cadastrar usuário
    async cadastrar(usuario) {
        return await apiRequest('/api/auth/cadastro', {
            method: 'POST',
            body: JSON.stringify(usuario),
        });
    },
    
    // Fazer login
    async login(email, senha) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', senha);
        
        return await apiRequest('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });
    },
    
    // Obter usuário atual
    async getCurrentUser() {
        return await apiRequest('/api/auth/me');
    },
};

// Funções de Autorizações
const autorizacoesAPI = {
    // Criar autorização
    async criar(autorizacao) {
        return await apiRequest('/api/autorizacoes', {
            method: 'POST',
            body: JSON.stringify(autorizacao),
        });
    },
    
    // Listar autorizações
    async listar(filtros = {}) {
        const params = new URLSearchParams();
        if (filtros.status) params.append('status_filter', filtros.status);
        if (filtros.skip) params.append('skip', filtros.skip);
        if (filtros.limit) params.append('limit', filtros.limit);
        
        const queryString = params.toString();
        const endpoint = `/api/autorizacoes${queryString ? '?' + queryString : ''}`;
        
        return await apiRequest(endpoint);
    },
    
    // Obter autorização por ID
    async obter(id) {
        return await apiRequest(`/api/autorizacoes/${id}`);
    },
};

// Funções de Tratamentos
const tratamentosAPI = {
    // Criar tratamento
    async criar(tratamento) {
        return await apiRequest('/api/tratamentos', {
            method: 'POST',
            body: JSON.stringify(tratamento),
        });
    },
    
    // Listar tratamentos
    async listar(filtros = {}) {
        const params = new URLSearchParams();
        if (filtros.status) params.append('status_filter', filtros.status);
        if (filtros.skip) params.append('skip', filtros.skip);
        if (filtros.limit) params.append('limit', filtros.limit);
        
        const queryString = params.toString();
        const endpoint = `/api/tratamentos${queryString ? '?' + queryString : ''}`;
        
        return await apiRequest(endpoint);
    },
    
    // Obter tratamento por ID
    async obter(id) {
        return await apiRequest(`/api/tratamentos/${id}`);
    },
};
