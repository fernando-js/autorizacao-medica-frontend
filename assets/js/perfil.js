// Sistema de Perfil do Usuário

// Carregar dados do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Só executar se estiver na página de perfil
    if (document.getElementById('perfilNome')) {
        carregarDadosPerfil();
        
        // Máscaras
        const cpfInput = document.getElementById('perfilCPF');
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

        const cnpjInput = document.getElementById('perfilCNPJ');
        if (cnpjInput) {
            cnpjInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 14) {
                    value = value.replace(/(\d{2})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1/$2');
                    value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
                    e.target.value = value;
                }
            });
        }

        const telInput = document.getElementById('perfilTelefone');
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

        // Validação de senhas
        const confirmarSenha = document.getElementById('confirmarNovaSenhaPerfil');
        const novaSenha = document.getElementById('novaSenhaPerfil');
        if (confirmarSenha && novaSenha) {
            confirmarSenha.addEventListener('input', function() {
                if (confirmarSenha.value !== novaSenha.value) {
                    confirmarSenha.setCustomValidity('As senhas não coincidem');
                } else {
                    confirmarSenha.setCustomValidity('');
                }
            });
        }

        // Formulários
        const formDadosPessoais = document.getElementById('formDadosPessoais');
        if (formDadosPessoais) {
            formDadosPessoais.addEventListener('submit', function(e) {
                e.preventDefault();
                atualizarDadosPessoais();
            });
        }

        const formDadosMunicipio = document.getElementById('formDadosMunicipio');
        if (formDadosMunicipio) {
            formDadosMunicipio.addEventListener('submit', function(e) {
                e.preventDefault();
                atualizarDadosMunicipio();
            });
        }

        const formAlterarSenha = document.getElementById('formAlterarSenha');
        if (formAlterarSenha) {
            formAlterarSenha.addEventListener('submit', function(e) {
                e.preventDefault();
                alterarSenhaPerfil();
            });
        }
    }
});

// Carregar dados do perfil
async function carregarDadosPerfil() {
    try {
        // Carregar dados do usuário da API ou do localStorage
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
        
        // Se tiver token, buscar dados atualizados da API
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const usuarioAtualizado = await authAPI.getCurrentUser();
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
                preencherFormularios(usuarioAtualizado);
                return;
            } catch (error) {
                console.warn('Não foi possível buscar dados da API, usando localStorage:', error);
            }
        }
        
        preencherFormularios(usuario);
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro ao carregar dados do perfil');
    }
}

// Preencher formulários com dados do usuário
function preencherFormularios(usuario) {
    // Dados pessoais
    if (document.getElementById('perfilNome')) {
        document.getElementById('perfilNome').value = usuario.nome || '';
        document.getElementById('perfilCPF').value = usuario.cpf || '';
        document.getElementById('perfilDataNascimento').value = usuario.data_nascimento || usuario.dataNascimento || '';
        document.getElementById('perfilTelefone').value = usuario.telefone || '';
        document.getElementById('perfilEmail').value = usuario.email || '';
    }

    // Dados do município
    if (document.getElementById('perfilNomeMunicipio')) {
        document.getElementById('perfilNomeMunicipio').value = usuario.nome_municipio || usuario.nomeMunicipio || '';
        document.getElementById('perfilCNPJ').value = usuario.cnpj || '';
        document.getElementById('perfilUF').value = usuario.uf || '';
        document.getElementById('perfilCidade').value = usuario.cidade || '';
    }
}

// Atualizar dados pessoais
async function atualizarDadosPessoais() {
    try {
        const dados = {
            nome: document.getElementById('perfilNome').value,
            cpf: document.getElementById('perfilCPF').value.replace(/\D/g, ''),
            data_nascimento: document.getElementById('perfilDataNascimento').value,
            telefone: document.getElementById('perfilTelefone').value.replace(/\D/g, ''),
            email: document.getElementById('perfilEmail').value
        };

        // Atualizar no localStorage (temporário - será substituído por API)
        let usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        usuario = { ...usuario, ...dados };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        alert('Dados pessoais atualizados com sucesso!');
        
        // Atualizar navbar
        atualizarNavbar();
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        alert('Erro ao atualizar dados pessoais');
    }
}

// Atualizar dados do município
async function atualizarDadosMunicipio() {
    try {
        const dados = {
            nome_municipio: document.getElementById('perfilNomeMunicipio').value,
            cnpj: document.getElementById('perfilCNPJ').value.replace(/\D/g, ''),
            uf: document.getElementById('perfilUF').value,
            cidade: document.getElementById('perfilCidade').value
        };

        // Atualizar no localStorage (temporário - será substituído por API)
        let usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        usuario = { ...usuario, ...dados };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        alert('Dados do município atualizados com sucesso!');
        
        // Atualizar navbar
        atualizarNavbar();
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        alert('Erro ao atualizar dados do município');
    }
}

// Alterar senha
async function alterarSenhaPerfil() {
    try {
        const senhaAtual = document.getElementById('senhaAtual').value;
        const novaSenha = document.getElementById('novaSenhaPerfil').value;
        const confirmarSenha = document.getElementById('confirmarNovaSenhaPerfil').value;

        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        // TODO: Chamar API para alterar senha
        // Por enquanto, apenas validação
        alert('Funcionalidade de alterar senha será implementada com a API do backend');
        
        // Limpar formulário
        document.getElementById('formAlterarSenha').reset();
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        alert('Erro ao alterar senha');
    }
}
