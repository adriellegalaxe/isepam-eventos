# Django Backend Setup

## Instruções de Configuração

Este é o backend Django para a aplicação de gerenciamento de eventos.

### Pré-requisitos

1. Python 3.8+
2. pip
3. MySQL 8.0.45 rodando localmente
4. Banco de dados `database_beta_tcc` criado com as tabelas

### Instalação de Dependências

```bash
pip install django
pip install mysql-connector-python
pip install django-cors-headers
```

### Estrutura do Projeto

```
backend_django/
├── manage.py                 # Gerenciador Django
├── projeto/                  # Configuração do projeto
│   ├── __init__.py
│   ├── settings.py          # Configurações (banco de dados, etc)
│   ├── urls.py              # URLs da aplicação
│   └── wsgi.py              # WSGI para produção
└── api/                      # Aplicação API
    ├── __init__.py
    ├── views.py             # Lógica dos endpoints
    ├── urls.py              # URLs da API
    ├── apps.py              # Configuração da app
    └── admin.py
```

### Rodando o Backend

1. Navegue até o diretório `backend_django`:

```bash
cd backend_django
```

2. Inicie o servidor de desenvolvimento:

```bash
python manage.py runserver 0.0.0.0:8000
```

O servidor estará disponível em: `http://localhost:8000`

### Endpoints Disponíveis

#### Autenticação
- `POST /api/auth/login/` - Login de usuário
- `POST /api/auth/cadastro/` - Cadastro de novo usuário

#### Eventos
- `GET /api/eventos/` - Lista todos os eventos
- `GET /api/eventos/<id>/` - Obtém um evento específico
- `POST /api/eventos/criar/` - Cria um novo evento
- `POST /api/eventos/<id>/inscrever/` - Inscreve usuário em um evento

#### Usuário
- `GET /api/usuarios/<matricula>/eventos/` - Lista eventos do usuário
- `GET /api/usuarios/<matricula>/certificados/` - Lista certificados do usuário

#### QR Code
- `GET /api/eventos/<evento_id>/sessoes/<sessao_id>/qrcode/` - Gera dados para QR code

#### Health Check
- `GET /api/health/` - Verifica se o backend está respondendo

### Credenciais do Banco

As credenciais estão configuradas em `projeto/settings.py`:

- Host: localhost
- Usuário: beta_tcc_user
- Senha: bcw,8907
- Database: database_beta_tcc

### Testando a Conexão

Para testar se o backend está funcionando corretamente:

```bash
curl http://localhost:8000/api/health/
```

Resultado esperado:
```json
{
    "status": "ok",
    "banco": "conectado"
}
```

### Exemplos de Requisições

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"matricula": "12345", "senha": "123456"}'
```

#### Listar Eventos
```bash
curl http://localhost:8000/api/eventos/
```

#### Inscrever em Evento
```bash
curl -X POST http://localhost:8000/api/eventos/1/inscrever/ \
  -H "Content-Type: application/json" \
  -d '{"matricula": "12345"}'
```

### Próximos Passos

1. Integre os endpoints do backend com o frontend alterando as requisições em:
   - `assets/js/pages/login.js`
   - `assets/js/pages/cadastro.js`
   - `assets/js/pages/dashboard.js`
   - `assets/js/pages/criarEvento.js`
   - `assets/js/pages/certificados.js`
   - `assets/js/pages/qrCodePresenca.js`

2. O arquivo `assets/js/api.js` já contém todas as funções necessárias.

3. Certifique-se de que a frontend está acessando `http://localhost:8000` como base da API.

### Troubleshooting

#### Erro de conexão com banco de dados
- Verifique se MySQL está rodando
- Verifique as credenciais em `projeto/settings.py`
- Certifique-se de que o banco `database_beta_tcc` foi criado

#### CORS error
- As configurações de CORS já estão em `projeto/settings.py`
- Se receber erro CORS, verifique se `django-cors-headers` está instalado

#### Porta já em uso
- Se porta 8000 está em uso, inicie com porta diferente:
```bash
python manage.py runserver 0.0.0.0:8001
```
