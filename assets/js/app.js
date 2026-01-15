// Sistema de Autorização Médica - JavaScript

// Armazenamento local (simulando banco de dados)
let autorizacoes = JSON.parse(localStorage.getItem('autorizacoes')) || [];

// Função para salvar autorizações no localStorage
function salvarAutorizacoes() {
    localStorage.setItem('autorizacoes', JSON.stringify(autorizacoes));
}

// Função para formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para formatar telefone
function formatarTelefone(tel) {
    tel = tel.replace(/\D/g, '');
    if (tel.length === 11) {
        return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (tel.length === 10) {
        return tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return tel;
}

// Máscaras de input
document.addEventListener('DOMContentLoaded', function() {
    // Máscara CPF
    const cpfInput = document.getElementById('cpfPaciente');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            }
        });
    }

    // Máscara telefone
    const telInput = document.getElementById('telefonePaciente');
    if (telInput) {
        telInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }

    // Máscara CEP
    const cepInput = document.getElementById('cepTratamento');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    }

    // Submissão do formulário
    const formAutorizacao = document.getElementById('formAutorizacao');
    if (formAutorizacao) {
        formAutorizacao.addEventListener('submit', function(e) {
            e.preventDefault();
            criarAutorizacao();
        });
    }

    // Carregar dados na página inicial
    if (document.getElementById('tabelaAutorizacoes')) {
        carregarAutorizacoes();
        atualizarEstatisticas();
    }

    // Carregar autorizações na página de listagem
    if (document.URL.includes('autorizacoes.html')) {
        renderizarTabelaAutorizacoes();
    }
});

// Função para criar nova autorização
function criarAutorizacao() {
    const autorizacao = {
        id: Date.now(),
        paciente: {
            nome: document.getElementById('nomePaciente').value,
            cpf: document.getElementById('cpfPaciente').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            telefone: document.getElementById('telefonePaciente').value,
            email: document.getElementById('emailPaciente').value,
            cidade: document.getElementById('cidadePaciente').value
        },
        medico: {
            nome: document.getElementById('nomeMedico').value,
            crm: document.getElementById('crmMedico').value,
            ufCrm: document.getElementById('ufCrm').value
        },
        tratamento: {
            tipo: document.getElementById('tipoTratamento').value,
            local: document.getElementById('localTratamento').value,
            dataInicio: document.getElementById('dataInicio').value,
            dataFim: document.getElementById('dataFim').value,
            frequencia: document.getElementById('frequencia').value,
            endereco: document.getElementById('enderecoTratamento').value,
            cidade: document.getElementById('cidadeTratamento').value,
            uf: document.getElementById('ufTratamento').value,
            cep: document.getElementById('cepTratamento').value,
            justificativa: document.getElementById('justificativa').value
        },
        status: 'pendente',
        dataCriacao: new Date().toISOString().split('T')[0]
    };

    autorizacoes.push(autorizacao);
    salvarAutorizacoes();

    alert('Autorização criada com sucesso!');
    window.location.href = 'index.html';
}

