// Módulo API - Comunicação com backend Django
// Fornece funções para chamar endpoints REST do servidor

const API_BASE_URL = 'http://localhost:8000/api';

class API {
    // ==================== AUTENTICAÇÃO ====================

    static async login(matricula, senha) {
        try {
            console.log('API: login() chamado com matricula=' + matricula);
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula: parseInt(matricula), senha })
            });
            
            console.log('API: fetch retornou status=' + response.status);
            const data = await response.json();
            console.log('API: resposta JSON=' + JSON.stringify(data));
            
            if (!response.ok) {
                console.log('API: resposta nao OK, erro=' + data.erro);
                throw new Error(data.erro || 'Erro ao fazer login');
            }
            
            console.log('API: retornando usuario=' + JSON.stringify(data.usuario));
            return data.usuario;
        } catch (error) {
            console.error('API: erro no login=' + error.message);
            throw error;
        }
    }

    static async cadastro(nome, matricula, cpf, email, funcao, senha) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/cadastro/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    matricula: parseInt(matricula),
                    cpf: parseInt(cpf),
                    email,
                    funcao,
                    senha
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.erro || 'Erro ao cadastrar');
            
            return data.usuario;
        } catch (error) {
            console.error('Erro no cadastro:', error);
            throw error;
        }
    }

    // ==================== EVENTOS ====================

    static async listarEventos() {
        try {
            const response = await fetch(`${API_BASE_URL}/eventos/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.erro || 'Erro ao listar eventos');
            
            return data.eventos || [];
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            throw error;
        }
    }

    static async obterEvento(eventoId) {
        try {
            const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.erro || 'Erro ao obter evento');
            
            return data.evento;
        } catch (error) {
            console.error('Erro ao obter evento:', error);
            throw error;
        }
    }

    static async criarEvento(nome, cursos, data, sessoes = []) {
        try {
            const response = await fetch(`${API_BASE_URL}/eventos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    cursos: Array.isArray(cursos) ? cursos.join(',') : cursos,
                    data,
                    sessoes
                })
            });
            
            const data_res = await response.json();
            if (!response.ok) throw new Error(data_res.erro || 'Erro ao criar evento');
            
            return data_res.evento_id;
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            throw error;
        }
    }

    // ==================== INSCRIÇÕES ====================

    static async inscreverEvento(eventoId, matricula) {
        try {
            const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/inscrever/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula: parseInt(matricula) })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.erro || 'Erro ao inscrever');
            
            return data;
        } catch (error) {
            console.error('Erro ao inscrever em evento:', error);
            throw error;
        }
    }

    static async desinscreverEvento(eventoId, matricula) {
        try {
            const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/desinscrever/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula: parseInt(matricula) })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.erro || 'Erro ao desinscrever');
            
            return data;
        } catch (error) {
            console.error('Erro ao desinscrever de evento:', error);
            throw error;
        }
    }

    static async listarEventosUsuario(matricula) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${matricula}/eventos/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.erro || 'Erro ao listar eventos');
            
            return data.eventos || [];
        } catch (error) {
            console.error('Erro ao listar eventos do usuário:', error);
            throw error;
        }
    }

    // ==================== CERTIFICADOS ====================

    static async listarCertificados(matricula) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${matricula}/certificados/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.erro || 'Erro ao listar certificados');
            
            return data.certificados || [];
        } catch (error) {
            console.error('Erro ao listar certificados:', error);
            throw error;
        }
    }

    // ==================== QR CODE ====================

    static async gerarQRCodeData(eventoId, sessaoId) {
        try {
            const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/sessoes/${sessaoId}/qrcode/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.erro || 'Erro ao gerar QR code');
            
            return data.qr_data;
        } catch (error) {
            console.error('Erro ao gerar QR code:', error);
            throw error;
        }
    }

    // ==================== CERTIFICADOS ====================

    static async baixarCertificado(matricula, eventoId) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${matricula}/certificados/${eventoId}/`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erro ao gerar certificado');
            }
            
            // Converter resposta para blob e criar download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificado_${matricula}_${eventoId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return true;
        } catch (error) {
            console.error('Erro ao baixar certificado:', error);
            throw error;
        }
    }

    // ==================== HEALTH CHECK ====================

    static async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/health/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            return response.ok;
        } catch (error) {
            console.error('Backend não está respondendo:', error);
            return false;
        }
    }
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
