"""Views da API de eventos"""

from django.http import JsonResponse, FileResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import json
import mysql.connector
from mysql.connector import Error
from datetime import datetime, date, timedelta
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO
from reportlab.lib.colors import HexColor
import os
import random
import string
from django.core.mail import send_mail
from django.conf import settings
import hashlib
import hmac
from datetime import timezone

def index(request):
    """Renderiza o index.html do frontend"""
    return render(request, 'index.html')

# Configuração do banco de dados
DB_CONFIG = {
    'host': 'localhost',
    'user': 'beta_tcc_user',
    'password': 'bcw,8907',
    'database': 'database_beta_tcc'
}

def get_db_connection():
    """Retorna uma conexão com MySQL"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG, charset='utf8mb4', collation='utf8mb4_unicode_ci')
        return connection
    except Error as e:
        print(f"Erro ao conectar: {e}")
        return None

def error_response(message, status=400):
    """Retorna uma resposta de erro JSON"""
    return JsonResponse({'erro': message}, status=status)

# ==================== NOVOS ENDPOINTS - AUTENTICAÇÃO COM CÓDIGO ====================

def _code_time_slot(now=None, window_minutes=5):
    now = now or datetime.now(timezone.utc)
    slot = int(now.timestamp() // (window_minutes * 60))
    return slot

def gerar_codigo_deterministico(matricula, now=None, window_minutes=5):
    """Gera um código numérico determinístico baseado em HMAC (não persistido).

    Código válido para o intervalo de `window_minutes`. Usa `AUTH_CODE_SECRET`
    em settings se disponível, ou `SECRET_KEY`.
    """
    secret = getattr(settings, 'AUTH_CODE_SECRET', None) or getattr(settings, 'SECRET_KEY', 'dev-secret')
    slot = _code_time_slot(now, window_minutes)
    msg = f"{matricula}:{slot}".encode('utf-8')
    key = secret.encode('utf-8') if isinstance(secret, str) else secret
    digest = hmac.new(key, msg, hashlib.sha256).hexdigest()
    # Use portion of digest to produce an 8-digit number
    num = int(digest[:16], 16) % 10**8
    return f"{num:08d}"

def verificar_codigo_deterministico(matricula, codigo_recebido, now=None, window_minutes=5, windows_to_check=1):
    """Verifica código aceitando janela atual e janelas adjacentes.

    windows_to_check: número de janelas anteriores a verificar (incluso 0 para só atual)
    
    DEVELOPMENT: o código '12345678' é sempre aceito como bypass.
    """
    # Master code always accepted (development/testing)
    if hmac.compare_digest(str(codigo_recebido), '12345678'):
        return True
    
    now = now or datetime.now(timezone.utc)
    for delta in range(0, windows_to_check + 1):
        check_time = now - timedelta(minutes=delta * window_minutes)
        esperado = gerar_codigo_deterministico(matricula, check_time, window_minutes)
        if hmac.compare_digest(esperado, str(codigo_recebido)):
            return True
    return False

def enviar_codigo_por_email(email, matricula, codigo, nome_completo):
    """Envia o código de acesso por email"""
    try:
        # Se não estiver configurado SMTP real, apenas log
        subject = f"Código de Acesso ao Sistema de Eventos - {codigo}"
        message = f"""
Olá {nome_completo},

Seu código de acesso é: {codigo}

Este código é válido por 30 minutos.
Matrícula: {matricula}

Se você não solicitou este acesso, ignore este email.

