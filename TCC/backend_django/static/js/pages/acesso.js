/* Página de Acesso com Código */

// Instância global da página
let acessoPageInstance = null;

// Página Acesso
pages.acesso = function() {
    if (!acessoPageInstance) {
        acessoPageInstance = new AcessoPage();
    }
    return acessoPageInstance.render();
};

// Classe da Página de Acesso
class AcessoPage {
    constructor() {
        this.step = 1; // 1: matricula, 2: codigo, 3: senha, 4: sucesso
        this.matricula = null;
        this.codigo = null;
        this.usuarioData = null;
    }

    render() {
        let html = '';
        
        switch(this.step) {
            case 1:
                html = this.renderSolicitarAcesso();
                break;
            case 2:
                html = this.renderVerificacaoPendente();
                break;
            case 3:
                html = this.renderVericarCodigo();
                break;
            case 4:
                html = this.renderDefinirSenha();
                break;
            case 5:
                html = this.renderSucesso();
                break;
            default:
                html = this.renderSolicitarAcesso();
        }
        
        // Aguarda o DOM ser renderizado antes de anexar listeners
        setTimeout(() => {
            this.attachListeners();
        }, 100);
        
        return html;
    }

    renderSolicitarAcesso() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Acesso ao Sistema</h1>
                        <p class="text-gray-600">Insira sua matrícula para solicitar acesso</p>
                    </div>

                    <form id="solicitarForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Matrícula
                            </label>
                            <input
                                type="text"
                                id="matriculaInput"
                                placeholder="Ex: 12345"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                        >
                            Solicitar Acesso
                        </button>
                    </form>

                    <div id="erro" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg hidden"></div>
                    <div id="carregando" class="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg hidden">
                        <span class="animate-spin inline-block mr-2">⏳</span> Processando...
                    </div>

