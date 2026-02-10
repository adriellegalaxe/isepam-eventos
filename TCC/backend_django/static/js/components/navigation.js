// Componente Navigation
class Navigation {
    static render() {
        const usuario = authManager.usuarioAtual;
        
        if (!usuario) {
            return '';
        }

        // Backend retorna 'funcao', não 'tipo'
        const funcaoUsuario = usuario.funcao || usuario.tipo || '';
        const ehCoordenador = funcaoUsuario.toLowerCase() === 'coordenador';
        const tipoExibicao = ehCoordenador ? 'Coordenador' : 'Aluno';

        return `
            <nav class="bg-gradient-to-r from-blue-900 to-purple-900 text-white h-screen w-64 flex flex-col p-6 fixed left-0 top-0 z-50">
                <!-- Logo/Título -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold">ISEPAM</h1>
                    <p class="text-xs text-blue-200 mt-1">Eventos Acadêmicos</p>
                    <p class="text-sm text-gray-300 mt-4">
                        ${tipoExibicao}
                    </p>
                </div>

                <!-- Menu -->
                <nav class="flex-1 space-y-3">
                    <a href="#/dashboard" class="nav-link flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition font-medium text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m-4 4l-4-4m4 4V5m4 0h.01"></path>
                        </svg>
                        Início
                    </a>

                    ${ehCoordenador ? `
                        <a href="#/criar-evento" class="nav-link flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition font-medium text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Criar Evento
                        </a>
                    ` : ''}

                    <a href="#/certificados" class="nav-link flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition font-medium text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Certificados
                    </a>

                    ${ ehCoordenador ? `
                        <a href="#/qr-code" class="nav-link flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition font-medium text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            QR Code
                        </a>
                    ` : '' }
                </nav>

                <!-- Logout -->
                <button id="logout-btn" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition font-medium text-white w-full justify-start">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Sair
                </button>
            </nav>
        `;
    }

    static attachListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authManager.logout();
                window.location.hash = '/login';
            });
        }

        // Atualizar link ativo
        const currentPage = window.location.hash.slice(1) || '/';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').slice(1);
            if (currentPage.startsWith(href)) {
                link.classList.add('bg-blue-800');
            }
        });
    }
}
