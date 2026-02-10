// Sistema de Autenticação
class AuthManager {
    constructor() {
        this.usuarioAtual = null;
        this.carregarDoStorage();
        this.listeners = [];
    }

    carregarDoStorage() {
        const usuarioSalvo = localStorage.getItem('usuario');
        if (usuarioSalvo) {
            try {
                this.usuarioAtual = JSON.parse(usuarioSalvo);
            } catch (e) {
                console.error('Erro ao carregar usuário do storage:', e);
                localStorage.removeItem('usuario');
            }
        }
    }

    async login(matricula, senha) {
        console.log('AUTH: login() chamado com matricula=' + matricula);
        
        if (!matricula || !senha || senha.length < 6) {
            console.log('AUTH: validacao falhou');
            throw new Error('Matrícula e senha inválidas');
        }

        console.log('AUTH: Validacao OK, chamando API.login()');
        // Chamar API real do Django
        const usuario = await API.login(matricula, senha);
        console.log('AUTH: API retornou usuario=' + JSON.stringify(usuario));
        
        this.usuarioAtual = usuario;
        console.log('AUTH: usuarioAtual definido=' + JSON.stringify(this.usuarioAtual));
        
        localStorage.setItem('usuario', JSON.stringify(usuario));
        console.log('AUTH: localStorage salvo');
        console.log('AUTH: isAutenticado getter retorna=' + this.isAutenticado);
        
        this.notificarListeners();
        console.log('AUTH: listeners notificados');
        
        return usuario;
    }

    async cadastro(dados) {
        if (dados.senha !== dados.confirmarSenha) {
            throw new Error('As senhas não conferem');
        }

        if (!this.validarCPF(dados.cpf)) {
            throw new Error('CPF inválido');
        }

        // Chamar API real do Django
        const usuario = await API.cadastro(
            dados.nome,
            dados.matricula,
            dados.cpf,
            dados.email,
            dados.tipo,
            dados.senha
        );
        this.usuarioAtual = usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.notificarListeners();
        return usuario;
    }

    logout() {
        this.usuarioAtual = null;
        localStorage.removeItem('usuario');
        this.notificarListeners();
    }

    validarCPF(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, '');
        return cpfLimpo.length === 11;
    }

    get isAutenticado() {
        // Verdadeira fonte da verdade: localStorage
        if (this.usuarioAtual) {
            return true;
        }
        
        // Fallback: verificar localStorage diretamente
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            try {
                this.usuarioAtual = JSON.parse(usuarioStorage);
                return true;
            } catch (e) {
                return false;
            }
        }
        
        return false;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notificarListeners() {
        this.listeners.forEach(listener => listener(this.usuarioAtual));
    }
}

// Instância global
const authManager = new AuthManager();
