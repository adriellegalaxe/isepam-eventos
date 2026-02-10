// Página Certificados
let certificadosData = [];

pages.certificados = function() {
    return `
        <div class="ml-64 bg-gray-50 min-h-screen p-8">
            <div class="max-w-7xl mx-auto">
                <!-- Header -->
                <div class="mb-8 animate-fade-in">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Meus Certificados</h1>
                    <p class="text-gray-600">Visualize seus certificados de participação</p>
                </div>

                <!-- Loading Spinner -->
                <div id="loading-spinner" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                    <p class="text-gray-600 mt-4">Carregando certificados...</p>
                </div>

                <!-- Cards de Estatísticas -->
                <div id="stats-cards" style="display: none;" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>

                <!-- Tabela de Certificados -->
                <div id="table-section" style="display: none;" class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Evento</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th class="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody id="certificadosTable"></tbody>
                    </table>
                </div>

                <!-- Mensagem de erro -->
                <div id="error-message" style="display: none;" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"></div>
            </div>
        </div>

        <!-- Modal de Detalhes do Certificado -->
        <div id="modal-certificado" style="display: none;" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 animate-scale-in">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2" id="modal-evento-nome"></h2>
                    <p class="text-gray-600" id="modal-evento-data"></p>
                </div>

                <div class="mb-6 space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="text-sm text-gray-600">Status:</span>
                        <span class="text-sm font-semibold" id="modal-evento-status"></span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="text-sm text-gray-600">Carga Horária:</span>
                        <span class="text-sm font-semibold text-gray-900" id="modal-carga-horaria"></span>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button id="modal-baixar-btn" class="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-semibold text-sm">
                        Baixar Certificado
                    </button>
                    <button id="modal-fechar-btn" class="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold text-sm">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
};

function attachCertificadosListeners() {
    carregarCertificados();
}

// Expor globalmente para que `main.js` possa chamar
window.attachCertificadosListeners = attachCertificadosListeners;

async function carregarCertificados() {
    try {
        const spinner = document.getElementById('loading-spinner');
        const statCards = document.getElementById('stats-cards');
        const tableSection = document.getElementById('table-section');
        const errorDiv = document.getElementById('error-message');
        const table = document.getElementById('certificadosTable');

        if (!spinner || !statCards || !tableSection || !errorDiv || !table) return;

        const usuario = authManager.usuarioAtual;
        if (!usuario || !usuario.matricula) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${API_BASE_URL}/usuarios/${usuario.matricula}/certificados/`, { headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error('Erro ao carregar certificados');

        const data = await response.json();
        certificadosData = data.certificados || [];

        // Atualizar estatísticas simples (preenchimento mínimo)
        const totalHoras = certificadosData.reduce((sum, cert) => sum + (cert.carga_horaria || 8), 0);
        const ultimaData = certificadosData[0] ? new Date(certificadosData[0].data).toLocaleDateString('pt-BR') : 'N/A';

        const totalCertsElem = document.getElementById('total-certs');
        const totalHorasElem = document.getElementById('total-horas');
        const ultimaDataElem = document.getElementById('ultima-data');
        if (totalCertsElem) totalCertsElem.textContent = certificadosData.length;
        if (totalHorasElem) totalHorasElem.textContent = totalHoras;
        if (ultimaDataElem) ultimaDataElem.textContent = ultimaData;

        table.innerHTML = certificadosData.map(cert => criarLinhaTabela(cert)).join('');
        anexarListenersBaixarCert();
        anexarListenersLinhaTabela();

        spinner.style.display = 'none';
        statCards.style.display = 'grid';
        tableSection.style.display = 'block';
        errorDiv.style.display = 'none';

    } catch (error) {
        console.error('Erro ao carregar certificados:', error);
        const spinner = document.getElementById('loading-spinner');
        const statCards = document.getElementById('stats-cards');
        const tableSection = document.getElementById('table-section');
        const errorDiv = document.getElementById('error-message');
        if (spinner) spinner.style.display = 'none';
        if (statCards) statCards.style.display = 'none';
        if (tableSection) tableSection.style.display = 'none';
        if (errorDiv) { errorDiv.innerHTML = `<strong>Erro:</strong> ${error.message}`; errorDiv.style.display = 'block'; }
    }
}