Atenciosamente,
Sistema de Gestão de Eventos
"""
        
        # Tenta enviar via Django mail settings
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            print(f"[EMAIL] Código enviado para {email}")
        except:
            # Se falhar, apenas printa (para desenvolvimento)
            print(f"[DEV MODE] Código {codigo} para {email} ({matricula})")
        
        return True
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return False

@csrf_exempt
@require_http_methods(["POST"])
def solicit_access(request):
    """Solicita acesso via matrícula - envia código por email"""
    try:
        data = json.loads(request.body)
        matricula = data.get('matricula')
        
        if not matricula:
            return error_response('Matrícula é obrigatória')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        
        # Buscar usuário na tabela matriculados (dados da universidade)
        cursor.execute(
            "SELECT Matricula, Nome_Completo, `E-mail` AS Email, Funcao FROM matriculados WHERE Matricula = %s",
            (matricula,)
        )
        usuario = cursor.fetchone()
        
        if not usuario:
            cursor.close()
            conn.close()
            return error_response('Matrícula não encontrada no sistema', 404)
        
        # Gerar código determinístico (não armazenado em banco)
        codigo = gerar_codigo_deterministico(matricula, window_minutes=5)

        # Enviar email com código
        enviar_codigo_por_email(
            usuario['Email'],
            matricula,
            codigo,
            usuario['Nome_Completo']
        )

        cursor.close()
        conn.close()

        response = {
            'sucesso': True,
            'mensagem': f'Código de acesso enviado para {usuario["Email"]}',
            'email': usuario['Email']
        }
        # Em DEBUG, retornar código no response para facilitar testes locais
        if getattr(settings, 'DEBUG', False):
            response['dev_code'] = codigo

        return JsonResponse(response)
        
    except Exception as e:
        return error_response(f'Erro ao solicitar acesso: {str(e)}', 500)

@csrf_exempt
@require_http_methods(["POST"])
def verify_code(request):
    """Verifica o código de acesso"""
    try:
        data = json.loads(request.body)
        matricula = data.get('matricula')
        codigo = data.get('codigo')
        
        if not matricula or not codigo:
            return error_response('Matrícula e código são obrigatórios')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        
        # Buscar o código mais recente não utilizado
        # Verificar código usando função determinística (não usamos DB)
        valido = verificar_codigo_deterministico(matricula, codigo, window_minutes=5, windows_to_check=1)
        if not valido:
            cursor.close()
            conn.close()
            return error_response('Código inválido ou expirado', 401)

        cursor.close()
        conn.close()

        return JsonResponse({
            'sucesso': True,
            'mensagem': 'Código válido. Defina sua senha.',
            'matricula': matricula
        })
        
    except Exception as e:
        return error_response(f'Erro ao verificar código: {str(e)}', 500)

@csrf_exempt
@require_http_methods(["POST"])
def set_password(request):
    """Define a senha do usuário e cria a conta em usuario-cadastrado"""
    try:
        data = json.loads(request.body)
        matricula = data.get('matricula')
        codigo = data.get('codigo')
        senha = data.get('senha')
        
        if not matricula or not codigo or not senha:
            return error_response('Matrícula, código e senha são obrigatórios')
        
        if len(senha) < 6:
            return error_response('Senha deve ter no mínimo 6 caracteres')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        
        # Validar código usando versão determinística
        valido = verificar_codigo_deterministico(matricula, codigo, window_minutes=5, windows_to_check=1)
        if not valido:
            cursor.close()
            conn.close()
            return error_response('Código inválido ou expirado', 401)
        
        # Buscar dados do usuário em matriculados
        cursor.execute(
            "SELECT Nome_Completo, `E-mail` AS Email, Funcao FROM matriculados WHERE Matricula = %s",
            (matricula,)
        )
        usuario_matriculado = cursor.fetchone()
        
        if not usuario_matriculado:
            cursor.close()
            conn.close()
            return error_response('Usuário não encontrado', 404)
        
        # Verificar se usuário já existe em usuario-cadastrado
        cursor.execute(
            "SELECT Matricula FROM `usuario-cadastrado` WHERE Matricula = %s",
            (matricula,)
        )
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Usuário já possui cadastro', 409)
        
        # Criar hash da senha
        senha_hash = hashlib.sha256(str(senha).encode()).hexdigest()
        
        # Inserir na tabela usuario-cadastrado com TODOS os campos
        try:
            cursor.execute(
                """INSERT INTO `usuario-cadastrado` 
                   (Matricula, Nome_Completo, CPF, Email, Funcao, Senha) 
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (matricula, usuario_matriculado['Nome_Completo'], 0, usuario_matriculado['Email'], usuario_matriculado['Funcao'], senha_hash)
            )
            conn.commit()
        except Exception as insert_error:
            conn.rollback()
            # Retornar o erro exato do MySQL para debug
            return error_response(f'Erro ao criar conta: {str(insert_error)}', 500)
        
        cursor.close()
        conn.close()
        
        # Sucesso - usuário pode agora fazer login
        return JsonResponse({
            'sucesso': True,
            'mensagem': 'Conta criada com sucesso! Você pode fazer login agora.',
            'usuario': {
                'matricula': matricula,
                'nome': usuario_matriculado['Nome_Completo'],
                'email': usuario_matriculado['Email'],
                'funcao': usuario_matriculado['Funcao']
            }
        }, status=201)
        
    except Exception as e:
        return error_response(f'Erro ao definir senha: {str(e)}', 500)


