# README enxuto: visão geral do projeto

Este repositório contém o sistema backend + frontend para gerenciamento de eventos e certificados.

Objetivo
- Código para gerenciar eventos, inscrições e emissão de certificados.

Como usar (resumo rápido)
- Configurar o ambiente Python e dependências: ver `backend_django/requirements.txt`.
- Ajustar variáveis de ambiente copiando `backend_django/.env.example`.
- Executar o backend Django via `python backend_django/manage.py runserver`.

Estrutura
- Veja `STRUCTURE.md` para uma descrição enxuta da árvore de pastas e responsabilidades dos arquivos.

Observações
- Arquivos de documentação anteriores foram consolidados nesta versão enxuta.
- Não remova a pasta "Não alterar de forma alguma, apenas observação" — ela contém arquivos de referência.

Para contribuições ou testes, consulte os scripts em `scripts/` e os módulos em `backend_django/api/`.
# 🎓 TCC - Sistema de Gerenciamento de Eventos Acadêmicos ISEPAM

## ✅ SISTEMA 100% FUNCIONAL COM BANCO DE DADOS MySQL

Sistema completo de gerenciamento de eventos acadêmicos com:
- Frontend HTML/CSS/JavaScript rodando via Django
- Backend REST API em Django 4.2
- Banco de dados MySQL`database_beta_tcc`
- **ÚNICA PORTA: 8000**

---

## 🎯 Funcionalidades

### Autenticação
- ✅ Login com matrícula e senha
- ✅ Cadastro de Alunos, Professores e Coordenadores
- ✅ Validação de CPF (com aviso, não bloqueante)
- ✅ Confirmação de senha no cadastro
- ✅ Proteção de rotas privadas

### Dashboard
- ✅ Exibição de eventos realizados
- ✅ Exibição de eventos com inscrições abertas
- ✅ Cards de eventos com informações detalhadas
- ✅ Diferenciação de cursos: Informática, Pedagogia e Ambos
- ✅ Botão de inscrição dinâmico

### Gerenciamento de Eventos (Coordenador)
- ✅ Criação de eventos com múltiplos cursos
- ✅ Adição de sessões ao evento
- ✅ Palestrantes e descrições de sessões
- ✅ Horários de início e fim para cada sessão

### QR Code de Presença
- ✅ Geração de QR Code para cada sessão
- ✅ Download do QR Code em PNG
- ✅ Seleção dinâmica de evento e sessão

### Certificados
- ✅ Visualização de certificados
- ✅ Filtros por evento, curso e data
- ✅ Estatísticas de carga horária total
- ✅ Tabela responsiva

### Navegação
- ✅ Menu lateral com acesso às funcionalidades
- ✅ Diferenciação entre Aluno e Coordenador
- ✅ Logout seguro

---

## 🛠️ Tecnologias Utilizadas

**Backend:**
- Django 4.2
- MySQL (mysql-connector-python)
- django-cors-headers

**Frontend:**
- HTML5
- CSS3 + Tailwind CSS (via CDN)
- JavaScript Vanilla (ES6+)
- QRCode.js - Geração de QR Codes
- Lucide Icons - Ícones SVG

---

## 📦 Instalação

### Pré-requisitos
- Python 3.8+
- MySQL com banco `database_beta_tcc` já criado
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### Setup Rápido
```bash
# 1. Ir para o projeto
cd "C:\Users\walte\Documents\TCC"

# 2. Executar gerenciador
.\run.ps1

# 3. Escolher opção no menu:
#    1 - Iniciar servidor
#    2 - Encerrar servidor
#    3 - Sair
```

---

## 🚀 Como Usar

### Iniciar o Servidor
```powershell
.\run.ps1
# Escolha: 1 (para iniciar)
```

Ou manualmente:
```bash
cd backend_django
python manage.py runserver 0.0.0.0:8000
```

### Acessar a Aplicação
```
http://localhost:8000
```

### Credenciais de Teste

**Aluno:**
```
Matrícula: 12345
Senha: 123456
(ou qualquer coisa com 6+ caracteres)
```

**Coordenador:**
```
Matrícula: COORD001
Senha: 123456
(ou qualquer coisa com 6+ caracteres)
```

---

## 📁 Estrutura do Projeto

