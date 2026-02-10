// Página de Detalhes do Evento
console.log('DetalheEvento.js: iniciando carregamento...');

let eventoDetalhes = null;

pages.detalheEvento = function() {
    console.log('DetalheEvento.js: renderizando página...');
    return `
        <div class="ml-64 bg-gray-50 min-h-screen p-8">
            <div class="max-w-4xl mx-auto">
                
                <!-- Header com botão voltar -->
                <div class="mb-8 flex items-center gap-4">
                    <button onclick="window.location.hash='/dashboard'" class="flex items-center gap-2 text-blue-900 hover:text-blue-800 font-semibold">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Voltar
                    </button>
                </div>

                <!-- Loading Spinner -->
                <div id="loading-spinner" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                    <p class="text-gray-600 mt-4">Carregando evento...</p>
                </div>

                <!-- Conteúdo do Evento -->
                <div id="evento-content" style="display: none;">
                    
                    <!-- Card Principal do Evento -->
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div class="h-3 bg-gradient-to-r from-blue-900 to-blue-600"></div>
                        
                        <div class="p-8">
                            <!-- Título -->
                            <h1 id="evento-nome" class="text-4xl font-bold text-gray-900 mb-4"></h1>
                            
                            <!-- Informações Principais -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
                                
                                <!-- Data -->
                                <div class="flex items-start gap-3">
                                    <svg class="w-6 h-6 text-blue-900 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <div>
                                        <p class="text-sm text-gray-600 font-semibold">Data do Evento</p>
                                        <p id="evento-data" class="text-lg text-gray-900"></p>
                                    </div>
                                </div>

                                <!-- Cursos -->
                                <div class="flex items-start gap-3">
                                    <svg class="w-6 h-6 text-blue-900 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C6.5 6.5 1 10.607 1 15.5 1 19.038 3.5 22 7 22h10c3.5 0 6-2.962 6-6.5 0-4.893-5.5-8.947-11-9.247z"></path>
                                    </svg>
                                    <div>
                                        <p class="text-sm text-gray-600 font-semibold">Cursos</p>
                                        <p id="evento-cursos" class="text-lg text-gray-900"></p>
                                    </div>
                                </div>

                                <!-- Status de Inscrição -->
                                <div class="flex items-start gap-3">
                                    <svg class="w-6 h-6 text-blue-900 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div>
                                        <p class="text-sm text-gray-600 font-semibold">Status</p>
                                        <p id="evento-status" class="text-lg text-gray-900"></p>
                                    </div>
                                </div>
                            </div>

                            <!-- Botão de Inscrição/Desincrição -->
                            <div id="evento-botao" class="mb-8">
                                <!-- Botão será inserido aqui -->
                            </div>
                        </div>
                    </div>

                    <!-- Sessões do Evento -->
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg class="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Sessões
                        </h2>
                        <div id="sessoes-container" class="space-y-6">
                            <!-- Sessões serão inseridas aqui -->
                        </div>
                    </div>
                </div>

                <!-- Mensagem de erro -->
                <div id="error-message" style="display: none;" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <!-- Erro aqui -->
                </div>
            </div>
        </div>
    `;
};

function attachDetalheEventoListeners() {
    console.log('[DETALHE] attachDetalheEventoListeners() chamado');
    carregarDetalheEvento();
}

