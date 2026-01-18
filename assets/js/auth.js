// Sistema de Autenticação - JavaScript

// Armazenamento de usuários e sessão
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null;

// Função para salvar usuários
function salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Função para salvar sessão
function salvarSessao(usuario) {
    usuarioLogado = usuario;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
}

// Função para logout
function logout() {
    usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

// Função para verificar se está logado
function verificarLogin() {
    if (!usuarioLogado && !window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('cadastro.html') && 
        !window.location.pathname.includes('recuperar-senha.html')) {
        window.location.href = 'login.html';
    }
}

// Máscaras e validações
document.addEventListener('DOMContentLoaded', function() {
    // Máscara CPF no cadastro
    const cpfCadastro = document.getElementById('cpf');
    if (cpfCadastro) {
        cpfCadastro.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            }
        });
    }

    // Máscara CNPJ
    const cnpjInput = document.getElementById('cnpj');
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

    // Máscara telefone no cadastro
    const telCadastro = document.getElementById('telefone');
    if (telCadastro) {
        telCadastro.addEventListener('input', function(e) {
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

    // Código de verificação - apenas números
    const codigoInput = document.getElementById('codigoVerificacao');
    if (codigoInput) {
        codigoInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Validação de senha - confirmar senha
    const senhaConfirmacao = document.getElementById('senhaConfirmacao');
    const senha = document.getElementById('senha');
    if (senhaConfirmacao && senha) {
        senhaConfirmacao.addEventListener('input', function() {
            if (senhaConfirmacao.value !== senha.value) {
                senhaConfirmacao.setCustomValidity('As senhas não coincidem');
            } else {
                senhaConfirmacao.setCustomValidity('');
            }
        });
    }

    // Validação de e-mail - confirmar e-mail
    const emailConfirmacao = document.getElementById('emailConfirmacao');
    const email = document.getElementById('email');
    if (emailConfirmacao && email) {
        emailConfirmacao.addEventListener('input', function() {
            if (emailConfirmacao.value !== email.value) {
                emailConfirmacao.setCustomValidity('Os e-mails não coincidem');
            } else {
                emailConfirmacao.setCustomValidity('');
            }
        });
    }

    // Validação nova senha
    const confirmarNovaSenha = document.getElementById('confirmarNovaSenha');
    const novaSenha = document.getElementById('novaSenha');
    if (confirmarNovaSenha && novaSenha) {
        confirmarNovaSenha.addEventListener('input', function() {
            if (confirmarNovaSenha.value !== novaSenha.value) {
                confirmarNovaSenha.setCustomValidity('As senhas não coincidem');
            } else {
                confirmarNovaSenha.setCustomValidity('');
            }
        });
    }

    // Formulário de Login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            fazerLogin();
        });
    }

    // Formulário de Cadastro
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            fazerCadastro();
        });
    }

    // Formulário de Recuperação - Passo 1
    const formRecuperarEmail = document.getElementById('formRecuperarEmail');
    if (formRecuperarEmail) {
        formRecuperarEmail.addEventListener('submit', function(e) {
            e.preventDefault();
            enviarCodigoRecuperacao();
        });
    }

    // Formulário de Recuperação - Passo 2
    const formVerificarCodigo = document.getElementById('formVerificarCodigo');
    if (formVerificarCodigo) {
        formVerificarCodigo.addEventListener('submit', function(e) {
            e.preventDefault();
            verificarCodigoRecuperacao();
        });
    }

    // Formulário de Recuperação - Passo 3
    const formNovaSenha = document.getElementById('formNovaSenha');
    if (formNovaSenha) {
        formNovaSenha.addEventListener('submit', function(e) {
            e.preventDefault();
            redefinirSenha();
        });
    }

    // Verificar login em páginas protegidas
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname.includes('nova-autorizacao.html') ||
        window.location.pathname.includes('tratamento-fora-domicilio.html') ||
        window.location.pathname.includes('autorizacoes.html')) {
        verificarLogin();
    }

    // Atualizar navbar com informações do usuário
    atualizarNavbar();
});

// Função para fazer login
function fazerLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const lembrar = document.getElementById('lembrar').checked;

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        salvarSessao(usuario);
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';
    } else {
        alert('E-mail ou senha incorretos!');
    }
}

// Função para fazer cadastro
async function fazerCadastro() {
    const email = document.getElementById('email').value;
    const emailConfirmacao = document.getElementById('emailConfirmacao').value;
    const senha = document.getElementById('senha').value;
    const senhaConfirmacao = document.getElementById('senhaConfirmacao').value;

    // Verificar se e-mail já existe
    if (usuarios.find(u => u.email === email)) {
        alert('Este e-mail já está cadastrado!');
        return;
    }

    // Verificar se e-mails coincidem
    if (email !== emailConfirmacao) {
        alert('Os e-mails não coincidem!');
        return;
    }

    // Verificar se senhas coincidem
    if (senha !== senhaConfirmacao) {
        alert('As senhas não coincidem!');
        return;
    }

    const novoUsuario = {
        id: Date.now(),
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        nomeMunicipio: document.getElementById('nomeMunicipio').value,
        cnpj: document.getElementById('cnpj').value,
        uf: document.getElementById('uf').value,
        cidade: document.getElementById('cidade').value,
        email: email,
        senha: senha,
        plano: 'gratuito',
        criadoEm: new Date().toISOString().split('T')[0]
    };

    usuarios.push(novoUsuario);
    salvarUsuarios();

    alert('Conta criada com sucesso! Faça login para continuar.');
    window.location.href = 'login.html';
}