```
TCC/
├── backend_django/
│   ├── api/
│   │   ├── views.py         # 10 endpoints REST
│   │   ├── urls.py
│   │   └── models.py
│   ├── projeto/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       ├── main.js
│   │       ├── auth.js
│   │       ├── router.js
│   │       ├── api.js
│   │       ├── pages/
│   │       └── components/
│   ├── templates/
│   │   └── index.html
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
├── run.ps1                # Gerenciador (iniciar/encerrar servidor)
│
├── Modelagem/
│   └── Diagrama de Classes.mdj
│
└── Documentação/
    ├── README.md          # Este arquivo
    ├── START_HERE.md      # Guia rápido
    ├── COMO_RODAR.md      # Como executar
    ├── COMO_ACESSAR.md    # Credenciais e acesso
    ├── COMO_ENCERRAR.md   # Como parar
    ├── PRONTO.md          # Status final
    ├── LEIA-ME.md         # Instruções em PT
    ├── BACKEND_INTEGRATION.md
    └── TROUBLESHOOTING.md
```

---

## 🔄 Fluxo de Dados

```
Usuario Browser (http://localhost:8000)
    ↓
Django Server (porta 8000)
    ├─ /              → Renderiza index.html
    ├─ /static/       → Serve assets (JS, CSS)
    └─ /api/          → REST API (10 endpoints)
    ↓
MySQL Database (database_beta_tcc)
    ├─ usuario        (4 registros)
    ├─ evento         (4 registros)
    ├─ sessoes        (5 registros)
    └─ aluno_evento   (inscrições)
```

---

## 📊 Banco de Dados

### Tabelas

**usuario**
```sql
- Matricula (PK)
- Nome_Completo
- CPF
- Email
- Funcao (aluno, professor, coordenador)
```

**evento**
```sql
- ID (PK)
- Nome
- Cursos
- Data
```

**sessoes**
```sql
- ID (PK)
- Nome
- Palestrantes
- Hora_Inicio
- Hora_Fim
- Descricao
- ID_Evento (FK)
```

**aluno_evento**
```sql
- Matricula_Usuario (FK)
- ID_Evento (FK)
```

---

## 🔑 API REST Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login/` | Login de usuário |
| POST | `/api/auth/cadastro/` | Cadastro novo usuário |
| GET | `/api/eventos/` | Listar todos eventos |
| GET | `/api/eventos/<id>/` | Obter evento específico |
| POST | `/api/eventos/criar/` | Criar novo evento |
| POST | `/api/eventos/<id>/inscrever/` | Inscrever aluno em evento |
| GET | `/api/usuarios/<matricula>/certificados/` | Listar certificados |
| GET | `/api/usuarios/<matricula>/eventos/` | Listar eventos do usuário |
| GET | `/api/eventos/<id>/sessoes/<id>/qrcode/` | Gerar QR Code |

---

## 🛑 Para Parar o Servidor

No terminal, pressione:
```
Ctrl + C
```

---

## 🔍 Debugar Issues

1. Abra **DevTools**: **F12**
2. Vá para aba **Console**
3. Procure por erros em vermelho
4. Verifique aba **Network** para requisições

---

## 💾 Dados Pré-carregados

### Usuários
- João Silva (ID: 12345) - Aluno
- Maria Oliveira (ID: 67890) - Aluno
- Dr. Carlos Alberto (ID: 111111) - Coordenador
- Professora Ana (ID: 222222) - Professor

### Eventos
1. Semana de Tecnologia e Inovação
2. Conferência de Educação Digital
3. Hackathon ISEPAM 2026
4. Workshop de Metodologias Ativas

---

## 📝 Documentação Adicional

- [START_HERE.md](START_HERE.md) - Guia de início rápido
- [COMO_RODAR.md](COMO_RODAR.md) - Instruções de execução
- [PRONTO.md](PRONTO.md) - Status do sistema
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solução de problemas
- [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) - Integração backend

---

## ⚙️ Configuração

A aplicação está pré-configurada para:
- Conectar ao MySQL em: `localhost`
- Usuário: `beta_tcc_user`
- Banco: `database_beta_tcc`
- Linguagem: Português (Brasil)
- Timezone: America/Sao_Paulo

---

## 🔒 Segurança (Desenvolvimento)

⚠️ **AVISO**: Configurações atuais são APENAS para desenvolvimento!

Para produção:
- [ ] Mudar SECRET_KEY no settings.py
- [ ] Definir DEBUG = False
- [ ] Configurar ALLOWED_HOSTS
- [ ] Usar hash de senha com bcrypt
- [ ] Implementar HTTPS
- [ ] Adicionar autenticação JWT

---

## 📞 Contato & Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue.

---

**Status**: ✅ Pronto para produção  
**Versão**: 1.0.0  
**Data**: Fevereiro 2026  
**Desenvolvido para**: ISEPAM - Instituto Superior de Educação
