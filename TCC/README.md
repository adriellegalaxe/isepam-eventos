# Sistema de Gerenciamento de Eventos ISEPAM

Este é um sistema web completo de gerenciamento de eventos para o Instituto Superior de Educação Professor Aldo Muylaert (ISEPAM). Desenvolvido em Python com Django (backend), MariaDB (banco de dados) e templates Django (frontend em português brasileiro). Inclui registro de usuários, criação de eventos/sessões, confirmação de presença via QR Code e geração automática de certificados em PDF.

## Funcionalidades Principais
- **Registro de Usuários**: Dois tipos (Estudantes e Funcionários: Professores/Coordenadores). Validação de CPF com aviso (não bloqueia registro). Verificação de email.
- **Eventos e Sessões**: Criação de eventos com cursos-alvo (Informática Técnica, Pedagogia ou ambos). Sessões com horários, palestrantes e cores automáticas baseadas no curso.
- **Permissões**: Apenas coordenadores podem criar eventos/sessões via painel admin.
- **Inscrição em Eventos**: Usuários podem se inscrever em eventos disponíveis.
- **Confirmação de Presença via QR Code**: Cada sessão gera um QR único. Escanear confirma presença e desbloqueia certificados.
- **Certificados PDF**: Geração automática após presença em todas as sessões do evento, com texto personalizado.
- **Páginas**: Início (eventos recentes/disponíveis), Certificados (com lista e filtros básicos), Meus QR Codes.
- **Idioma**: Toda a interface em português brasileiro.