                    <p class="text-center text-xs text-gray-500 mt-6">
                        Um código de acesso será enviado para seu email
                    </p>
                </div>
            </div>
        `;
    }

    renderVerificacaoPendente() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div class="mb-6">
                        <div class="inline-block bg-green-100 text-green-700 rounded-full p-4 mb-4">
                            ✓
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">Email Enviado!</h2>
                        <p class="text-gray-600">
                            Um código de acesso foi enviado para seu email.
                        </p>
                        <p class="text-gray-500 text-sm mt-2">
                            O código é válido por 30 minutos.
                        </p>
                    </div>

                    <button
                        id="continuarBtn"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        `;
    }

    renderVericarCodigo() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Verificar Código</h1>
                        <p class="text-gray-600">Insira o código recebido por email</p>
                    </div>

                    <form id="codigoForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Código de Acesso (8 dígitos)
                            </label>
                            <input
                                type="text"
                                id="codigoInput"
                                placeholder="Ex: 12345678"
                                maxlength="8"
                                pattern="[0-9]{8}"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-2xl tracking-widest text-center"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                        >
                            Verificar Código
                        </button>
                    </form>

                    <button
                        id="voltarBtn"
                        class="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
                    >
                        Voltar
                    </button>

                    <div id="erro" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg hidden"></div>
                    <div id="carregando" class="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg hidden">
                        <span class="animate-spin inline-block mr-2">⏳</span> Verificando...
                    </div>
                </div>
            </div>
        `;
    }

    renderDefinirSenha() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Defina sua Senha</h1>
                        <p class="text-gray-600">Crie uma senha para sua conta</p>
                    </div>

                    <form id="senhaForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="senhaInput"
                                placeholder="Mínimo 6 caracteres"
                                minlength="6"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                id="senhaConfirmInput"
                                placeholder="Confirme a senha"
                                minlength="6"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                        >
                            Criar Conta
                        </button>
                    </form>

                    <div id="erro" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg hidden"></div>
                    <div id="carregando" class="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg hidden">
                        <span class="animate-spin inline-block mr-2">⏳</span> Criando conta...
                    </div>
                </div>
            </div>
        `;
    }

    renderSucesso() {
        let msg = 'Conta criada com sucesso!';
        if (this.usuarioData) {
            msg = `Bem-vindo, ${this.usuarioData.nome}!`;
        }
        
        return `
            <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
                <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div class="mb-6">
                        <div class="inline-block bg-green-100 text-green-700 rounded-full p-4 mb-4">
                            ✓
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">${msg}</h2>
                        <p class="text-gray-600 mt-2">
                            Sua conta foi criada com sucesso. Você será redirecionado para o login em poucos segundos.
                        </p>
                    </div>

                    <button
                        id="irLoginBtn"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        Ir para Login
                    </button>
                </div>
            </div>
        `;
    }

    attachListeners() {
        // Step 1: Solicitar acesso
        const solicitarForm = document.getElementById('solicitarForm');
        if (solicitarForm) {
            solicitarForm.addEventListener('submit', (e) => this.handleSolicitarAcesso(e));
        }

        // Step 2: Continuar
        const continuarBtn = document.getElementById('continuarBtn');
        if (continuarBtn) {
            continuarBtn.addEventListener('click', () => {
                this.step = 3;
                pages.acesso = () => new AcessoPage().render.call(this);
                window.currentRouter.navigate('/acesso/codigo');
            });
        }

        // Step 3: Verificar código
        const codigoForm = document.getElementById('codigoForm');
        const voltarBtn = document.getElementById('voltarBtn');
        
        if (codigoForm) {
            codigoForm.addEventListener('submit', (e) => this.handleVerificarCodigo(e));
        }
        if (voltarBtn) {
            voltarBtn.addEventListener('click', () => {
                this.step = 1;
                acessoPageInstance = null;
                window.location.hash = '#acesso';
            });
        }

        // Step 4: Definir senha
        const senhaForm = document.getElementById('senhaForm');
        if (senhaForm) {
            senhaForm.addEventListener('submit', (e) => this.handleDefinirSenha(e));
        }

        // Step 5: Ir para login
        const irLoginBtn = document.getElementById('irLoginBtn');
        if (irLoginBtn) {
            irLoginBtn.addEventListener('click', () => {
                acessoPageInstance = null;
                window.location.hash = '#login';
            });
        }
    }

    async handleSolicitarAcesso(evento) {
        evento.preventDefault();
        const matricula = document.getElementById('matriculaInput').value.trim();

        if (!matricula) {
            this.mostraErro('Por favor, insira sua matrícula');
            return;
        }

        this.mostraCarregando();
        try {
            const response = await fetch('/api/auth/solicit-access/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ matricula })
            });

            const data = await response.json();

            if (!response.ok) {
                this.mostraErro(data.erro || 'Erro ao solicitar acesso');
                document.getElementById('carregando').classList.add('hidden');
                return;
            }

            this.matricula = matricula;
            this.step = 2;
            pages.acesso = () => this.render.call(this);
            
            // Re-render e aguarda 2 segundos antes de mudar para step 3
            document.getElementById('root').innerHTML = this.render();
            
            setTimeout(() => {
                this.step = 3;
                pages.acesso = () => this.render.call(this);
                window.currentRouter.navigate('/acesso/codigo');
            }, 2000);

        } catch (erro) {
            console.error('Erro:', erro);
            this.mostraErro('Erro ao conectar com servidor');
            document.getElementById('carregando').classList.add('hidden');
        }
    }

    async handleVerificarCodigo(evento) {
        evento.preventDefault();
        const codigo = document.getElementById('codigoInput').value.trim();

        if (!codigo || codigo.length !== 8) {
            this.mostraErro('Por favor, insira um código válido (8 dígitos)');
            return;
        }

        this.mostraCarregando();
        try {
            const response = await fetch('/api/auth/verify-code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    matricula: this.matricula,
                    codigo: codigo
                })
            });

            const data = await response.json();

            if (!response.ok) {
                this.mostraErro(data.erro || 'Código inválido ou expirado');
                document.getElementById('carregando').classList.add('hidden');
                return;
            }

            this.codigo = codigo;
            this.step = 4;
            pages.acesso = () => this.render.call(this);
            document.getElementById('root').innerHTML = this.render();

        } catch (erro) {
            console.error('Erro:', erro);
            this.mostraErro('Erro ao conectar com servidor');
            document.getElementById('carregando').classList.add('hidden');
        }
    }

    async handleDefinirSenha(evento) {
        evento.preventDefault();
        const senha = document.getElementById('senhaInput').value;
        const senhaConfirm = document.getElementById('senhaConfirmInput').value;

        if (senha !== senhaConfirm) {
            this.mostraErro('As senhas não coincidem');
            return;
        }

        if (senha.length < 6) {
            this.mostraErro('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        this.mostraCarregando();
        try {
            const response = await fetch('/api/auth/set-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    matricula: this.matricula,
                    codigo: this.codigo,
                    senha: senha
                })
            });

            const data = await response.json();

            if (!response.ok) {
                this.mostraErro(data.erro || 'Erro ao crear conta');
                document.getElementById('carregando').classList.add('hidden');
                return;
            }

            this.usuarioData = data.usuario;
            this.step = 5;
            pages.acesso = () => this.render.call(this);
            document.getElementById('root').innerHTML = this.render();

            // Redireciona após 3 segundos
            setTimeout(() => {
                acessoPageInstance = null;
                window.location.hash = '#login';
            }, 3000);

        } catch (erro) {
            console.error('Erro:', erro);
            this.mostraErro('Erro ao conectar com servidor');
            document.getElementById('carregando').classList.add('hidden');
        }
    }

    mostraErro(msg) {
        const erroDiv = document.getElementById('erro');
        const carregandoDiv = document.getElementById('carregando');
        
        if (carregandoDiv) carregandoDiv.classList.add('hidden');
        
        if (erroDiv) {
            erroDiv.textContent = msg;
            erroDiv.classList.remove('hidden');
        }
    }

    mostraCarregando() {
        const erroDiv = document.getElementById('erro');
        const carregandoDiv = document.getElementById('carregando');
        
        if (erroDiv) erroDiv.classList.add('hidden');
        if (carregandoDiv) carregandoDiv.classList.remove('hidden');
    }
}
