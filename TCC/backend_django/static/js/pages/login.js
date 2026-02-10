// Página Login
pages.login = function() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 animate-fade-in">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-blue-900 mb-2">ISEPAM</h1>
                    <p class="text-gray-600">Instituto Superior de Educação</p>
                    <p class="text-sm text-gray-500">Gerenciamento de Eventos Acadêmicos</p>
                </div>

                <!-- Formulário -->
                <form id="login-form" class="space-y-5">
                    <div id="error-message"></div>

                    <!-- Campo Matrícula -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Matrícula
                        </label>
                        <div class="relative">
                            <svg class="absolute left-3 top-3 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <input
                                type="text"
                                id="matricula"
                                placeholder="Digite sua matrícula"
                                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    <!-- Campo Senha -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Senha
                        </label>
                        <div class="relative">
                            <svg class="absolute left-3 top-3 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Digite sua senha"
                                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    <!-- Botão Entrar -->
                    <button
                        type="submit"
                        id="login-btn"
                        class="w-full py-3 bg-gradient-to-r from-blue-900 to-purple-900 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                    >
                        Entrar
                    </button>
                </form>

                <!-- Link Cadastro -->
                <div class="text-center mt-6 pt-6 border-t border-gray-200">
                    <p class="text-gray-600 mb-3">Não tem conta?</p>
                    <a href="#/acesso" class="text-blue-900 font-semibold hover:text-purple-900 transition">
                        Solicite acesso aqui
                    </a>
                </div>

                <!-- Dica para teste -->
                <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                    <p class="font-semibold mb-1">Para testar:</p>
                    <p>Matrícula: <code class="bg-white px-1 rounded">12345</code> ou <code class="bg-white px-1 rounded">COORD001</code></p>
                    <p>Senha: qualquer senha com 6+ caracteres</p>
                </div>
            </div>
        </div>
    `;
};

// Executar após renderização
document.addEventListener('DOMContentLoaded', () => {
    if (window.currentRouter && window.currentRouter.currentPage === '/login') {
        attachLoginListeners();
    }
});

function attachLoginListeners() {
    const form = document.getElementById('login-form');
    const matriculaInput = document.getElementById('matricula');
    const senhaInput = document.getElementById('senha');
    const loginBtn = document.getElementById('login-btn');
    const errorDiv = document.getElementById('error-message');

    console.log('ATTACH: Procurando form com ID login-form');
    if (!form) {
        console.log('ATTACH: ERRO - Form nao encontrado!');
        return;
    }
    
    console.log('ATTACH: Form encontrado, anexando listener');

    form.addEventListener('submit', async (e) => {
        console.log('SUBMIT: Formulario foi submetido!');
        e.preventDefault();
        errorDiv.innerHTML = '';
        loginBtn.disabled = true;
        loginBtn.textContent = 'Carregando...';

        try {
            const matricula = matriculaInput.value.trim();
            const senha = senhaInput.value.trim();

            console.log('SUBMIT: matricula=' + matricula);
            console.log('SUBMIT: senha length=' + senha.length);
            
            console.log('SUBMIT: Chamando authManager.login()');
            const usuario = await authManager.login(matricula, senha);
            console.log('SUBMIT: Login bem-sucedido, usuario=' + JSON.stringify(usuario));
            console.log('SUBMIT: isAutenticado agora=' + authManager.isAutenticado);
            console.log('SUBMIT: localStorage usuario=' + localStorage.getItem('usuario'));
            
            // Aguardar um pouco para garantir que localStorage foi salvo
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Verificar novamente
            console.log('SUBMIT: Apos wait, isAutenticado=' + authManager.isAutenticado);
            console.log('SUBMIT: Apos wait, localStorage=' + localStorage.getItem('usuario'));
            
            console.log('SUBMIT: Redirecionando para /dashboard');
            window.location.hash = '/dashboard';
        } catch (err) {
            console.error('SUBMIT: ERRO -', err.message);
            errorDiv.innerHTML = `
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    ${err.message}
                </div>
            `;
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Entrar';
        }
    });
    
    console.log('ATTACH: Listener anexado com sucesso');
}
