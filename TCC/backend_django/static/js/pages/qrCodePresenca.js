// Página QRCodePresenca
let eventosQRData = [];
let qrRetries = 0;
const MAX_QR_RETRIES = 3;

pages.qrCodePresenca = function() {
    return `
        <div class="ml-64 bg-gray-50 min-h-screen p-8">
            <div class="max-w-4xl mx-auto">
                
                <!-- Header -->
                <div class="mb-8 animate-fade-in">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">QR Code de Presença</h1>
                    <p class="text-gray-600">Escaneie o código abaixo para confirmar sua presença</p>
                </div>

                <!-- Loading Spinner -->
                <div id="loading-spinner" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                    <p class="text-gray-600 mt-4">Carregando eventos...</p>
                </div>

                <!-- Formulário de Seleção -->
                <div id="form-section" style="display: none;" class="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div class="max-w-md">
                        <!-- Seleção de Evento -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">
                                Selecione o Evento
                            </label>
                            <select
                                id="eventoSelect"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                            >
                                <!-- Opções carregadas aqui -->
                            </select>
                        </div>
                    </div>
                </div>

                <!-- QR Code -->
                <div id="qr-section" style="display: none;" class="bg-white rounded-lg shadow-lg p-12 text-center">
                    <div class="mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4" id="eventoNome">
                            
                        </h2>
                    </div>

                    <!-- QR Code Container -->
                    <div
                        id="qr-code"
                        class="flex justify-center mb-8 bg-gray-50 p-8 rounded-lg inline-block mx-auto"
                    >
                        <!-- QR será gerado aqui -->
                    </div>

                    <p class="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                        Escaneie este código QR com seu smartphone para confirmar sua presença
                    </p>
                </div>

                <!-- Informações Adicionais -->
                <div id="info-section" style="display: none;" class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 class="font-semibold text-blue-900 mb-3">ℹ️ Instruções</h3>
                    <ul class="text-blue-800 space-y-2 text-sm">
                        <li>• Selecione o evento que está participando</li>
                        <li>• Aponte a câmera do seu smartphone para o QR Code</li>
                        <li>• Sua presença será registrada automaticamente</li>
                        <li>• Você pode baixar o código para compartilhar ou imprimir</li>
                    </ul>
                </div>

                <!-- Mensagem de erro -->
                <div id="error-message" style="display: none;" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <!-- Erro aqui -->
                </div>
            </div>
        </div>
    `;
};

function attachQRCodePresencaListeners() {
    console.log('QRCodePresenca: attachQRCodePresencaListeners() chamado');
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        // Verificar se usuário é coordenador
        try {
            if (!authManager || !authManager.isAutenticado) {
                const spinner = document.getElementById('loading-spinner');
                const errorDiv = document.getElementById('error-message');
                if (spinner) spinner.style.display = 'none';
                if (errorDiv) {
                    errorDiv.innerHTML = '<strong>Erro:</strong> Acesso negado. Faça login como coordenador.';
                    errorDiv.style.display = 'block';
                }
                return;
            }

            const usuario = authManager.usuarioAtual || JSON.parse(localStorage.getItem('usuario') || 'null');
            if (!usuario || (usuario.funcao && usuario.funcao.toLowerCase() !== 'coordenador')) {
                const spinner = document.getElementById('loading-spinner');
                const errorDiv = document.getElementById('error-message');
                if (spinner) spinner.style.display = 'none';
                if (errorDiv) {
                    errorDiv.innerHTML = '<strong>Acesso restrito:</strong> Apenas coordenadores podem exibir QR Codes.';
                    errorDiv.style.display = 'block';
                }
                return;
            }

        } catch (e) {
            console.error('QRCodePresenca: erro ao verificar permissões', e);
        }

        carregarEventosQR();
    }, 100);
}

// Expor globalmente para que `main.js` possa chamar
window.attachQRCodePresencaListeners = attachQRCodePresencaListeners;

