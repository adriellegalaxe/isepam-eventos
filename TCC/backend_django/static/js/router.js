// Sistema de Rotas
class Router {
    constructor(pages, authManager) {
        this.pages = pages;
        this.authManager = authManager;
        this.currentPage = null;
        this.listeners = [];

        // Ouvir mudanças de autenticação
        authManager.subscribe(() => {
            this.redirectIfNeeded();
        });

        // Ouvir mudanças de URL
        window.addEventListener('hashchange', () => {
            this.navigate(this.getCurrentRoute());
        });
    }

    getCurrentRoute() {
        return window.location.hash.slice(1) || '/';
    }

    async navigate(route) {
        // Remover parâmetros da rota para seleção de página
        const routeBase = route.split('?')[0];
        
        console.log('ROUTER: navigate() routeBase=' + routeBase);
        console.log('ROUTER: isAutenticado=' + this.authManager.isAutenticado);

        // Verificar se é rota de login/cadastro/acesso (públicas)
        if (['/login', '/cadastro', '/acesso', '/acesso/codigo', '/'].includes(routeBase)) {
            if (this.authManager.isAutenticado) {
                // Se autenticado, redirecionar ao dashboard
                console.log('ROUTER: Usuario autenticado em rota publica, redirecionando');
                this.redirect('/dashboard');
                return;
            }
        } else {
            // Rotas protegidas
            if (!this.authManager.isAutenticado) {
                console.log('ROUTER: Usuario NAO autenticado em rota protegida, redirecionando para /login');
                this.redirect('/login');
                return;
            }
        }
        
        console.log('ROUTER: Prosseguindo para renderizar rota');

        // Mapa de rotas
        const routeMap = {
            '/': () => {
                if (this.authManager.isAutenticado) {
                    this.redirect('/dashboard');
                } else {
                    this.redirect('/login');
                }
            },
            '/login': () => this.pages.login(),
            '/cadastro': () => this.pages.cadastro(),
            '/acesso': () => this.pages.acesso(),
            '/acesso/codigo': () => this.pages.acesso(),
            '/dashboard': () => this.pages.dashboard(),
            '/detalhe-evento': () => this.pages.detalheEvento(),
            '/criar-evento': () => this.pages.criarEvento(),
            '/qr-code': () => this.pages.qrCodePresenca(),
            '/certificados': () => this.pages.certificados(),
        };

        const pageRenderer = routeMap[routeBase] || (() => {
            // Rota não encontrada, redirecionar para home
            this.redirect('/');
            return '';
        });

        try {
            const html = pageRenderer();
            if (html) {
                document.getElementById('root').innerHTML = html;
                this.currentPage = routeBase;
                
                console.log('ROUTER: HTML renderizado, aguardando DOM ficar pronto');

                // Inicializar Lucide Icons
                if (window.lucide) {
                    lucide.createIcons();
                }
                
                // Chamar attachPageListeners DEPOIS que o DOM está pronto
                // Usar setTimeout para garantir que o DOM foi atualizado
                setTimeout(() => {
                    console.log('ROUTER: Chamando attachPageListeners apos renderizar');
                    attachPageListeners();
                }, 0);

                // Chamar onMount da página se existir
                const pageKey = Object.keys(pages).find(key => pages[key].name === routeBase);
            }
        } catch (error) {
            console.error('Erro ao renderizar página:', error);
            document.getElementById('root').innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center">
                        <h1 class="text-4xl font-bold text-red-600 mb-4">Erro</h1>
                        <p class="text-gray-600 mb-8">${error.message}</p>
                        <a href="#/" class="text-blue-900 font-semibold hover:text-purple-900">Voltar ao início</a>
                    </div>
                </div>
            `;
        }
    }

    redirectIfNeeded() {
        const currentRoute = this.getCurrentRoute();
        
        // Se estiver em rota pública mas autenticado
        if (['/login', '/cadastro', '/acesso', '/acesso/codigo', '/'].includes(currentRoute)) {
            if (this.authManager.isAutenticado) {
                this.redirect('/dashboard');
                return;
            }
        }

        // Se estiver em rota protegida mas não autenticado
        if (!['/login', '/cadastro', '/acesso', '/acesso/codigo', '/'].includes(currentRoute)) {
            if (!this.authManager.isAutenticado) {
                this.redirect('/login');
                return;
            }
        }
    }

    redirect(route) {
        window.location.hash = route;
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }
}