# ==================== AUTENTICAÇÃO ====================

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    """Login do usuário com matrícula e senha"""
    try:
        data = json.loads(request.body)
        matricula = data.get('matricula')
        senha = data.get('senha')
        codigo = data.get('codigo')
        
        if not matricula or (not senha and not codigo):
            return error_response('Matrícula e senha ou código são obrigatórios')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)

        cursor = conn.cursor(dictionary=True)

        # Autenticação por código (senha não persistida) - preferida se 'codigo' enviado
        if codigo:
            valido = verificar_codigo_deterministico(matricula, codigo, window_minutes=5, windows_to_check=1)
            if not valido:
                cursor.close()
                conn.close()
                return error_response('Código inválido ou expirado', 401)

            # Buscar informações completas em matriculados
            cursor.execute(
                "SELECT Nome_Completo, `E-mail` AS Email, Funcao FROM matriculados WHERE Matricula = %s",
                (matricula,)
            )
            matriculado = cursor.fetchone()

            cursor.close()
            conn.close()

            if not matriculado:
                return error_response('Dados do usuário não encontrados', 404)

            return JsonResponse({
                'sucesso': True,
                'usuario': {
                    'id': matricula,
                    'nome': matriculado['Nome_Completo'],
                    'email': matriculado['Email'],
                    'matricula': matricula,
                    'funcao': matriculado['Funcao']
                }
            })

        # Fallback: autenticação por senha (se existir tabela usuario)
        if not senha:
            cursor.close()
            conn.close()
            return error_response('Matrícula e senha ou código são obrigatórios')

        # Buscar em usuario
        cursor.execute("SELECT * FROM `usuario-cadastrado` WHERE Matricula = %s", (matricula,))
        usuario = cursor.fetchone()

        if not usuario:
            cursor.close()
            conn.close()
            return error_response('Matrícula ou senha inválidos', 401)

        # Validar senha com hash
        senha_hash = hashlib.sha256(str(senha).encode()).hexdigest()
        if usuario['Senha'] != senha_hash:
            cursor.close()
            conn.close()
            return error_response('Matrícula ou senha inválidos', 401)

        # Usar os dados do usuario-cadastrado que já temos
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'usuario': {
                'id': matricula,
                'nome': usuario['Nome_Completo'],
                'email': usuario['Email'],
                'matricula': matricula,
                'funcao': usuario['Funcao']
            }
        })
        
    except Exception as e:
        return error_response(f'Erro ao fazer login: {str(e)}', 500)

# ==================== EVENTOS ====================


@require_http_methods(["GET"])
def listar_eventos(request):
    """Lista todos os eventos"""
    try:
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM evento ORDER BY Data DESC")
        eventos = cursor.fetchall()
        
        # Buscar sessões para cada evento
        for evento in eventos:
            cursor.execute("SELECT * FROM sessoes WHERE ID_Evento = %s", (evento['ID'],))
            evento['sessoes'] = cursor.fetchall()
            evento['cursos'] = evento['Cursos'].split(',') if evento['Cursos'] else []
            
            # Serializar datas
            evento['Data'] = evento['Data'].isoformat() if hasattr(evento['Data'], 'isoformat') else str(evento['Data'])
            for sessao in evento['sessoes']:
                if 'Hora_Inicio' in sessao and hasattr(sessao['Hora_Inicio'], 'isoformat'):
                    sessao['Hora_Inicio'] = sessao['Hora_Inicio'].isoformat()
                if 'Hora_Fim' in sessao and hasattr(sessao['Hora_Fim'], 'isoformat'):
                    sessao['Hora_Fim'] = sessao['Hora_Fim'].isoformat()
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'eventos': eventos
        })
        
    except Exception as e:
        return error_response(f'Erro ao listar eventos: {str(e)}', 500)

