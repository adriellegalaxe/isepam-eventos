// Página Dashboard
let eventosCarregados = [];
let eventosInscritosIds = new Set();
let dashboardCarregando = false;  // Flag para evitar múltiplas cargas

pages.dashboard = function() {

    return `
        <div class="ml-64 bg-gray-50 min-h-screen p-8">
            <div class="max-w-7xl mx-auto">
                
                <!-- Header -->
                <div class="mb-8 animate-fade-in">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p class="text-gray-600">Bem-vindo ao Gerenciamento de Eventos ISEPAM</p>
                </div>

                <!-- Loading Spinner -->
                <div id="loading-spinner" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                    <p class="text-gray-600 mt-4">Carregando eventos...</p>
                </div>

                <!-- Seção Eventos -->
                <section id="eventos-section" style="display: none;">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg class="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Eventos Disponíveis
                    </h2>
                    <div id="eventos-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Eventos carregados aqui -->
                    </div>
                </section>

                <!-- Mensagem de erro -->
                <div id="error-message" style="display: none;" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <!-- Erro aqui -->
                </div>
            </div>
        </div>
    `;
};

// Função de listeners para o dashboard
function attachDashboardListeners() {
    console.log('[DASHBOARD] attachDashboardListeners() chamado');
    
    // Carregar eventos quando a página é acessada
    // NÃO usar await aqui pois já é chamada de forma assíncrona
    carregarEventosDashboard();
}

// Anexar listeners apenas aos botões (sem recarregar tudo)
function attachDashboardButtonListeners() {
    console.log('[DASHBOARD] Anexando listeners aos botões...');

    // Anexar listeners aos cards para abrir detalhes
    const cards = document.querySelectorAll('[data-evento-id]');
    console.log('[DASHBOARD] Encontrados', cards.length, 'cards de evento');
    
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Não abrir detalhes se clicou no botão
            if (e.target.closest('.btn-inscrever, .btn-desinscrever')) {
                return;
            }
            
            const eventoId = card.getAttribute('data-evento-id');
            console.log('[DASHBOARD] Card clicado - evento ID:', eventoId);
            window.location.hash = `/detalhe-evento?id=${eventoId}`;
        });
    });

    // Anexar listeners aos botões de inscrição
    const botoesInscrever = document.querySelectorAll('.btn-inscrever');
    console.log('[DASHBOARD] Encontrados', botoesInscrever.length, 'botões de inscrição');
    
    botoesInscrever.forEach(botao => {
        botao.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const eventoId = botao.getAttribute('data-evento-id');
            console.log('[DASHBOARD] Botão clicado - evento ID:', eventoId);
            await inscreverEvento(parseInt(eventoId));
        });
    });

    // Anexar listeners aos botões de desincrição
    const botoesDesinscrever = document.querySelectorAll('.btn-desinscrever');
    console.log('[DASHBOARD] Encontrados', botoesDesinscrever.length, 'botões de desincrição');
    
    botoesDesinscrever.forEach(botao => {
        botao.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const eventoId = botao.getAttribute('data-evento-id');
            console.log('[DASHBOARD] Botão desinscrever clicado - evento ID:', eventoId);
            await desinscreverEvento(parseInt(eventoId));
        });
    });
}

