// Página Home/Início
pages.home = function() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 animate-fade-in">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-blue-900 mb-2">ISEPAM</h1>
                    <p class="text-gray-600">Instituto Superior de Educação</p>
                    <p class="text-sm text-gray-500">Gerenciamento de Eventos Acadêmicos</p>
                </div>

                <!-- Descrição -->
                <div class="text-center mb-8 text-gray-600">
                    <p class="mb-4">Bem-vindo ao sistema de gerenciamento de eventos acadêmicos do ISEPAM.</p>
                    <p>Faça login ou cadastre-se para continuar.</p>
                </div>

                <!-- Botões -->
                <div class="space-y-3">
                    <button id="btn-login" class="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                        Entre com sua conta
                    </button>
                    <button id="btn-cadastro" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                        Criar nova conta
                    </button>
                </div>

                <!-- Acesso por código -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                    <p class="text-center text-sm text-gray-600 mb-3">Tem um código de acesso?</p>
                    <button id="btn-acesso-codigo" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200">
                        Acessar com código
                    </button>
                </div>
            </div>
        </div>
    `;
};

function attachHomeListeners() {
    // Buttons de navegação
    const btnLogin = document.getElementById('btn-login');
    const btnCadastro = document.getElementById('btn-cadastro');
    const btnAcessoCodigo = document.getElementById('btn-acesso-codigo');

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            window.location.hash = '#/login';
        });
    }

    if (btnCadastro) {
        btnCadastro.addEventListener('click', () => {
            window.location.hash = '#/cadastro';
        });
    }

    if (btnAcessoCodigo) {
        btnAcessoCodigo.addEventListener('click', () => {
            window.location.hash = '#/acesso';
        });
    }
}