async function carregarEventosQR() {
    console.log('QRCodePresenca: carregarEventosQR() iniciado');
    try {
        const spinner = document.getElementById('loading-spinner');
        const formSection = document.getElementById('form-section');
        const qrSection = document.getElementById('qr-section');
        const infoSection = document.getElementById('info-section');
        const errorDiv = document.getElementById('error-message');
        const eventoSelect = document.getElementById('eventoSelect');

        console.log('QRCodePresenca: Verificando elementos do DOM', {
            spinner: !!spinner,
            formSection: !!formSection,
            qrSection: !!qrSection,
            errorDiv: !!errorDiv,
            eventoSelect: !!eventoSelect
        });

        if (!spinner || !formSection || !qrSection || !eventoSelect) {
            console.error('QRCodePresenca: Elementos do DOM não encontrados');
            return;
        }

        // Carregar todos os eventos
        console.log('QRCodePresenca: Carregando eventos da API...');
        const response = await fetch(`${API_BASE_URL}/eventos/`, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar eventos');
        }

        const data = await response.json();
        eventosQRData = data.eventos || [];
        
        console.log('QRCodePresenca: Eventos carregados:', eventosQRData.length);

        // Filtrar apenas eventos ativos (em_andamento) — backend fornece campo 'Status' ou usar Data
        const hoje = new Date();
        const eventosAtivos = eventosQRData.filter(e => {
            try {
                if (e.Status) {
                    return e.Status.toLowerCase() === 'em_andamento';
                }
                if (e.Data) {
                    const evDate = new Date(e.Data);
                    return evDate >= hoje;
                }
            } catch (err) {
                return false;
            }
            return false;
        });

        console.log('QRCodePresenca: Eventos ativos encontrados:', eventosAtivos.length);

        // Popular select apenas com eventos ativos
        eventoSelect.innerHTML = eventosAtivos
            .map(e => `<option value="${e.ID}">${e.Nome} - ${e.Data || ''}</option>`)
            .join('');

        // Atualizar a lista usada pelo gerador para procurar pelos dados
        eventosQRData = eventosAtivos;

        // Gerar QR do primeiro evento, se houver ativos
        if (eventosQRData.length > 0) {
            console.log('QRCodePresenca: Gerando QR Code do primeiro evento ativo...');
            gerarQRCodeQR();
        } else {
            // Sem eventos ativos -> mostrar mensagem
            const spinner = document.getElementById('loading-spinner');
            const formSection = document.getElementById('form-section');
            const qrSection = document.getElementById('qr-section');
            const infoSection = document.getElementById('info-section');
            const errorDiv = document.getElementById('error-message');
            if (spinner) spinner.style.display = 'none';
            if (formSection) formSection.style.display = 'none';
            if (qrSection) qrSection.style.display = 'none';
            if (infoSection) infoSection.style.display = 'none';
            if (errorDiv) {
                errorDiv.innerHTML = '<strong>Sem eventos ativos</strong>: não há eventos em andamento para gerar QR Codes.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        // Anexar listener de mudança de evento
        eventoSelect.addEventListener('change', (e) => {
            console.log('QRCodePresenca: Evento selecionado:', e.target.value);
            gerarQRCodeQR();
        });

        // Mostrar conteúdo
        spinner.style.display = 'none';
        formSection.style.display = 'block';
        qrSection.style.display = 'block';
        if (infoSection) infoSection.style.display = 'block';
        errorDiv.style.display = 'none';
        
        console.log('QRCodePresenca: Conteúdo exibido com sucesso');

    } catch (error) {
        console.error('QRCodePresenca: Erro ao carregar eventos:', error);
        const spinner = document.getElementById('loading-spinner');
        const errorDiv = document.getElementById('error-message');
        
        if (spinner) spinner.style.display = 'none';
        if (errorDiv) {
            errorDiv.innerHTML = `<strong>Erro:</strong> ${error.message}`;
            errorDiv.style.display = 'block';
        }
    }
}

function gerarQRCodeQR() {
    try {
        // Garantir que a biblioteca QRCode está disponível
        if (typeof QRCode === 'undefined') {
            qrRetries++;
            if (qrRetries >= MAX_QR_RETRIES) {
                console.error('QRCode não pôde ser carregado após tentativas');
                const qrContainer = document.getElementById('qr-code');
                if (qrContainer) {
                    qrContainer.innerHTML = '<div class="text-red-600 p-4">Erro ao carregar QR Code. Atualize a página.</div>';
                }
                return;
            }
            console.log(`QRCode não disponível. Tentativa ${qrRetries}/${MAX_QR_RETRIES}`);
            setTimeout(() => gerarQRCodeQR(), 1000);
            return;
        }
        
        // Reset retries se conseguiu carregar
        qrRetries = 0;

        const eventoSelect = document.getElementById('eventoSelect');
        const qrContainer = document.getElementById('qr-code');
        const eventoNome = document.getElementById('eventoNome');

        const eventoId = eventoSelect.value;

        if (!eventoId) return;

        const evento = eventosQRData.find(e => e.ID == eventoId);

        // Atualizar título
        if (evento) {
            eventoNome.textContent = evento.Nome;
            console.log('QRCodePresenca: Gerando QR Code para evento:', evento.Nome);
        }

        // Dados do QR - apenas evento, sem sessão
        const qrData = `https://isepam.edu.br/presenca?evento=${eventoId}&timestamp=${Date.now()}`;

        // Limpar QR anterior
        qrContainer.innerHTML = '';

        // Gerar novo QR Code
        new QRCode(qrContainer, {
            text: qrData,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        console.log('QRCodePresenca: QR Code gerado com sucesso');

    } catch (error) {
        console.error('Erro ao gerar QR:', error);
    }
}