async function carregarEventosDashboard() {
    // Evitar múltiplas cargas simultâneas
    if (dashboardCarregando) {
        console.log('[DASHBOARD] carregarEventosDashboard() já está em progresso, ignorando chamada duplicada');
        return;
    }
    
    dashboardCarregando = true;
    console.log('[DASHBOARD] carregarEventosDashboard() iniciado');
    
    try {
        const spinner = document.getElementById('loading-spinner');
        const errorDiv = document.getElementById('error-message');
        const section = document.getElementById('eventos-section');
        const grid = document.getElementById('eventos-grid');

        if (!spinner || !errorDiv || !section || !grid) return;

        // Carregar eventos da API
        const response = await fetch(`${API_BASE_URL}/eventos/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar eventos');
        }

        const data = await response.json();
        eventosCarregados = data.eventos || [];

        // Carregar eventos inscritos do usuário
        const usuario = authManager.usuarioAtual;
        console.log('[DASHBOARD] Usuário autenticado:', usuario);
        
        if (usuario && usuario.matricula) {
            try {
                console.log('[DASHBOARD] Carregando eventos inscritos para matrícula:', usuario.matricula);
                
                const meusEventosResponse = await fetch(
                    `${API_BASE_URL}/usuarios/${usuario.matricula}/eventos/`,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                
                console.log('[DASHBOARD] Response status:', meusEventosResponse.status);
                console.log('[DASHBOARD] Response OK:', meusEventosResponse.ok);
                
                if (meusEventosResponse.ok) {
                    const meusEventos = await meusEventosResponse.json();
                    console.log('[DASHBOARD] Resposta completa:', meusEventos);
                    console.log('[DASHBOARD] Eventos retornados:', meusEventos.eventos);
                    
                    eventosInscritosIds = new Set(
                        (meusEventos.eventos || []).map(e => {
                            console.log('[DASHBOARD] Evento inscrito ID:', e.ID);
                            return e.ID;
                        })
                    );
                    console.log('[DASHBOARD] Eventos inscritos Set:', Array.from(eventosInscritosIds));
                } else {
                    const errorData = await meusEventosResponse.text();
                    console.error('[DASHBOARD] Erro ao carregar inscrições, status:', meusEventosResponse.status);
                    console.error('[DASHBOARD] Erro response body:', errorData);
                }
            } catch (e) {
                console.error('[DASHBOARD] Exceção ao carregar inscrições:', e);
            }
        } else {
            console.log('[DASHBOARD] Usuário não autenticado. usuario:', usuario, 'matricula:', usuario?.matricula);
        }

        // Renderizar eventos
        grid.innerHTML = eventosCarregados
            .map(evento => criarCartaoEvento(evento))
            .join('');

        // Anexar listeners de inscrição
        attachDashboardButtonListeners();

        // Mostrar conteúdo, esconder spinner
        spinner.style.display = 'none';
        section.style.display = 'block';
        errorDiv.style.display = 'none';

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        const spinner = document.getElementById('loading-spinner');
        const errorDiv = document.getElementById('error-message');
        
        if (spinner) spinner.style.display = 'none';
        if (errorDiv) {
            errorDiv.innerHTML = `<strong>Erro:</strong> ${error.message}`;
            errorDiv.style.display = 'block';
        }
    } finally {
        // Sempre resetar a flag
        dashboardCarregando = false;
        console.log('[DASHBOARD] carregarEventosDashboard() finalizado');
    }
}

async function inscreverEvento(eventoId) {
    try {
        const usuario = authManager.usuarioAtual;
        console.log('[INSCREVER] ========== INÍCIO INSCRIÇÃO ==========');
        console.log('[INSCREVER] Usuário:', usuario);
        console.log('[INSCREVER] Evento ID:', eventoId);
        
        if (!usuario || !usuario.matricula) {
            console.error('[INSCREVER] Usuário não autenticado');
            window.location.hash = '/login';
            return;
        }

        console.log('[INSCREVER] Inscrevendo usuario', usuario.matricula, 'no evento', eventoId);
        console.log('[INSCREVER] Chamando API com eventoId:', parseInt(eventoId), 'matricula:', usuario.matricula);
        
        // Fazer a requisição de inscrição
        const result = await API.inscreverEvento(parseInt(eventoId), usuario.matricula);
        
        console.log('[INSCREVER] Resposta completa da API:', JSON.stringify(result));
        console.log('[INSCREVER] Inscrição realizada com sucesso!');
        
        // Recarregar eventos inscritos do servidor para sincronizar
        console.log('[INSCREVER] Recarregando eventos inscritos do servidor...');
        try {
            const meusEventosResponse = await fetch(
                `${API_BASE_URL}/usuarios/${usuario.matricula}/eventos/`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            console.log('[INSCREVER] Response status:', meusEventosResponse.status);
            
            if (meusEventosResponse.ok) {
                const meusEventos = await meusEventosResponse.json();
                console.log('[INSCREVER] Eventos inscritos resposta:', meusEventos);
                
                eventosInscritosIds = new Set(
                    (meusEventos.eventos || []).map(e => e.ID)
                );
                console.log('[INSCREVER] Eventos inscritos atualizados:', Array.from(eventosInscritosIds));
            } else {
                const errorData = await meusEventosResponse.text();
                console.error('[INSCREVER] Erro ao recarregar inscrições:', meusEventosResponse.status, errorData);
            }
        } catch (e) {
            console.error('[INSCREVER] Erro ao recarregar inscrições:', e);
        }
        
        // Re-renderizar os cards dos eventos
        const grid = document.getElementById('eventos-grid');
        if (grid) {
            grid.innerHTML = eventosCarregados
                .map(evento => criarCartaoEvento(evento))
                .join('');
            // Apenas anexar listeners aos botões, não recarregar tudo
            attachDashboardButtonListeners();
        }
        
        // Mostrar notificação de sucesso
        mostrarNotificacao('Inscrito com sucesso!', 'success');

    } catch (error) {
        console.error('[INSCREVER] Erro:', error);
        mostrarNotificacao(`Erro: ${error.message}`, 'error');
    }
}

async function desinscreverEvento(eventoId) {
    try {
        const usuario = authManager.usuarioAtual;
        console.log('[DESINSCREVER] ========== INÍCIO DESINCRIÇÃO ==========');
        console.log('[DESINSCREVER] Usuário:', usuario);
        console.log('[DESINSCREVER] Evento ID:', eventoId);
        
        if (!usuario || !usuario.matricula) {
            console.error('[DESINSCREVER] Usuário não autenticado');
            window.location.hash = '/login';
            return;
        }

        console.log('[DESINSCREVER] Desinscrevendo usuario', usuario.matricula, 'do evento', eventoId);
        
        // Fazer a requisição de desincrição
        const result = await API.desinscreverEvento(eventoId, usuario.matricula);
        
        console.log('[DESINSCREVER] Resposta completa da API:', JSON.stringify(result));
        console.log('[DESINSCREVER] Desincrição realizada com sucesso!');
        
        // Recarregar eventos inscritos do servidor para sincronizar
        console.log('[DESINSCREVER] Recarregando eventos inscritos do servidor...');
        try {
            const meusEventosResponse = await fetch(
                `${API_BASE_URL}/usuarios/${usuario.matricula}/eventos/`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            console.log('[DESINSCREVER] Response status:', meusEventosResponse.status);
            
            if (meusEventosResponse.ok) {
                const meusEventos = await meusEventosResponse.json();
                console.log('[DESINSCREVER] Eventos inscritos resposta:', meusEventos);
                
                eventosInscritosIds = new Set(
                    (meusEventos.eventos || []).map(e => e.ID)
                );
                console.log('[DESINSCREVER] Eventos inscritos atualizados:', Array.from(eventosInscritosIds));
            } else {
                const errorData = await meusEventosResponse.text();
                console.error('[DESINSCREVER] Erro ao recarregar inscrições:', meusEventosResponse.status, errorData);
            }
        } catch (e) {
            console.error('[DESINSCREVER] Erro ao recarregar inscrições:', e);
        }
        
        // Re-renderizar os cards dos eventos
        const grid = document.getElementById('eventos-grid');
        if (grid) {
            grid.innerHTML = eventosCarregados
                .map(evento => criarCartaoEvento(evento))
                .join('');
            // Apenas anexar listeners aos botões, não recarregar tudo
            attachDashboardButtonListeners();
        }
        
        // Mostrar notificação de sucesso
        mostrarNotificacao('Desinscrito com sucesso!', 'success');

    } catch (error) {
        console.error('[DESINSCREVER] Erro:', error);
        mostrarNotificacao(`Erro: ${error.message}`, 'error');
    }
}

// Função para mostrar notificações discretas
function mostrarNotificacao(mensagem, tipo = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'notification-container';
        newContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(newContainer);
    }
    
    const notif = document.createElement('div');
    const bgColor = tipo === 'success' ? 'bg-green-500' : tipo === 'error' ? 'bg-red-500' : 'bg-blue-500';
    notif.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in`;
    notif.textContent = mensagem;
    
    document.getElementById('notification-container').appendChild(notif);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

function criarCartaoEvento(evento) {
    const corGradiente = 'from-blue-900 to-blue-600';
    const estaInscrito = eventosInscritosIds.has(evento.ID);
    
    return `
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition overflow-hidden border border-gray-200" data-evento-id="${evento.ID}">
            <div class="h-2 bg-gradient-to-r ${corGradiente}"></div>
            
            <div class="p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">${evento.Nome}</h3>
                <p class="text-gray-600 text-sm mb-4">Cursos: ${evento.Cursos || 'Diversos'}</p>
                
                <!-- Informações -->
                <div class="space-y-2 text-sm text-gray-600 mb-4">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>${new Date(evento.Data).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>

                <!-- Botão -->
                ${!estaInscrito ? `
                    <button class="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-semibold btn-inscrever" data-evento-id="${evento.ID}">
                        Inscrever-se
                    </button>
                ` : `
                    <button class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold btn-desinscrever" data-evento-id="${evento.ID}">
                        ✓ Inscrito
                    </button>
                `}
            </div>
        </div>
    `;
}