function criarLinhaTabela(cert) {
    const status = cert.status === 'finalizado' ? 'Finalizado' : 'Em Andamento';
    const statusClass = cert.status === 'finalizado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    return `
        <tr class="hover:bg-gray-50 transition border-b border-gray-200 cursor-pointer linha-certificado" data-evento-id="${cert.evento_id}" data-evento-nome="${cert.evento_nome}" data-evento-data="${cert.data}" data-evento-status="${cert.status}" data-carga-horaria="${cert.carga_horaria || 8}">
            <td class="px-6 py-4 text-sm text-gray-900 font-medium">${cert.evento_nome}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${new Date(cert.data).toLocaleDateString('pt-BR')}</td>
            <td class="px-6 py-4"><span class="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">Emitido</span></td>
            <td class="px-6 py-4">
                <button class="text-blue-900 hover:text-blue-700 transition font-semibold text-sm btn-baixar-cert" data-evento-id="${cert.evento_id}" data-evento-nome="${cert.evento_nome}" onclick="event.stopPropagation();">Baixar</button>
            </td>
        </tr>
    `;
}

function anexarListenersBaixarCert() {
    const botoes = document.querySelectorAll('.btn-baixar-cert');
    botoes.forEach(botao => {
        botao.addEventListener('click', async (e) => {
            e.preventDefault();
            const eventoId = parseInt(botao.getAttribute('data-evento-id'));
            const eventoNome = botao.getAttribute('data-evento-nome');
            const usuario = authManager.usuarioAtual;
            if (!usuario || !usuario.matricula) { mostrarNotificacao('Usuário não autenticado', 'error'); return; }
            botao.disabled = true; const prevText = botao.textContent; botao.textContent = 'Gerando...';
            try {
                await API.baixarCertificado(usuario.matricula, eventoId);
                mostrarNotificacao(`Certificado de "${eventoNome}" baixado com sucesso!`, 'success');
            } catch (error) {
                console.error('Erro ao baixar certificado:', error);
                mostrarNotificacao(`Erro ao baixar certificado: ${error.message}`, 'error');
            } finally {
                botao.disabled = false; botao.textContent = prevText || 'Baixar';
            }
        });
    });
}

function anexarListenersLinhaTabela() {
    const linhas = document.querySelectorAll('.linha-certificado');
    linhas.forEach(linha => {
        linha.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-baixar-cert')) return; // Evitar duplo clique
            const eventoNome = linha.getAttribute('data-evento-nome');
            const eventoData = linha.getAttribute('data-evento-data');
            const eventoStatus = linha.getAttribute('data-evento-status');
            const carhaHoraria = linha.getAttribute('data-carga-horaria');
            const eventoId = linha.getAttribute('data-evento-id');
            abrirModalCertificado(eventoNome, eventoData, eventoStatus, carhaHoraria, eventoId);
        });
    });
}

function abrirModalCertificado(eventoNome, eventoData, eventoStatus, carhaHoraria, eventoId) {
    const modal = document.getElementById('modal-certificado');
    const nomeElem = document.getElementById('modal-evento-nome');
    const dataElem = document.getElementById('modal-evento-data');
    const statusElem = document.getElementById('modal-evento-status');
    const cargaElem = document.getElementById('modal-carga-horaria');
    const baixarBtn = document.getElementById('modal-baixar-btn');

    nomeElem.textContent = eventoNome;
    dataElem.textContent = new Date(eventoData).toLocaleDateString('pt-BR');
    
    const statusTexto = eventoStatus === 'finalizado' ? 'Finalizado' : 'Em Andamento';
    const statusClass = eventoStatus === 'finalizado' ? 'text-green-800' : 'text-yellow-800';
    statusElem.className = 'text-sm font-semibold ' + statusClass;
    statusElem.textContent = statusTexto;
    
    cargaElem.textContent = carhaHoraria + 'h';

    // Anexar listener de download do modal
    baixarBtn.onclick = async (e) => {
        e.preventDefault();
        const usuario = authManager.usuarioAtual;
        if (!usuario || !usuario.matricula) { mostrarNotificacao('Usuário não autenticado', 'error'); return; }
        baixarBtn.disabled = true; const prevText = baixarBtn.textContent; baixarBtn.textContent = 'Gerando...';
        try {
            await API.baixarCertificado(usuario.matricula, eventoId);
            mostrarNotificacao(`Certificado de "${eventoNome}" baixado com sucesso!`, 'success');
        } catch (error) {
            console.error('Erro ao baixar certificado:', error);
            mostrarNotificacao(`Erro ao baixar certificado: ${error.message}`, 'error');
        } finally {
            baixarBtn.disabled = false; baixarBtn.textContent = prevText || 'Baixar Certificado';
        }
    };

    // Mostrar modal
    modal.style.display = 'flex';
}

function fecharModalCertificado() {
    const modal = document.getElementById('modal-certificado');
    modal.style.display = 'none';
}

// Anexar listener de fechar modal
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const fecharBtn = document.getElementById('modal-fechar-btn');
        const modal = document.getElementById('modal-certificado');
        if (fecharBtn) fecharBtn.addEventListener('click', fecharModalCertificado);
        if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalCertificado(); });
    }, 100);
});