// Função para carregar autorizações na página inicial
function carregarAutorizacoes() {
    const tbody = document.getElementById('tabelaAutorizacoes');
    if (!tbody) return;

    if (autorizacoes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    Nenhuma autorização cadastrada ainda.
                </td>
            </tr>
        `;
        return;
    }

    // Ordenar por data de criação (mais recentes primeiro)
    const autorizacoesOrdenadas = [...autorizacoes].sort((a, b) => 
        new Date(b.dataCriacao) - new Date(a.dataCriacao)
    ).slice(0, 5); // Mostrar apenas as 5 mais recentes

    tbody.innerHTML = autorizacoesOrdenadas.map(auth => {
        const statusBadge = getStatusBadge(auth.status);
        const dataFormatada = new Date(auth.dataCriacao).toLocaleDateString('pt-BR');
        return `
            <tr onclick="verDetalhes(${auth.id})" style="cursor: pointer;">
                <td>#${auth.id}</td>
                <td>${auth.paciente.nome}</td>
                <td>${auth.medico.nome}</td>
                <td>${dataFormatada}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); verDetalhes(${auth.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Função para renderizar tabela completa de autorizações
function renderizarTabelaAutorizacoes(filtros = {}) {
    const tbody = document.getElementById('tabelaAutorizacoes');
    if (!tbody) return;

    let autorizacoesFiltradas = [...autorizacoes];

    // Aplicar filtros
    if (filtros.status) {
        autorizacoesFiltradas = autorizacoesFiltradas.filter(a => a.status === filtros.status);
    }
    if (filtros.paciente) {
        const nome = filtros.paciente.toLowerCase();
        autorizacoesFiltradas = autorizacoesFiltradas.filter(a => 
            a.paciente.nome.toLowerCase().includes(nome)
        );
    }
    if (filtros.dataInicio) {
        autorizacoesFiltradas = autorizacoesFiltradas.filter(a => 
            a.tratamento.dataInicio >= filtros.dataInicio
        );
    }
    if (filtros.dataFim) {
        autorizacoesFiltradas = autorizacoesFiltradas.filter(a => 
            a.tratamento.dataInicio <= filtros.dataFim
        );
    }

    if (autorizacoesFiltradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    Nenhuma autorização encontrada.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = autorizacoesFiltradas.map(auth => {
        const statusBadge = getStatusBadge(auth.status);
        const dataInicioFormatada = new Date(auth.tratamento.dataInicio).toLocaleDateString('pt-BR');
        return `
            <tr>
                <td>#${auth.id}</td>
                <td>${auth.paciente.nome}</td>
                <td>${auth.paciente.cpf}</td>
                <td>${auth.medico.nome} - CRM ${auth.medico.crm}/${auth.medico.ufCrm}</td>
                <td>${auth.tratamento.tipo}</td>
                <td>${dataInicioFormatada}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="verDetalhes(${auth.id})">
                        <i class="bi bi-eye"></i> Ver
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Função para obter badge de status
function getStatusBadge(status) {
    const badges = {
        'pendente': '<span class="badge bg-warning text-dark">Pendente</span>',
        'aprovada': '<span class="badge bg-success">Aprovada</span>',
        'rejeitada': '<span class="badge bg-danger">Rejeitada</span>'
    };
    return badges[status] || badges['pendente'];
}

// Função para ver detalhes da autorização
function verDetalhes(id) {
    const autorizacao = autorizacoes.find(a => a.id === id);
    if (!autorizacao) return;

    const modalBody = document.getElementById('modalDetalhesBody');
    if (!modalBody) {
        // Se não estiver na página com modal, redirecionar
        window.location.href = `autorizacoes.html?id=${id}`;
        return;
    }

    modalBody.innerHTML = `
        <div class="row mb-3">
            <div class="col-md-6">
                <h6 class="text-primary">Dados do Paciente</h6>
                <p><strong>Nome:</strong> ${autorizacao.paciente.nome}</p>
                <p><strong>CPF:</strong> ${autorizacao.paciente.cpf}</p>
                <p><strong>Data de Nascimento:</strong> ${new Date(autorizacao.paciente.dataNascimento).toLocaleDateString('pt-BR')}</p>
                <p><strong>Telefone:</strong> ${autorizacao.paciente.telefone}</p>
                <p><strong>E-mail:</strong> ${autorizacao.paciente.email || 'N/A'}</p>
                <p><strong>Cidade:</strong> ${autorizacao.paciente.cidade}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary">Dados do Médico</h6>
                <p><strong>Nome:</strong> ${autorizacao.medico.nome}</p>
                <p><strong>CRM:</strong> ${autorizacao.medico.crm}/${autorizacao.medico.ufCrm}</p>
            </div>
        </div>
        <hr>
        <div class="mb-3">
            <h6 class="text-primary">Dados do Tratamento</h6>
            <p><strong>Tipo:</strong> ${autorizacao.tratamento.tipo}</p>
            <p><strong>Local:</strong> ${autorizacao.tratamento.local}</p>
            <p><strong>Endereço:</strong> ${autorizacao.tratamento.endereco}, ${autorizacao.tratamento.cidade} - ${autorizacao.tratamento.uf}</p>
            <p><strong>CEP:</strong> ${autorizacao.tratamento.cep || 'N/A'}</p>
            <p><strong>Data de Início:</strong> ${new Date(autorizacao.tratamento.dataInicio).toLocaleDateString('pt-BR')}</p>
            <p><strong>Data de Término:</strong> ${autorizacao.tratamento.dataFim ? new Date(autorizacao.tratamento.dataFim).toLocaleDateString('pt-BR') : 'N/A'}</p>
            <p><strong>Frequência:</strong> ${autorizacao.tratamento.frequencia}</p>
        </div>
        <div class="mb-3">
            <h6 class="text-primary">Justificativa Médica</h6>
            <p class="text-muted">${autorizacao.tratamento.justificativa}</p>
        </div>
        <div class="mb-3">
            <p><strong>Status:</strong> ${getStatusBadge(autorizacao.status)}</p>
            <p><strong>Data de Criação:</strong> ${new Date(autorizacao.dataCriacao).toLocaleDateString('pt-BR')}</p>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('modalDetalhes'));
    modal.show();
}

// Função para atualizar estatísticas
function atualizarEstatisticas() {
    const total = autorizacoes.length;
    const aprovadas = autorizacoes.filter(a => a.status === 'aprovada').length;
    const pendentes = autorizacoes.filter(a => a.status === 'pendente').length;
    const rejeitadas = autorizacoes.filter(a => a.status === 'rejeitada').length;

    const totalEl = document.getElementById('totalAutorizacoes');
    const aprovadasEl = document.getElementById('aprovadas');
    const pendentesEl = document.getElementById('pendentes');
    const rejeitadasEl = document.getElementById('rejeitadas');

    if (totalEl) totalEl.textContent = total;
    if (aprovadasEl) aprovadasEl.textContent = aprovadas;
    if (pendentesEl) pendentesEl.textContent = pendentes;
    if (rejeitadasEl) rejeitadasEl.textContent = rejeitadas;
}

// Função para filtrar autorizações
function filtrarAutorizacoes() {
    const filtros = {
        status: document.getElementById('filtroStatus')?.value || '',
        paciente: document.getElementById('filtroPaciente')?.value || '',
        dataInicio: document.getElementById('filtroDataInicio')?.value || '',
        dataFim: document.getElementById('filtroDataFim')?.value || ''
    };
    renderizarTabelaAutorizacoes(filtros);
}

// Função para limpar filtros
function limparFiltros() {
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroPaciente').value = '';
    document.getElementById('filtroDataInicio').value = '';
    document.getElementById('filtroDataFim').value = '';
    renderizarTabelaAutorizacoes();
}