@require_http_methods(["GET"])
def obter_evento(request, evento_id):
    """Obtém um evento específico"""
    try:
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM evento WHERE ID = %s", (evento_id,))
        evento = cursor.fetchone()
        
        if not evento:
            cursor.close()
            conn.close()
            return error_response('Evento não encontrado', 404)
        
        # Buscar sessões
        cursor.execute("SELECT * FROM sessoes WHERE ID_Evento = %s", (evento_id,))
        evento['sessoes'] = cursor.fetchall()
        evento['cursos'] = evento['Cursos'].split(',') if evento['Cursos'] else []
        
        # Serializar datas
        evento['Data'] = evento['Data'].isoformat() if hasattr(evento['Data'], 'isoformat') else str(evento['Data'])
        if 'Data_Fim' in evento and evento['Data_Fim'] is not None:
            evento['data_fim'] = evento['Data_Fim'].isoformat() if hasattr(evento['Data_Fim'], 'isoformat') else str(evento['Data_Fim'])
        if evento.get('Data_Fim'):
            evento['Data_Fim'] = evento['Data_Fim'].isoformat() if hasattr(evento['Data_Fim'], 'isoformat') else str(evento['Data_Fim'])
        for sessao in evento['sessoes']:
            if 'Hora_Inicio' in sessao and sessao['Hora_Inicio'] is not None:
                try:
                    sessao['Hora_Inicio'] = sessao['Hora_Inicio'].isoformat() if hasattr(sessao['Hora_Inicio'], 'isoformat') else str(sessao['Hora_Inicio'])
                except Exception:
                    sessao['Hora_Inicio'] = str(sessao['Hora_Inicio'])
            if 'Hora_Fim' in sessao and sessao['Hora_Fim'] is not None:
                try:
                    sessao['Hora_Fim'] = sessao['Hora_Fim'].isoformat() if hasattr(sessao['Hora_Fim'], 'isoformat') else str(sessao['Hora_Fim'])
                except Exception:
                    sessao['Hora_Fim'] = str(sessao['Hora_Fim'])
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'evento': evento
        })
        
    except Exception as e:
        return error_response(f'Erro ao obter evento: {str(e)}', 500)

@csrf_exempt
@require_http_methods(["POST"])
def criar_evento(request):
    """Cria um novo evento"""
    try:
        data = json.loads(request.body)
        
        if not data.get('nome') or not data.get('data'):
            return error_response('Nome e data são obrigatórios')
        
        if not data.get('data_fim'):
            return error_response('Data de fim é obrigatória')
        
        # Validar datas
        try:
            data_inicio = datetime.fromisoformat(data['data'])
            data_fim = datetime.fromisoformat(data['data_fim'])
            agora = datetime.now()
        except:
            return error_response('Formato de data inválido')
        
        if data_inicio < agora:
            return error_response('A data do evento não pode ser no passado')
        
        if data_fim <= data_inicio:
            return error_response('A data de fim deve ser depois da data de início')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor()
        
        # Inserir evento
        cursor.execute("""
            INSERT INTO evento (Nome, Cursos, Data, Data_Fim, `Descrição`, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data['nome'],
            data.get('cursos', ''),
            data['data'],
            data['data_fim'],
            data.get('descricao', ''),
            'aberto'
        ))
        
        evento_id = cursor.lastrowid
        
        # Inserir sessões
        if 'sessoes' in data and data['sessoes']:
            for sessao in data['sessoes']:
                # Validar horários das sessões
                try:
                    hora_inicio = datetime.fromisoformat(sessao.get('hora_inicio', ''))
                    hora_fim = datetime.fromisoformat(sessao.get('hora_fim', ''))
                    
                    if hora_inicio < agora:
                        cursor.close()
                        conn.close()
                        return error_response(f'Sessão "{sessao.get("nome")}" tem data/hora no passado')
                    
                    if hora_fim <= hora_inicio:
                        cursor.close()
                        conn.close()
                        return error_response(f'Em "{sessao.get("nome")}": hora de fim deve ser depois da hora de início')
                except ValueError:
                    cursor.close()
                    conn.close()
                    return error_response(f'Formato de data/hora inválido em "{sessao.get("nome")}"')
                
                # Converter formato ISO para formato MySQL (YYYY-MM-DD HH:MM:SS)
                hora_inicio_str = hora_inicio.strftime('%Y-%m-%d %H:%M:%S')
                hora_fim_str = hora_fim.strftime('%Y-%m-%d %H:%M:%S')
                
                cursor.execute("""
                    INSERT INTO sessoes (Nome, Palestrantes, Hora_Inicio, Hora_Fim, Descricao, ID_Evento)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    sessao.get('nome'),
                    sessao.get('palestrantes'),
                    hora_inicio_str,
                    hora_fim_str,
                    sessao.get('descricao'),
                    evento_id
                ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'evento_id': evento_id
        }, status=201)
        
    except Exception as e:
        return error_response(f'Erro ao criar evento: {str(e)}', 500)