async function carregarDetalheEvento() {
    try {
        const spinner = document.getElementById('loading-spinner');
        const errorDiv = document.getElementById('error-message');
        const content = document.getElementById('evento-content');

        if (!spinner || !errorDiv || !content) return;

        // Obter ID do evento da URL
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const eventoId = urlParams.get('id');

        console.log('[DETALHE] Carregando evento ID:', eventoId);

        if (!eventoId) {
            throw new Error('ID do evento não especificado');
        }

        // Buscar detalhes do evento
        const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar evento');
        }

        const data = await response.json();
        eventoDetalhes = data.evento;

        console.log('[DETALHE] Evento carregado:', eventoDetalhes);

        // Preencher detalhes do evento
        document.getElementById('evento-nome').textContent = eventoDetalhes.Nome;
        document.getElementById('evento-data').textContent = new Date(eventoDetalhes.Data).toLocaleDateString('pt-BR');
        document.getElementById('evento-cursos').textContent = eventoDetalhes.Cursos || 'Diversos';

        // Verificar status de inscrição
        const usuario = authManager.usuarioAtual;
        const estaInscrito = await verificarInscricao(eventoId);
        
        document.getElementById('evento-status').textContent = estaInscrito ? 'Inscrito' : 'Não inscrito';
        document.getElementById('evento-status').className = estaInscrito 
            ? 'text-lg text-green-600 font-semibold' 
            : 'text-lg text-gray-600';

        // Renderizar botões
        const botaoContainer = document.getElementById('evento-botao');
        let botoesHTML = '';

        // Botão de editar para coordenadores
        const funcaoUsuario = usuario?.funcao?.toLowerCase() || '';
        if (funcaoUsuario === 'coordenador') {
            // mostrar botão editar e deletar (se evento ainda não terminou)
            let podeDeletar = true;
            try {
                const dataFim = eventoDetalhes.data_fim || eventoDetalhes.Data;
                if (dataFim) {
                    const fimTs = new Date(dataFim).getTime();
                    if (Date.now() > fimTs) podeDeletar = false;
                }
            } catch (e) {
                console.warn('Erro ao verificar se pode deletar:', e);
            }

            botoesHTML = `
                <div class="flex gap-3">
                    <button class="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-lg btn-editar-evento" data-evento-id="${eventoId}">
                        Editar Evento
                    </button>
                    ${podeDeletar ? `<button class="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-lg btn-deletar-evento" data-evento-id="${eventoId}">Deletar Evento</button>` : ''}
                </div>
                <div id="botao-inscrever" class="mt-4"></div>
            `;
        } else {
            botoesHTML = '<div id="botao-inscrever"></div>';
        }
        botaoContainer.innerHTML = botoesHTML;

        // Adicionar listener ao botão de editar
        const btnEditar = document.querySelector('.btn-editar-evento');
        if (btnEditar) {
            btnEditar.addEventListener('click', async (e) => {
                e.preventDefault();
                editarEventoDetalhe(eventoId);
            });
        }

        // Botão de deletar
        const btnDeletar = document.querySelector('.btn-deletar-evento');
        if (btnDeletar) {
            btnDeletar.addEventListener('click', async (e) => {
                e.preventDefault();
                if (!confirm('Confirma excluir este evento? Esta ação não pode ser desfeita.')) return;
                try {
                    const resp = await fetch(`${API_BASE_URL}/eventos/${eventoId}/deletar/`, { method: 'DELETE' });
                    const resData = await resp.json();
                    if (!resp.ok) throw new Error(resData.erro || 'Erro ao deletar evento');
                    mostrarNotificacao('Evento deletado com sucesso', 'success');
                    setTimeout(() => { window.location.hash = '/dashboard'; }, 800);
                } catch (err) {
                    console.error('Erro ao deletar evento:', err);
                    mostrarNotificacao(`Erro: ${err.message}`, 'error');
                }
            });
        }

        // Renderizar botão de inscrição/desincrição no container correto
        const botaoInscreverContainer = document.getElementById('botao-inscrever');
        if (estaInscrito) {
            botaoInscreverContainer.innerHTML = `
                <button class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg btn-desinscrever-detalhe" data-evento-id="${eventoId}">
                    Desinscrever
                </button>
            `;
            document.querySelector('.btn-desinscrever-detalhe')?.addEventListener('click', async (e) => {
                e.preventDefault();
                await desinscreverEventoDetalhe(eventoId);
            });
        } else {
            botaoInscreverContainer.innerHTML = `
                <button class="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-semibold text-lg btn-inscrever-detalhe" data-evento-id="${eventoId}">
                    Inscrever
                </button>
            `;
            document.querySelector('.btn-inscrever-detalhe')?.addEventListener('click', async (e) => {
                e.preventDefault();
                await inscreverEventoDetalhe(eventoId);
            });
        }

        // Renderizar sessões
        const sessoesCont = document.getElementById('sessoes-container');
        if (eventoDetalhes.sessoes && eventoDetalhes.sessoes.length > 0) {
            sessoesCont.innerHTML = eventoDetalhes.sessoes.map((sessao, index) => `
                <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-900">
                    <div class="flex items-start gap-4">
                        <div class="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                            ${index + 1}
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-900 mb-2">${sessao.Nome || 'Sessão sem nome'}</h3>
                            
                            <div class="space-y-3 mb-4">
                                <!-- Horário -->
                                <div class="flex items-center gap-3 text-gray-700">
                                    <svg class="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>${sessao.Hora_Inicio || 'Horário'} - ${sessao.Hora_Fim || 'Horário'}</span>
                                </div>

                                <!-- Palestrantes -->
                                <div class="flex items-center gap-3 text-gray-700">
                                    <svg class="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                    <span>${sessao.Palestrantes || 'Palestrante não informado'}</span>
                                </div>
                            </div>

                            <!-- Descrição -->
                            ${sessao.Descricao ? `
                                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                                    <p class="text-gray-700 text-sm"><strong>Descrição:</strong></p>
                                    <p class="text-gray-600 mt-2">${sessao.Descricao}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            sessoesCont.innerHTML = '<p class="text-gray-600 text-center py-8">Nenhuma sessão cadastrada para este evento.</p>';
        }

        // Mostrar conteúdo, esconder spinner
        spinner.style.display = 'none';
        content.style.display = 'block';
        errorDiv.style.display = 'none';

    } catch (error) {
        console.error('[DETALHE] Erro ao carregar:', error);
        const spinner = document.getElementById('loading-spinner');
        const errorDiv = document.getElementById('error-message');
        
        if (spinner) spinner.style.display = 'none';
        if (errorDiv) {
            errorDiv.innerHTML = `<strong>Erro:</strong> ${error.message}`;
            errorDiv.style.display = 'block';
        }
    }
}

