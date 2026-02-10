// Arquivo principal - Orquestrador da aplicação
// pages é declarado globalmente em index.html
let router = null;

// Esperar todos os scripts carregarem
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando aplicação...');

    // Criar o objeto com as páginas
    const pagesList = {
        home: pages.home || (() => '<div>Home</div>'),
        login: pages.login || (() => '<div>Login</div>'),
        cadastro: pages.cadastro || (() => '<div>Cadastro</div>'),
        acesso: pages.acesso || (() => '<div>Acesso</div>'),
        dashboard: pages.dashboard || (() => '<div>Dashboard</div>'),
        detalheEvento: pages.detalheEvento || (() => '<div>Detalhe Evento</div>'),
        criarEvento: pages.criarEvento || (() => '<div>Criar Evento</div>'),
        qrCodePresenca: pages.qrCodePresenca || (() => '<div>QR Code</div>'),
        certificados: pages.certificados || (() => '<div>Certificados</div>'),
    };

    // Inicializar o router
    router = new Router(pagesList, authManager);
    window.currentRouter = router;

    // Listener para mudanças de navegação - sobrescreve navigate para sempre anexar listeners
    const originalNavigate = router.navigate.bind(router);
    router.navigate = function(route) {
        originalNavigate(route);
        attachPageListeners();
    };

    // Carregar a página inicial (usa o navigate sobrescrito para garantir attachPageListeners)
    const initialRoute = router.getCurrentRoute();
    router.navigate(initialRoute);

    // Monitorar mudanças de autenticação
    authManager.subscribe((usuario) => {
        console.log('Usuário mudou:', usuario);
        router.redirectIfNeeded();
        attachPageListeners();
    });
}

function attachPageListeners() {
    console.log('MAIN: attachPageListeners() chamado');
    // Renderizar navegação se autenticado
    const root = document.getElementById('root');
    
    if (authManager.isAutenticado && root) {
        console.log('MAIN: usuario autenticado, renderizando nav');
        // Preparar estrutura com navegação
        const navHTML = Navigation.render();
        if (navHTML && !document.querySelector('nav')) {
            root.insertAdjacentHTML('beforebegin', navHTML);
            Navigation.attachListeners();
        } else if (navHTML) {
            // Atualizar navegação existente
            const existingNav = document.querySelector('nav');
            if (existingNav) {
                existingNav.outerHTML = navHTML;
                Navigation.attachListeners();
            }
        }
    } else {
        console.log('MAIN: usuario nao autenticado, removendo nav');
        // Remover navegação se não autenticado
        const existingNav = document.querySelector('nav');
        if (existingNav) {
            existingNav.remove();
        }
    }

    // Anexar listeners específicos da página
    const currentPage = window.location.hash.slice(1).split('?')[0] || '/';
    console.log('MAIN: currentPage=' + currentPage);

    switch(currentPage) {
        case '/':
            if (authManager.isAutenticado) {
                // Será redirecionado para dashboard pelo router
                break;
            }
            console.log('MAIN: anexando listeners de home');
            attachHomeListeners();
            break;
        case '/login':
            console.log('MAIN: anexando listeners de login');
            attachLoginListeners();
            break;
        case '/cadastro':
            console.log('MAIN: anexando listeners de cadastro');
            attachCadastroListeners();
            break;
        case '/dashboard':
            console.log('MAIN: anexando listeners de dashboard');
            attachDashboardListeners();
            break;
        case '/detalhe-evento':
            console.log('MAIN: anexando listeners de detalhe evento');
            attachDetalheEventoListeners();
            break;
        case '/criar-evento':
            console.log('MAIN: anexando listeners de criar evento');
            attachCriarEventoListeners();
            break;
        case '/qr-code':
            console.log('MAIN: anexando listeners de qr code');
            // Aguardar um pouco para os elementos estarem prontos
            setTimeout(() => {
                attachQRCodePresencaListeners();
            }, 100);
            break;
        case '/certificados':
            console.log('MAIN: anexando listeners de certificados');
            attachCertificadosListeners();
            break;
        default:
            console.log('MAIN: rota nao reconhecida, nenhum listener anexado');
    }
}

// Função auxiliar para fazer navegação funcionar com hash
window.navigate = function(path) {
    window.location.hash = path;
};

// Iniciar Lucide Icons quando disponível
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
    }
});

console.log('Main.js carregado');