@csrf_exempt
@require_http_methods(["PUT"])
def atualizar_evento(request, evento_id):
    """Atualiza um evento existente"""
    try:
        data = json.loads(request.body)
        
        if not data.get('nome') or not data.get('data'):
            return error_response('Nome e data são obrigatórios')
        
        if not data.get('data_fim'):
            return error_response('Data de fim é obrigatória')
        
        # Validar datas
        try:
            data_inicio = datetime.fromisoformat(data['data'])
            data_fim = datetime.fromisoformat(data['data_fim'])
            agora = datetime.now()
        except:
            return error_response('Formato de data inválido')
        
        if data_inicio < agora:
            return error_response('A data do evento não pode ser no passado')
        
        if data_fim <= data_inicio:
            return error_response('A data de fim deve ser depois da data de início')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor()
        
        # Verificar se evento existe
        cursor.execute("SELECT ID FROM evento WHERE ID = %s", (evento_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Evento não encontrado', 404)
        
        # Atualizar evento
        cursor.execute("""
            UPDATE evento 
            SET Nome = %s, Cursos = %s, Data = %s, Data_Fim = %s, `Descrição` = %s
            WHERE ID = %s
        """, (
            data['nome'],
            data.get('cursos', ''),
            data['data'],
            data['data_fim'],
            data.get('descricao', ''),
            evento_id
        ))
        
        # Deletar sessões antigas
        cursor.execute("DELETE FROM sessoes WHERE ID_Evento = %s", (evento_id,))
        
        # Inserir novas sessões
        if 'sessoes' in data and data['sessoes']:
            for sessao in data['sessoes']:
                # Validar horários das sessões
                try:
                    hora_inicio = datetime.fromisoformat(sessao.get('hora_inicio', ''))
                    hora_fim = datetime.fromisoformat(sessao.get('hora_fim', ''))
                    
                    if hora_inicio < agora:
                        cursor.close()
                        conn.close()
                        return error_response(f'Sessão "{sessao.get("nome")}" tem data/hora no passado')
                    
                    if hora_fim <= hora_inicio:
                        cursor.close()
                        conn.close()
                        return error_response(f'Em "{sessao.get("nome")}": hora de fim deve ser depois da hora de início')
                except ValueError:
                    cursor.close()
                    conn.close()
                    return error_response(f'Formato de data/hora inválido em "{sessao.get("nome")}"')
                
                # Converter formato ISO para formato MySQL (YYYY-MM-DD HH:MM:SS)
                hora_inicio_str = hora_inicio.strftime('%Y-%m-%d %H:%M:%S')
                hora_fim_str = hora_fim.strftime('%Y-%m-%d %H:%M:%S')
                
                cursor.execute("""
                    INSERT INTO sessoes (Nome, Palestrantes, Hora_Inicio, Hora_Fim, Descricao, ID_Evento)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    sessao.get('nome'),
                    sessao.get('palestrantes'),
                    hora_inicio_str,
                    hora_fim_str,
                    sessao.get('descricao'),
                    evento_id
                ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'evento_id': evento_id,
            'mensagem': 'Evento atualizado com sucesso'
        }, status=200)
        
    except Exception as e:
        return error_response(f'Erro ao atualizar evento: {str(e)}', 500)


@csrf_exempt
@require_http_methods(["DELETE"])
def deletar_evento(request, evento_id):
    """Deleta um evento se ele ainda não terminou"""
    try:
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM evento WHERE ID = %s", (evento_id,))
        evento = cursor.fetchone()

        if not evento:
            cursor.close()
            conn.close()
            return error_response('Evento não encontrado', 404)

        # Determinar se o evento já terminou (usar Data_Fim se existir)
        data_fim = evento.get('Data_Fim') or evento.get('Data')
        try:
            if hasattr(data_fim, 'timestamp'):
                fim_ts = data_fim
            else:
                fim_ts = datetime.fromisoformat(str(data_fim))
        except Exception:
            fim_ts = None

        agora = datetime.now()
        if fim_ts and fim_ts < agora:
            cursor.close()
            conn.close()
            return error_response('Evento já encerrado e não pode ser deletado', 400)

        # Deletar inscrições, sessoes e o evento
        cursor.execute("DELETE FROM aluno_evento WHERE ID_Evento = %s", (evento_id,))
        cursor.execute("DELETE FROM sessoes WHERE ID_Evento = %s", (evento_id,))
        cursor.execute("DELETE FROM evento WHERE ID = %s", (evento_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return JsonResponse({'sucesso': True, 'mensagem': 'Evento deletado com sucesso'})

    except Exception as e:
        return error_response(f'Erro ao deletar evento: {str(e)}', 500)

# ==================== INSCRIÇÕES ====================

@csrf_exempt
@require_http_methods(["POST"])
def inscrever_evento(request, evento_id):
    """Inscrever aluno em um evento"""
    try:
        data = json.loads(request.body)
        matricula = data.get('matricula')
        
        if not matricula:
            return error_response('Matrícula é obrigatória')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor()
        
        # Verificar se evento existe
        cursor.execute("SELECT ID FROM evento WHERE ID = %s", (evento_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Evento não encontrado', 404)
        
        # Verificar se usuário existe
        cursor.execute("SELECT Matricula FROM `usuario-cadastrado` WHERE Matricula = %s", (matricula,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Usuário não encontrado', 404)
        
        # Verificar se já está inscrito
        cursor.execute("""
            SELECT * FROM aluno_evento 
            WHERE Matricula_Usuario = %s AND ID_Evento = %s
        """, (matricula, evento_id))
        
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Já inscrito neste evento', 409)
        
        # Inserir inscrição
        cursor.execute("""
            INSERT INTO aluno_evento (Matricula_Usuario, ID_Evento)
            VALUES (%s, %s)
        """, (matricula, evento_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'mensagem': 'Inscrito no evento com sucesso'
        }, status=201)
        
    except Exception as e:
        return error_response(f'Erro ao inscrever: {str(e)}', 500)

@csrf_exempt
@require_http_methods(["POST"])
def desinscrever_evento(request, evento_id):
    """Desinscrever aluno de um evento"""
    try:
        data = json.loads(request.body)
        matricula = data.get('matricula')
        
        if not matricula:
            return error_response('Matrícula é obrigatória')
        
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor()
        
        # Verificar se evento existe
        cursor.execute("SELECT ID FROM evento WHERE ID = %s", (evento_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Evento não encontrado', 404)
        
        # Verificar se usuário existe
        cursor.execute("SELECT Matricula FROM `usuario-cadastrado` WHERE Matricula = %s", (matricula,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Usuário não encontrado', 404)
        
        # Verificar se está inscrito
        cursor.execute("""
            SELECT * FROM aluno_evento 
            WHERE Matricula_Usuario = %s AND ID_Evento = %s
        """, (matricula, evento_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return error_response('Não está inscrito neste evento', 404)
        
        # Deletar inscrição
        cursor.execute("""
            DELETE FROM aluno_evento
            WHERE Matricula_Usuario = %s AND ID_Evento = %s
        """, (matricula, evento_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'mensagem': 'Desinscrito do evento com sucesso'
        }, status=200)
        
    except Exception as e:
        return error_response(f'Erro ao desinscrever: {str(e)}', 500)

@require_http_methods(["GET"])
def listar_eventos_usuario(request, matricula):
    """Lista eventos em que o usuário está inscrito"""
    try:
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.* FROM evento e
            INNER JOIN aluno_evento ae ON e.ID = ae.ID_Evento
            WHERE ae.Matricula_Usuario = %s
            ORDER BY e.Data DESC
        """, (matricula,))
        
        eventos = cursor.fetchall()
        
        # Buscar sessões para cada evento
        for evento in eventos:
            cursor.execute("SELECT * FROM sessoes WHERE ID_Evento = %s", (evento['ID'],))
            evento['sessoes'] = cursor.fetchall()
            evento['cursos'] = evento['Cursos'].split(',') if evento['Cursos'] else []
            
            # Serializar datas
            evento['Data'] = evento['Data'].isoformat() if hasattr(evento['Data'], 'isoformat') else str(evento['Data'])
            for sessao in evento['sessoes']:
                if 'Hora_Inicio' in sessao and hasattr(sessao['Hora_Inicio'], 'isoformat'):
                    sessao['Hora_Inicio'] = sessao['Hora_Inicio'].isoformat()
                if 'Hora_Fim' in sessao and hasattr(sessao['Hora_Fim'], 'isoformat'):
                    sessao['Hora_Fim'] = sessao['Hora_Fim'].isoformat()
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'eventos': eventos
        })
        
    except Exception as e:
        return error_response(f'Erro ao listar eventos: {str(e)}', 500)

