// Página Cadastro
pages.cadastro = function() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center p-4 py-8">
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 animate-fade-in">
                <!-- Logo -->
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-blue-900 mb-2">ISEPAM</h1>
                    <p class="text-gray-600">Cadastro de Usuário</p>
                </div>

                <!-- Abas de Tipo -->
                <div class="flex gap-4 mb-8 border-b border-gray-200">
                    <button class="tipo-tab pb-3 font-semibold transition text-blue-900 border-b-2 border-blue-900" data-tipo="aluno">
                        Aluno
                    </button>
                    <button class="tipo-tab pb-3 font-semibold transition text-gray-600 hover:text-gray-900" data-tipo="professor">
                        Professor
                    </button>
                    <button class="tipo-tab pb-3 font-semibold transition text-gray-600 hover:text-gray-900" data-tipo="coordenador">
                        Coordenador
                    </button>
                </div>

                <!-- Formulário -->
                <form id="cadastro-form" class="space-y-4">
                    <div id="cadastro-error-message"></div>

                    <!-- Grid de campos -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Nome Completo -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                name="nome"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                required
                            />
                        </div>

                        <!-- Matrícula -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Matrícula
                            </label>
                            <input
                                type="text"
                                name="matricula"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                required
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                required
                            />
                        </div>

                        <!-- CPF -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                CPF
                            </label>
                            <div class="relative">
                                <input
                                    type="text"
                                    name="cpf"
                                    id="cpf-input"
                                    placeholder="000.000.000-00"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                    required
                                />
                                <div id="cpf-warning" class="absolute right-3 top-2 text-yellow-600 hidden"></div>
                            </div>
                            <p id="cpf-error" class="text-xs text-yellow-600 mt-1 hidden flex items-center gap-1">
                                CPF pode estar inválido
                            </p>
                        </div>

                        <!-- Senha -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                name="senha"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                required
                            />
                        </div>

                        <!-- Confirmar Senha -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                name="confirmarSenha"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                required
                            />
                        </div>

                        <!-- Curso (apenas para alunos) -->
                        <div id="curso-container">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Curso
                            </label>
                            <select
                                name="curso"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                            >
                                <option value="informatica">Técnico em Informática</option>
                                <option value="pedagogia">Pedagogia</option>
                                <option value="ambos">Ambos</option>
                            </select>
                        </div>
                    </div>

                    <!-- Botão Cadastrar -->
                    <button
                        type="submit"
                        id="cadastro-btn"
                        class="w-full py-3 mt-6 bg-gradient-to-r from-blue-900 to-purple-900 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                    >
                        Cadastrar
                    </button>
                </form>

                <!-- Link Login -->
                <div class="text-center mt-6 pt-6 border-t border-gray-200">
                    <p class="text-gray-600 mb-3">Já tem conta?</p>
                    <a href="#/login" class="text-blue-900 font-semibold hover:text-purple-900 transition">
                        Faça login aqui
                    </a>
                </div>
            </div>
        </div>
    `;
};

function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11;
}

function attachCadastroListeners() {
    const form = document.getElementById('cadastro-form');
    const tipoTabs = document.querySelectorAll('.tipo-tab');
    const cpfInput = document.getElementById('cpf-input');
    const cpfWarning = document.getElementById('cpf-warning');
    const cpfError = document.getElementById('cpf-error');
    const cursoContainer = document.getElementById('curso-container');
    const cadastroBtn = document.getElementById('cadastro-btn');
    const errorDiv = document.getElementById('cadastro-error-message');

    let tipoSelecionado = 'aluno';

    if (!form) return;

    // Gerenciar abas de tipo
    tipoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tipoSelecionado = tab.dataset.tipo;
            
            tipoTabs.forEach(t => {
                if (t.dataset.tipo === tipoSelecionado) {
                    t.classList.add('text-blue-900', 'border-b-2', 'border-blue-900');
                    t.classList.remove('text-gray-600', 'hover:text-gray-900');
                } else {
                    t.classList.remove('text-blue-900', 'border-b-2', 'border-blue-900');
                    t.classList.add('text-gray-600', 'hover:text-gray-900');
                }
            });

            // Mostrar/ocultar campo de curso
            if (tipoSelecionado === 'aluno') {
                cursoContainer.style.display = 'block';
            } else {
                cursoContainer.style.display = 'none';
            }
        });
    });

    // Validação de CPF
    if (cpfInput) {
        cpfInput.addEventListener('change', (e) => {
            if (!validarCPF(e.target.value)) {
                cpfWarning.classList.remove('hidden');
                cpfError.classList.remove('hidden');
            } else {
                cpfWarning.classList.add('hidden');
                cpfError.classList.add('hidden');
            }
        });
    }

    // Submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.innerHTML = '';
        cadastroBtn.disabled = true;
        cadastroBtn.textContent = 'Carregando...';

        try {
            const formData = new FormData(form);
            const dados = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                matricula: formData.get('matricula'),
                cpf: formData.get('cpf'),
                senha: formData.get('senha'),
                confirmarSenha: formData.get('confirmarSenha'),
                tipo: tipoSelecionado,
                curso: tipoSelecionado === 'aluno' ? formData.get('curso') : undefined,
            };

            await authManager.cadastro(dados);
            window.location.hash = '/dashboard';
        } catch (err) {
            errorDiv.innerHTML = `
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    ${err.message}
                </div>
            `;
        } finally {
            cadastroBtn.disabled = false;
            cadastroBtn.textContent = 'Cadastrar';
        }
    });
}