// Função para enviar código de recuperação
function enviarCodigoRecuperacao() {
    const email = document.getElementById('emailRecuperacao').value;
    
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        alert('E-mail não encontrado!');
        return;
    }

    // Gerar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Salvar código temporário (em produção seria enviado por e-mail)
    localStorage.setItem('codigoRecuperacao', JSON.stringify({
        email: email,
        codigo: codigo,
        timestamp: Date.now()
    }));

    // Mostrar passo 2
    document.getElementById('formStep1').style.display = 'none';
    document.getElementById('formStep2').style.display = 'block';
    document.getElementById('emailMostrado').textContent = email;
    
    // Atualizar indicador
    document.getElementById('step1').classList.add('completed');
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');

    alert(`Código enviado para ${email}. Em produção, seria enviado por e-mail. Código: ${codigo}`);
}

// Função para verificar código de recuperação
function verificarCodigoRecuperacao() {
    const codigoDigitado = document.getElementById('codigoVerificacao').value;
    const codigoSalvo = JSON.parse(localStorage.getItem('codigoRecuperacao') || '{}');

    // Verificar se código expirou (10 minutos)
    const expirado = (Date.now() - (codigoSalvo.timestamp || 0)) > 600000;

    if (expirado) {
        alert('Código expirado! Solicite um novo código.');
        return;
    }

    if (codigoDigitado === codigoSalvo.codigo) {
        // Mostrar passo 3
        document.getElementById('formStep2').style.display = 'none';
        document.getElementById('formStep3').style.display = 'block';
        
        // Atualizar indicador
        document.getElementById('step2').classList.add('completed');
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step3').classList.add('active');
    } else {
        alert('Código inválido!');
    }
}

// Função para redefinir senha
function redefinirSenha() {
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarNovaSenha = document.getElementById('confirmarNovaSenha').value;
    const codigoSalvo = JSON.parse(localStorage.getItem('codigoRecuperacao') || '{}');

    if (novaSenha !== confirmarNovaSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Atualizar senha do usuário
    const usuario = usuarios.find(u => u.email === codigoSalvo.email);
    if (usuario) {
        usuario.senha = novaSenha;
        salvarUsuarios();
        localStorage.removeItem('codigoRecuperacao');
        
        alert('Senha redefinida com sucesso!');
        window.location.href = 'login.html';
    }
}

// Função para reenviar código
function reenviarCodigo() {
    const codigoSalvo = JSON.parse(localStorage.getItem('codigoRecuperacao') || '{}');
    document.getElementById('emailRecuperacao').value = codigoSalvo.email;
    enviarCodigoRecuperacao();
}

// Função para voltar ao passo 1
function voltarStep1() {
    document.getElementById('formStep1').style.display = 'block';
    document.getElementById('formStep2').style.display = 'none';
    document.getElementById('step1').classList.add('active');
    document.getElementById('step1').classList.remove('completed');
    document.getElementById('step2').classList.remove('active');
}

// Função para atualizar navbar com informações do usuário
function atualizarNavbar() {
    const navUsuario = document.getElementById('navUsuario');
    if (!navUsuario) return;

    // Limpar conteúdo anterior
    navUsuario.innerHTML = '';

    if (usuarioLogado) {
        // Usuário logado - mostrar dropdown com informações
        const nomeExibido = usuarioLogado.nome_municipio || usuarioLogado.nomeMunicipio || usuarioLogado.nome || 'Usuário';
        const emailExibido = usuarioLogado.email || '';
        
        navUsuario.innerHTML = `
            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i> ${nomeExibido}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li class="px-3 py-2 border-bottom">
                    <small class="text-muted">Logado como:</small><br>
                    <strong>${nomeExibido}</strong><br>
                    <small class="text-muted">${emailExibido}</small>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item" href="perfil.html">
                        <i class="bi bi-person-gear"></i> Meu Perfil
                    </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item text-danger" href="#" onclick="logout(); return false;">
                        <i class="bi bi-box-arrow-right"></i> Sair
                    </a>
                </li>
            </ul>
        `;
    } else {
        // Usuário não logado - mostrar opções de login/cadastro
        navUsuario.innerHTML = `
            <a class="nav-link text-white" href="login.html">
                <i class="bi bi-box-arrow-in-right"></i> Entrar
            </a>
            <a class="nav-link text-white" href="cadastro.html">
                <i class="bi bi-person-plus"></i> Cadastrar
            </a>
        `;
    }
}