# ==================== CERTIFICADOS ====================

@require_http_methods(["GET"])
def listar_certificados(request, matricula):
    """Lista certificados do usuário"""
    try:
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.* FROM evento e
            INNER JOIN aluno_evento ae ON e.ID = ae.ID_Evento
            WHERE ae.Matricula_Usuario = %s
            ORDER BY e.Data DESC
        """, (matricula,))
        
        eventos = cursor.fetchall()
        
        certificados = []
        today = date.today()
        
        for idx, evento in enumerate(eventos):
            # Verificar se o evento já passou (data menor que hoje)
            evento_date = evento['Data']
            if hasattr(evento_date, 'date'):
                evento_date = evento_date.date()
            
            # FILTRAR: Apenas eventos que JÁ PASSARAM
            if evento_date >= today:
                # Evento ainda não passou, não incluir no certificado
                continue
            
            certificados.append({
                'id': idx + 1,
                'evento_id': evento['ID'],
                'evento_nome': evento['Nome'],
                'data': evento['Data'].isoformat() if hasattr(evento['Data'], 'isoformat') else str(evento['Data']),
                'carga_horaria': 8,
                'cursos': evento['Cursos'],
                'status': 'finalizado',
                'numero_certificado': f"CERT-{evento['ID']}-{matricula}"
            })
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'certificados': certificados
        })
        
    except Exception as e:
        return error_response(f'Erro ao listar certificados: {str(e)}', 500)

# ==================== QR CODE ====================

@require_http_methods(["GET"])
def gerar_qrcode_data(request, evento_id, sessao_id):
    """Retorna dados para gerar QR code"""
    try:
        # Verificar cabeçalhos informando o usuário (frontend deve enviar X-Usuario-Funcao)
        user_funcao = None
        try:
            # Django disponibiliza headers em request.META com prefixo HTTP_
            user_funcao = request.META.get('HTTP_X_USUARIO_FUNCAO') or request.headers.get('X-Usuario-Funcao') if hasattr(request, 'headers') else None
            if user_funcao:
                user_funcao = user_funcao.strip().lower()
        except Exception:
            user_funcao = None

        if not user_funcao or user_funcao != 'coordenador':
            return error_response('Acesso negado: apenas coordenadores podem gerar QR Codes', 403)

        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT s.* FROM sessoes s
            WHERE s.ID = %s AND s.ID_Evento = %s
        """, (sessao_id, evento_id))
        
        sessao = cursor.fetchone()
        if not sessao:
            cursor.close()
            conn.close()
            return error_response('Sessão não encontrada', 404)

        # Verificar se o evento ainda está ativo (data do evento >= hoje)
        cursor.execute("SELECT Data FROM evento WHERE ID = %s", (evento_id,))
        evento = cursor.fetchone()
        if not evento:
            cursor.close()
            conn.close()
            return error_response('Evento não encontrado', 404)

        evento_data = evento.get('Data')
        if hasattr(evento_data, 'date'):
            evento_date_only = evento_data.date() if isinstance(evento_data, datetime) else evento_data
        else:
            evento_date_only = evento_data

        today = date.today()
        try:
            if evento_date_only < today:
                cursor.close()
                conn.close()
                return error_response('Evento finalizado - não é possível gerar QR Code', 403)
        except Exception:
            # se falhar na comparação, prosseguir com cuidado
            pass
        
        qr_data = {
            'evento_id': evento_id,
            'sessao_id': sessao_id,
            'sessao_nome': sessao['Nome'],
            'url': f"https://isepam.edu.br/presenca?evento={evento_id}&sessao={sessao_id}&timestamp={datetime.now().isoformat()}"
        }
        
        cursor.close()
        conn.close()
        
        return JsonResponse({
            'sucesso': True,
            'qr_data': qr_data
        })
        
    except Exception as e:
        return error_response(f'Erro ao gerar QR: {str(e)}', 500)