## Pré-requisitos
- **Python 3.8+**: Baixe e instale do site oficial (https://www.python.org/).
- **MariaDB**: Banco de dados. Instale o MariaDB Server (https://mariadb.org/download/). Crie um banco de dados chamado `isepam_db` (ou outro nome, ajuste nas configurações).
- **Git**: Para clonar repositórios (opcional, se o projeto for versionado).
- **VS Code**: Recomendado para edição, com extensão Python instalada.
- **Bibliotecas Python**: Instaladas via pip (veja seção de instalação).

## Instalação e Configuração

### 1. Clonagem ou Download do Projeto
- Se o projeto estiver em um repositório Git, clone-o:
  ```
  git clone <URL_DO_REPOSITORIO>
  cd TCC
  ```
- Caso contrário, certifique-se de que os arquivos estão na pasta `C:\Users\walte\OneDrive\Documentos\Vida_Intelectual\Escola\Técnico\TCC`.

### 2. Criação e Ativação do Ambiente Virtual
- Abra o PowerShell no diretório do projeto.
- Crie um ambiente virtual:
  ```
  python -m venv venv
  ```
- Ative o ambiente virtual:
  ```
  .\venv\Scripts\activate
  ```
  - Se houver erro de política de execução, execute como administrador: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` e tente novamente.

### 3. Instalação das Dependências
- Com o ambiente virtual ativo, instale as bibliotecas:
  ```
  pip install django djangorestframework django-allauth qrcode[pil] reportlab validate-docbr mariadb
  ```
  - `django`: Framework principal.
  - `djangorestframework`: Para APIs (usado em algumas views).
  - `django-allauth`: Para autenticação e verificação de email.
  - `qrcode[pil]`: Para gerar QR Codes.
  - `reportlab`: Para gerar PDFs.
  - `validate-docbr`: Para validação de CPF.
  - `mariadb`: Conector para MariaDB.

### 4. Configuração do Banco de Dados
- Abra o MariaDB (via linha de comando ou ferramenta como HeidiSQL).
- Crie o banco de dados:
  ```
  CREATE DATABASE isepam_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
- No arquivo `isepam/settings.py`, localize a seção `DATABASES` e altere para MariaDB (substitua as credenciais se necessário):
  ```python
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
          'NAME': 'isepam_db',
          'USER': 'root',  # Seu usuário MariaDB
          'PASSWORD': 'sua_senha',  # Sua senha MariaDB
          'HOST': 'localhost',
          'PORT': '3306',
      }
  }
  ```
  - Se usar SQLite (padrão), mantenha como está, mas o projeto foi projetado para MariaDB.

### 5. Migrações do Banco de Dados
- Com ambiente virtual ativo, execute:
  ```
  python manage.py makemigrations
  python manage.py migrate
  ```
  - Isso cria as tabelas no banco (usuários, eventos, sessões, etc.).

### 6. Criação de Superusuário (Admin)
- Para acessar o painel admin (onde coordenadores criam eventos):
  ```
  python manage.py createsuperuser
  ```
  - Digite nome de usuário, email e senha. Defina o tipo como "Coordinator" manualmente no banco ou via admin.

### 7. Configuração de Email (Opcional, para Verificação)
- No `settings.py`, configure um backend de email (ex.: Gmail). Exemplo:
  ```python
  EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
  EMAIL_HOST = 'smtp.gmail.com'
  EMAIL_PORT = 587
  EMAIL_USE_TLS = True
  EMAIL_HOST_USER = 'seu_email@gmail.com'
  EMAIL_HOST_PASSWORD = 'sua_senha_app'  # Use senha de app, não a principal
  ```
  - Para desenvolvimento, use `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` para ver emails no console.

## Executando o Servidor
- Com ambiente virtual ativo e migrações feitas:
  ```
  python manage.py runserver
  ```
- O servidor roda em `http://127.0.0.1:8000/` (porta padrão 8000). Abra no navegador.
- Para parar: Ctrl+C no terminal.

## Estrutura dos Arquivos e Pastas
Aqui, explico o que cada arquivo/pasta faz, com detalhes. A estrutura é baseada em um projeto Django padrão.

- **`manage.py`**: Script principal para comandos Django (ex.: runserver, migrate). Executa tarefas administrativas.
- **`isepam/`**: Pasta principal do projeto Django.
  - **`__init__.py`**: Torna a pasta um módulo Python.
  - **`settings.py`**: Configurações globais (banco, apps instalados, middleware, etc.). Edite aqui para banco MariaDB ou email.
  - **`urls.py`**: Mapeia URLs para views (ex.: `/` para home, `/certificados/` para certificates).
  - **`wsgi.py`**: Para deploy em produção (WSGI).
  - **`asgi.py`**: Para deploy assíncrono (ASGI).
- **`events/`**: App principal para eventos.
  - **`models.py`**: Define modelos de dados (User, Event, Session, Certificate). Ex.: `Event` tem campos como name, courses, date.
  - **`views.py`**: Lógica das páginas (ex.: home_view mostra eventos recentes; register_event inscreve usuário).
  - **`urls.py`**: URLs específicas do app (ex.: `/eventos/register/<id>/`).
  - **`admin.py`**: Registra modelos no painel admin (coordenadores criam eventos aqui).
  - **`forms.py`**: Formulários para registro e inscrição.
  - **`templates/events/`**: Templates HTML (em português). Ex.: `home.html` para página inicial.
  - **`static/events/`**: Arquivos estáticos (CSS, JS, imagens). Ex.: CSS para cores de sessões.
  - **`migrations/`**: Arquivos de migração do banco (gerados automaticamente).
- **`requirements.txt`**: Lista de dependências (crie com `pip freeze > requirements.txt`).
- **`venv/`**: Ambiente virtual (não versionado, criado localmente).
- Outros arquivos: `db.sqlite3` (se usar SQLite), logs, etc.

## Como Usar o Sistema (Tutorial Passo a Passo)
1. **Acesse o Site**: Vá para `http://127.0.0.1:8000/`.
2. **Registro**: Clique em "Registrar". Escolha tipo (Estudante/Funcionário). Preencha campos. CPF inválido mostra aviso, mas permite continuar. Verifique email se configurado.
3. **Login**: Use credenciais após registro.
4. **Página Inicial**: Veja eventos recentes e disponíveis. Clique para se inscrever.
5. **Criar Eventos (Coordenadores)**: Acesse `/admin/` com superusuário. Adicione eventos/sessões. Cores: Azul escuro para Informática, Roxo para Pedagogia, Gradiente para ambos.
6. **QR Codes**: Após inscrição, vá para `/eventos/meus-qr/` para ver QR de cada sessão. "Escanear" (clique) confirma presença.
7. **Certificados**: Após todas as sessões confirmadas, acesse `/certificados/` para baixar PDF. Filtros básicos (expanda se necessário).
8. **Teste**: Crie dados de teste via admin. Simule escaneamento clicando nos QR.

## Testes
- **Unit Tests**: Execute `python manage.py test` (adicione testes em `events/tests.py`).
- **Manual**: Registre usuários, crie eventos, confirme presença, baixe certificados.
- **CPF**: Teste com CPFs válidos/inválidos (ex.: 123.456.789-00 é inválido).

## Problemas Comuns e Soluções
- **Erro de Importação**: Ative o venv e instale dependências.
- **Banco Não Conecta**: Verifique credenciais em `settings.py`.
- **Email Não Envia**: Use console backend para desenvolvimento.
- **Porta Ocupada**: `python manage.py runserver 8080`.

## Deploy em Produção (Básico)
- Use Gunicorn + Nginx. Configure `DEBUG=False` em `settings.py`.
- Para MariaDB em produção, use credenciais seguras.

Para dúvidas, consulte a documentação Django (https://docs.djangoproject.com/). Este README cobre tudo para facilitar seu TCC!