async function verificarInscricao(eventoId) {
    const usuario = authManager.usuarioAtual;
    if (!usuario || !usuario.matricula) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${usuario.matricula}/eventos/`, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            return (data.eventos || []).some(e => e.ID === parseInt(eventoId));
        }
        return false;
    } catch (e) {
        console.error('[DETALHE] Erro ao verificar inscrição:', e);
        return false;
    }
}

async function inscreverEventoDetalhe(eventoId) {
    try {
        const usuario = authManager.usuarioAtual;
        if (!usuario || !usuario.matricula) {
            window.location.hash = '/login';
            return;
        }

        console.log('[DETALHE-INSCREVER] Inscrevendo em evento:', eventoId);
        const result = await API.inscreverEvento(parseInt(eventoId), usuario.matricula);

        // Recarregar detalhes
        await carregarDetalheEvento();
        mostrarNotificacao('Inscrito com sucesso!', 'success');

    } catch (error) {
        console.error('[DETALHE-INSCREVER] Erro:', error);
        mostrarNotificacao(`Erro: ${error.message}`, 'error');
    }
}

async function desinscreverEventoDetalhe(eventoId) {
    try {
        const usuario = authManager.usuarioAtual;
        if (!usuario || !usuario.matricula) {
            window.location.hash = '/login';
            return;
        }

        console.log('[DETALHE-DESINSCREVER] Desinscrevendo de evento:', eventoId);
        const result = await API.desinscreverEvento(parseInt(eventoId), usuario.matricula);

        // Mostrar notificação
        mostrarNotificacao('Desinscrito com sucesso!', 'success');
        
        // Recarregar detalhes da página após desinscrever
        await carregarDetalheEvento();

    } catch (error) {
        console.error('[DETALHE-DESINSCREVER] Erro:', error);
        mostrarNotificacao(`Erro: ${error.message}`, 'error');
    }
}

function editarEventoDetalhe(eventoId) {
    // Armazenar os dados do evento no sessionStorage para que a página de criar evento possa recuperar
    sessionStorage.setItem('eventoEmEdicao', JSON.stringify({
        id: eventoId,
        nome: eventoDetalhes.Nome,
        data: eventoDetalhes.Data,
        cursos: eventoDetalhes.Cursos,
        descricao: eventoDetalhes['Descrição'] || '',
        sessoes: (eventoDetalhes.sessoes || []).map(s => ({
            titulo: s.Nome,
            palestrante: s.Palestrantes,
            horarioInicio: s.Hora_Inicio,
            horarioFim: s.Hora_Fim,
            descricao: s.Descricao
        }))
    }));

    mostrarNotificacao('Redirecionando para edição...', 'info');
    setTimeout(() => {
        window.location.hash = '/criar-evento';
    }, 800);
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

    const cores = {
        'success': { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
        'error': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
        'aviso': { bg: '#fef08a', text: '#713f12', border: '#fde047' },
        'info': { bg: '#dbeafe', text: '#0c2d6b', border: '#93c5fd' }
    };

    const cor = cores[tipo] || cores['info'];
    notificacao.style.backgroundColor = cor.bg;
    notificacao.style.color = cor.text;
    notificacao.style.border = `2px solid ${cor.border}`;
    notificacao.textContent = mensagem;

    // Adicionar estilos de animação se não existirem
    if (!document.querySelector('style[data-notificacao]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notificacao', 'true');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notificacao);

    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

console.log('DetalheEvento.js carregado com sucesso!');