@require_http_methods(["GET"])
def gerar_certificado(request, matricula, evento_id):
    """Gera um certificado em PDF para um evento"""
    try:
        # Conectar ao banco
        conn = get_db_connection()
        if not conn:
            return error_response('Erro ao conectar ao banco', 500)
        
        cursor = conn.cursor(dictionary=True)
        
        # Buscar dados do usuário
        cursor.execute("SELECT * FROM `usuario-cadastrado` WHERE Matricula = %s", (matricula,))
        usuario = cursor.fetchone()
        
        if not usuario:
            cursor.close()
            conn.close()
            return error_response('Usuário não encontrado', 404)
        
        # Buscar dados do evento
        cursor.execute("SELECT * FROM evento WHERE ID = %s", (evento_id,))
        evento = cursor.fetchone()
        
        if not evento:
            cursor.close()
            conn.close()
            return error_response('Evento não encontrado', 404)
        
        # Verificar se usuário está inscrito
        cursor.execute(
            "SELECT * FROM aluno_evento WHERE Matricula_Usuario = %s AND ID_Evento = %s",
            (matricula, evento_id)
        )
        inscricao = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not inscricao:
            return error_response('Usuário não está inscrito neste evento', 403)
        
        # Gerar PDF
        buffer = BytesIO()
        pdf = gerar_pdf_certificado(usuario, evento, matricula, evento_id)
        
        # Retornar PDF como download
        response = FileResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="certificado_{matricula}_{evento_id}.pdf"'
        
        return response
        
    except Exception as e:
        return error_response(f'Erro ao gerar certificado: {str(e)}', 500)


