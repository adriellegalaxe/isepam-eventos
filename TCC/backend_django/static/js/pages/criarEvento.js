// Página CriarEvento
pages.criarEvento = function() {
    return `
        <style>
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
        </style>
        <div class="ml-64 bg-gray-50 min-h-screen p-8">
            <div class="max-w-4xl mx-auto">
                
                <!-- Header -->
                <div class="mb-8 animate-fade-in">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">Criar Novo Evento</h1>
                    <p class="text-gray-600">Preenchha os dados para criar um novo evento acadêmico</p>
                </div>

                <!-- Formulário -->
                <div class="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    
                    <!-- Nome do Evento -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Nome do Evento *
                        </label>
                        <input
                            type="text"
                            id="nomeEvento"
                            placeholder="Ex: Semana de Tecnologia e Inovação"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                        />
                    </div>

                    <!-- Data e Hora do Evento -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Data/Hora Início *
                            </label>
                            <input
                                type="datetime-local"
                                id="dataEvento"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                Data/Hora Fim *
                            </label>
                            <input
                                type="datetime-local"
                                id="dataFimEvento"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                            />
                        </div>
                    </div>

                    <!-- Descrição -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Descrição
                        </label>
                        <textarea
                            id="descricao"
                            placeholder="Descrição detalhada do evento..."
                            rows="4"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                        ></textarea>
                    </div>

                    <!-- Cursos -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-3">
                            Cursos Direcionados *
                        </label>
                        <div class="space-y-2">
                            <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 transition hover:border-blue-900" data-curso="informatica">
                                <input
                                    type="checkbox"
                                    value="informatica"
                                    class="curso-checkbox w-5 h-5 rounded accent-blue-900 cursor-pointer"
                                />
                                <span class="font-medium text-gray-700">
                                    Técnico em Informática
                                </span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 transition hover:border-blue-900" data-curso="pedagogia">
                                <input
                                    type="checkbox"
                                    value="pedagogia"
                                    class="curso-checkbox w-5 h-5 rounded accent-blue-900 cursor-pointer"
                                />
                                <span class="font-medium text-gray-700">
                                    Pedagogia
                                </span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 transition hover:border-blue-900" data-curso="ambos">
                                <input
                                    type="checkbox"
                                    value="ambos"
                                    class="curso-checkbox w-5 h-5 rounded accent-blue-900 cursor-pointer"
                                />
                                <span class="font-medium text-gray-700">
                                    Ambos
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Divisor -->
                    <hr class="my-8" />

                    <!-- Sessões -->
                    <div>
                        <h2 class="text-xl font-bold text-gray-900 mb-4">Sessões do Evento</h2>
                        
                        <!-- Adicionar Sessão -->
                        <div class="bg-gray-50 rounded-lg p-6 mb-6 space-y-4 border border-gray-200">
                            <h3 class="font-semibold text-gray-800">Adicionar Sessão</h3>
                            
                            <div class="grid grid-cols-1 gap-4 w-full">
                                <input
                                    type="text"
                                    id="novoTituloSessao"
                                    placeholder="Título da sessão"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                />
                                <input
                                    type="text"
                                    id="novoPalestrante"
                                    placeholder="Palestrante (opcional)"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                />
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                                    <input
                                        type="datetime-local"
                                        id="novoHorarioInicio"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-sm"
                                    />
                                    <input
                                        type="datetime-local"
                                        id="novoHorarioFim"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-sm"
                                    />
                                </div>
                                <textarea
                                    id="novaDescricaoSessao"
                                    placeholder="Descrição da sessão (opcional)"
                                    rows="2"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                id="adicionarSessaoBtn"
                                class="w-full py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-semibold flex items-center justify-center gap-2"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Adicionar Sessão
                            </button>
                        </div>

                        <!-- Lista de Sessões -->
                        <div id="sessoesList" class="space-y-3"></div>
                    </div>

                    <!-- Botões -->
                    <div class="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            id="criarEventoBtn"
                            class="flex-1 py-3 bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-lg hover:opacity-90 transition font-semibold"
                        >
                            Criar Evento
                        </button>
                        <button
                            type="button"
                            id="cancelarBtn"
                            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

function attachCriarEventoListeners() {
    const nomeEvento = document.getElementById('nomeEvento');
    const dataEvento = document.getElementById('dataEvento');
    const dataFimEvento = document.getElementById('dataFimEvento');
    const descricao = document.getElementById('descricao');
    const sessoesCheckboxes = document.querySelectorAll('.curso-checkbox');
    const novoTituloSessao = document.getElementById('novoTituloSessao');
    const novoPalestrante = document.getElementById('novoPalestrante');
    const novoHorarioInicio = document.getElementById('novoHorarioInicio');
    const novoHorarioFim = document.getElementById('novoHorarioFim');
    const novaDescricaoSessao = document.getElementById('novaDescricaoSessao');
    const adicionarSessaoBtn = document.getElementById('adicionarSessaoBtn');
    const sessoesList = document.getElementById('sessoesList');
    const criarEventoBtn = document.getElementById('criarEventoBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');

    let sessoes = [];
    let cursosSelecionados = [];
    let eventoEmEdicaoId = null;
    let editingSessionId = null;

    // Verificar se há um evento em edição no sessionStorage
    const eventoEmEdicaoJson = sessionStorage.getItem('eventoEmEdicao');
    if (eventoEmEdicaoJson) {
        try {
            const eventoEmEdicao = JSON.parse(eventoEmEdicaoJson);
            eventoEmEdicaoId = eventoEmEdicao.id;
            console.log('[CRIAR-EVENTO] Carregando evento para edição, ID:', eventoEmEdicaoId);
            
            // Preencher os campos do formulário
            nomeEvento.value = eventoEmEdicao.nome || '';
            dataEvento.value = eventoEmEdicao.data || '';
            dataFimEvento.value = eventoEmEdicao.data_fim || eventoEmEdicao.dataFim || '';
            descricao.value = eventoEmEdicao.descricao || '';
            
            console.log('[CRIAR-EVENTO] Nome preenchido:', nomeEvento.value);
            
            // Carregar cursos selecionados
            const cursosList = (eventoEmEdicao.cursos || '').split(',').map(c => c.trim()).filter(c => c);
            sessoesCheckboxes.forEach(checkbox => {
                if (cursosList.includes(checkbox.value)) {
                    checkbox.checked = true;
                    const label = checkbox.closest('label');
                    label.classList.add('border-blue-900', 'bg-blue-50');
                    cursosSelecionados.push(checkbox.value);
                }
            });
            
            // Carregar sessões
            if (eventoEmEdicao.sessoes && eventoEmEdicao.sessoes.length > 0) {
                sessoes = eventoEmEdicao.sessoes.map(s => ({
                    id: Math.random().toString(36).substr(2, 9),
                    titulo: s.titulo || s.Nome,
                    palestrante: s.palestrante || s.Palestrantes,
                    horarioInicio: s.horarioInicio || s.Hora_Inicio,
                    horarioFim: s.horarioFim || s.Hora_Fim,
                    descricao: s.descricao || s.Descricao
                }));
                renderizarSessoes();
            }
            
            // Mudar texto do botão
            criarEventoBtn.textContent = 'Atualizar Evento';
            mostrarNotificacao('Evento carregado para edição', 'info');
            
            // Limpar sessionStorage
            sessionStorage.removeItem('eventoEmEdicao');
        } catch (e) {
            console.error('Erro ao carregar evento em edição:', e);
            mostrarNotificacao('Erro ao carregar evento para edição', 'erro');
        }
    }

    // Gerenciar seleção de cursos
    sessoesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const label = e.target.closest('label');
            const curso = e.target.value;
            
            if (e.target.checked) {
                cursosSelecionados.push(curso);
                label.classList.add('border-blue-900', 'bg-blue-50');
            } else {
                cursosSelecionados = cursosSelecionados.filter(c => c !== curso);
                label.classList.remove('border-blue-900', 'bg-blue-50');
            }
        });
    });

    // Adicionar ou salvar sessão
    adicionarSessaoBtn.addEventListener('click', () => {
        const titulo = novoTituloSessao.value.trim();
        const inicio = novoHorarioInicio.value;
        const fim = novoHorarioFim.value;

        // Requer título e horários para sessões
        if (!titulo) {
            mostrarNotificacao('Por favor, digite um título para a sessão', 'aviso');
            return;
        }
        if (!inicio || !fim) {
            mostrarNotificacao('Por favor, informe data/hora de início e fim da sessão', 'aviso');
            return;
        }

        // Impedir adicionar sessão se datas do evento não estiverem preenchidas
        if (!dataEvento.value || !dataFimEvento.value) {
            mostrarNotificacao('Por favor, defina Data/Hora Início e Fim do evento antes de adicionar sessões', 'aviso');
            return;
        }

        const eventoInicio = new Date(dataEvento.value).getTime();
        const eventoFim = new Date(dataFimEvento.value).getTime();
        const sessInicio = new Date(inicio).getTime();
        const sessFim = new Date(fim).getTime();

        if (sessInicio < eventoInicio || sessFim > eventoFim) {
            mostrarNotificacao('Horário da sessão deve estar entre início e fim do evento', 'aviso');
            return;
        }
        if (sessFim <= sessInicio) {
            mostrarNotificacao('Hora de fim da sessão deve ser depois da hora de início', 'aviso');
            return;
        }

        if (editingSessionId) {
            // Atualizar sessão existente
            const idx = sessoes.findIndex(s => s.id === editingSessionId);
            if (idx !== -1) {
                sessoes[idx].titulo = titulo;
                sessoes[idx].palestrante = novoPalestrante.value.trim() || null;
                sessoes[idx].horarioInicio = inicio;
                sessoes[idx].horarioFim = fim;
                sessoes[idx].descricao = novaDescricaoSessao.value.trim() || null;

                // Se houver outra sessão com mesmo título (case-insensitive), remover essa duplicata
                const tituloLower = titulo.toLowerCase();
                sessoes = sessoes.filter(s => !(s.titulo && s.titulo.trim().toLowerCase() === tituloLower && s.id !== sessoes[idx].id));

                mostrarNotificacao('Sessão atualizada com sucesso', 'sucesso');
            }
            editingSessionId = null;
            adicionarSessaoBtn.textContent = 'Adicionar Sessão';
        } else {
            // Criar nova sessão (ou substituir existente com mesmo título)
            const sessao = {
                id: Math.random().toString(36).substr(2, 9),
                titulo: titulo,
                palestrante: novoPalestrante.value.trim() || null,
                horarioInicio: inicio,
                horarioFim: fim,
                descricao: novaDescricaoSessao.value.trim() || null,
                editando: false
            };

            const existingIndex = sessoes.findIndex(s => s.titulo && s.titulo.trim().toLowerCase() === titulo.toLowerCase());
            if (existingIndex !== -1) {
                // Preservar id da sessão existente ao substituir
                sessao.id = sessoes[existingIndex].id;
                sessoes[existingIndex] = sessao;
                mostrarNotificacao('Sessão existente substituída com sucesso', 'sucesso');
            } else {
                sessoes.push(sessao);
                mostrarNotificacao('Sessão adicionada com sucesso', 'sucesso');
            }
        }

        // Limpar formulário
        novoTituloSessao.value = '';
        novoPalestrante.value = '';
        novoHorarioInicio.value = '';
        novoHorarioFim.value = '';
        novaDescricaoSessao.value = '';

        renderizarSessoes();
    });

    function renderizarSessoes() {
        sessoesList.innerHTML = sessoes.map(sessao => `
            <div class="border-l-4 border-blue-900 bg-white p-4 rounded-lg shadow">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1 cursor-pointer hover:bg-gray-50 p-2 rounded flex-1" data-sessao-id="${sessao.id}">
                        <h4 class="font-semibold text-gray-900">${sessao.titulo || 'Sessão sem título'}</h4>
                        ${sessao.palestrante ? `
                            <p class="text-sm text-gray-600">
                                Palestrante: ${sessao.palestrante}
                            </p>
                        ` : ''}
                        ${sessao.horarioInicio ? `
                            <p class="text-sm text-gray-600 whitespace-normal break-words">
                                ${new Date(sessao.horarioInicio).toLocaleString('pt-BR')} - ${new Date(sessao.horarioFim).toLocaleString('pt-BR')}
                            </p>
                        ` : ''}
                        ${sessao.descricao ? `
                            <p class="text-sm text-gray-500 mt-2">${sessao.descricao}</p>
                        ` : ''}
                        
                    </div>
                    <button
                        type="button"
                        class="text-red-600 hover:text-red-800 transition ml-4 flex-shrink-0 remover-sessao"
                        data-id="${sessao.id}"
                        title="Deletar sessão"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Adicionar listeners aos botões de remover
        document.querySelectorAll('.remover-sessao').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                sessoes = sessoes.filter(s => s.id !== id);
                renderizarSessoes();
                mostrarNotificacao('Sessão removida', 'info');
            });
        });

        // Adicionar listeners para editar sessão ao clicar
        document.querySelectorAll('[data-sessao-id]').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-sessao-id');
                const sessao = sessoes.find(s => s.id === id);
                if (sessao) {
                    editarSessao(sessao);
                }
            });
        });
    }

    function editarSessao(sessao) {
        novoTituloSessao.value = sessao.titulo;
        novoPalestrante.value = sessao.palestrante || '';
        novoHorarioInicio.value = sessao.horarioInicio || '';
        novoHorarioFim.value = sessao.horarioFim || '';
        novaDescricaoSessao.value = sessao.descricao || '';

        // Marcar sessão em edição para que ao salvar atualize ao invés de criar nova
        editingSessionId = sessao.id;
        adicionarSessaoBtn.textContent = 'Salvar Sessão';
        mostrarNotificacao('Editando sessão - altere os campos e clique em "Salvar Sessão"', 'info');
    }

    // Criar evento
    criarEventoBtn.addEventListener('click', async () => {
        console.log('[CRIAR-EVENTO] Click no botão. Nome:', nomeEvento.value, 'eventoEmEdicaoId:', eventoEmEdicaoId);
        
        if (!nomeEvento.value.trim()) {
            console.warn('[CRIAR-EVENTO] Validação falhou: Nome vazio');
            mostrarNotificacao('Por favor, digite o nome do evento', 'aviso');
            return;
        }


        if (!dataEvento.value) {
            console.warn('[CRIAR-EVENTO] Validação falhou: Data vazia');
            mostrarNotificacao('Por favor, selecione a data de início do evento', 'aviso');
            return;
        }

        if (!dataFimEvento.value) {
            console.warn('[CRIAR-EVENTO] Validação falhou: Data fim vazia');
            mostrarNotificacao('Por favor, selecione a data de fim do evento', 'aviso');
            return;
        }
        if (cursosSelecionados.length === 0) {
            console.warn('[CRIAR-EVENTO] Validação falhou: Cursos não selecionados');
            mostrarNotificacao('Por favor, selecione pelo menos um curso', 'aviso');
            return;
        }

        if (sessoes.length === 0) {
            console.warn('[CRIAR-EVENTO] Validação falhou: Sessões vazias');
            mostrarNotificacao('Por favor, adicione pelo menos uma sessão ao evento', 'aviso');
            return;
        }

        // Validar que todas as sessões têm horário de início e fim
        const sessoesInvalidas = sessoes.filter(s => !s.horarioInicio || !s.horarioFim);
        if (sessoesInvalidas.length > 0) {
            console.warn('[CRIAR-EVENTO] Validação falhou: Sessões com horários inválidos', sessoesInvalidas);
            mostrarNotificacao('Todas as sessões devem ter horário de INÍCIO e FIM! Clique na sessão para editar.', 'aviso');
            return;
        }

        // Validar datas do evento (não permitir no passado; fim > início)
        const agoraTs = Date.now();
        const eventoInicioTs = new Date(dataEvento.value).getTime();
        const eventoFimTs = new Date(dataFimEvento.value).getTime();
        if (isNaN(eventoInicioTs) || isNaN(eventoFimTs)) {
            mostrarNotificacao('Formato de Data/Hora do evento inválido', 'aviso');
            return;
        }
        if (eventoInicioTs < agoraTs) {
            mostrarNotificacao('A data/hora de início do evento não pode ser no passado', 'aviso');
            return;
        }
        if (eventoFimTs <= eventoInicioTs) {
            mostrarNotificacao('A data/hora de fim deve ser depois da data/hora de início do evento', 'aviso');
            return;
        }

        console.log('[CRIAR-EVENTO] Todas as validações passaram. Enviando requisição...');

        try {
            criarEventoBtn.disabled = true;
            const ehEdicao = eventoEmEdicaoId !== null;
            criarEventoBtn.textContent = ehEdicao ? 'Atualizando...' : 'Criando...';

            const eventoData = {
                nome: nomeEvento.value.trim(),
                cursos: cursosSelecionados.join(','),
                data: dataEvento.value,
                data_fim: dataFimEvento.value,
                descricao: descricao.value.trim(),
                sessoes: sessoes.map(s => ({
                    nome: s.titulo,
                    palestrantes: s.palestrante,
                    hora_inicio: s.horarioInicio,
                    hora_fim: s.horarioFim,
                    descricao: s.descricao
                }))
            };

            // Se estiver editando, usar PUT; se não, usar POST
            const url = ehEdicao 
                ? `${API_BASE_URL}/eventos/${eventoEmEdicaoId}/atualizar/`
                : `${API_BASE_URL}/eventos/criar/`;
            const method = ehEdicao ? 'PUT' : 'POST';

            console.log(`[CRIAR-EVENTO] Enviando ${method} para:`, url);
            console.log('[CRIAR-EVENTO] Dados:', eventoData);

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventoData)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('[CRIAR-EVENTO] Erro na resposta:', data);
                throw new Error(data.erro || `Erro ao ${ehEdicao ? 'atualizar' : 'criar'} evento`);
            }

            console.log('[CRIAR-EVENTO] Sucesso! Resposta:', data);

            const mensagem = ehEdicao 
                ? 'Evento atualizado com sucesso! Redirecionando...'
                : 'Evento criado com sucesso! Redirecionando...';

            mostrarNotificacao(mensagem, 'sucesso');

            // Aguardar um momento para o usuário ver a mensagem
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Limpar formulário
            nomeEvento.value = '';
            dataEvento.value = '';
            dataFimEvento.value = '';
            descricao.value = '';
            cursosSelecionados = [];
            sessoes = [];
            eventoEmEdicaoId = null;
            sessoesCheckboxes.forEach(cb => cb.checked = false);
            sessoesList.innerHTML = '';
            document.querySelectorAll('label[data-curso]').forEach(label => {
                label.classList.remove('border-blue-900', 'bg-blue-50');
            });

            // Redirecionar
            window.location.hash = '/dashboard';

        } catch (error) {
            console.error('Erro ao processar evento:', error);
            mostrarNotificacao(`Erro: ${error.message}`, 'erro');
        } finally {
            criarEventoBtn.disabled = false;
            criarEventoBtn.textContent = eventoEmEdicaoId !== null ? 'Atualizar Evento' : 'Criar Evento';
        }
    });

    // Cancelar
    cancelarBtn.addEventListener('click', () => {
        nomeEvento.value = '';
        dataEvento.value = '';
        dataFimEvento.value = '';
        descricao.value = '';
        cursosSelecionados = [];
        sessoes = [];
        eventoEmEdicaoId = null;
        sessoesCheckboxes.forEach(cb => cb.checked = false);
        sessoesList.innerHTML = '';
        criarEventoBtn.textContent = 'Criar Evento';
        mostrarNotificacao('Formulário limpo', 'info');
    });

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
            'sucesso': { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
            'erro': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
            'aviso': { bg: '#fef08a', text: '#713f12', border: '#fde047' },
            'info': { bg: '#dbeafe', text: '#0c2d6b', border: '#93c5fd' }
        };

        const cor = cores[tipo] || cores['info'];
        notificacao.style.backgroundColor = cor.bg;
        notificacao.style.color = cor.text;
        notificacao.style.border = `2px solid ${cor.border}`;
        notificacao.textContent = mensagem;

        document.body.appendChild(notificacao);

        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }
}