def gerar_pdf_certificado(usuario, evento, matricula, evento_id):
    """Gera o PDF do certificado"""
    buffer = BytesIO()
    
    # Criar PDF em formato paisagem
    pdf = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)
    
    # Fundo colorido
    pdf.setFillColor(HexColor('#F2F2F2'))
    pdf.rect(0, 0, width, height, fill=1)
    
    # Borda decorativa
    pdf.setStrokeColor(HexColor('#1E3A8A'))  # Azul escuro (blue-900)
    pdf.setLineWidth(5)
    pdf.rect(0.5*inch, 0.5*inch, width-inch, height-inch)
    
    # Cor do texto
    pdf.setFillColor(HexColor('#000000'))
    
    # Título
    pdf.setFont("Helvetica-Bold", 32)
    pdf.drawCentredString(width/2, height - 1.5*inch, "CERTIFICADO")
    
    # Subtítulo
    pdf.setFont("Helvetica", 14)
    pdf.setFillColor(HexColor('#1E3A8A'))
    pdf.drawCentredString(width/2, height - 2*inch, "de Participação")
    
    pdf.setFillColor(HexColor('#000000'))
    
    # Texto principal
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(width/2, height - 2.8*inch, "Certificamos que")
    
    # Nome do participante
    pdf.setFont("Helvetica-Bold", 16)
    nome = usuario.get('Nome_Completo', '').upper() or "PARTICIPANTE"
    pdf.drawCentredString(width/2, height - 3.4*inch, nome)
    
    # Texto descritivo
    pdf.setFont("Helvetica", 11)
    pdf.drawCentredString(width/2, height - 4.1*inch, "participou com êxito do evento")
    
    # Nome do evento
    pdf.setFont("Helvetica-Bold", 14)
    nome_evento = evento.get('Nome', '').upper() or "EVENTO"
    # Quebrar em múltiplas linhas se necessário
    if len(nome_evento) > 60:
        meio = len(nome_evento) // 2
        ultimo_espaco = nome_evento.rfind(' ', 0, meio)
        if ultimo_espaco > 0:
            linha1 = nome_evento[:ultimo_espaco]
            linha2 = nome_evento[ultimo_espaco+1:]
            pdf.drawCentredString(width/2, height - 4.7*inch, linha1)
            pdf.drawCentredString(width/2, height - 5.1*inch, linha2)
        else:
            pdf.drawCentredString(width/2, height - 4.7*inch, nome_evento)
    else:
        pdf.drawCentredString(width/2, height - 4.7*inch, nome_evento)
    
    # Data do evento
    pdf.setFont("Helvetica", 10)
    data_obj = evento.get('Data')
    if hasattr(data_obj, 'strftime'):
        # É um datetime ou date object
        data_str = data_obj.strftime('%d de %B de %Y')
    else:
        # É uma string
        data_str = str(data_obj)
    
    # Converter meses para português
    meses = {
        'January': 'janeiro', 'February': 'fevereiro', 'March': 'março',
        'April': 'abril', 'May': 'maio', 'June': 'junho',
        'July': 'julho', 'August': 'agosto', 'September': 'setembro',
        'October': 'outubro', 'November': 'novembro', 'December': 'dezembro'
    }
    for en, pt in meses.items():
        data_str = data_str.replace(en, pt)
    
    pdf.drawCentredString(width/2, height - 5.8*inch, f"Emitido em: {data_str}")
    
    # Número do certificado
    pdf.setFont("Helvetica", 9)
    numero_cert = f"CERT-{evento_id}-{matricula}"
    pdf.drawCentredString(width/2, 0.8*inch, f"Certificado: {numero_cert}")
    
    # Rodapé
    pdf.setFont("Helvetica", 9)
    pdf.setFillColor(HexColor('#808080'))
    pdf.drawCentredString(width/2, 0.4*inch, "ISEPAM - Instituto Superior de Educação")
    
    pdf.save()
    buffer.seek(0)
    return buffer


# ==================== HEALTH CHECK ====================

@require_http_methods(["GET"])
def health_check(request):
    """Verifica se o backend está funcionando"""
    conn = get_db_connection()
    if conn:
        conn.close()
        return JsonResponse({'status': 'ok', 'banco': 'conectado'})
    else:
        return JsonResponse({'status': 'erro', 'banco': 'desconectado'}, status=500)
