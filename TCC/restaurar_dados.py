#!/usr/bin/env python3
"""Script para restaurar/corrigir dados com encoding UTF-8 correto"""

import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'host': 'localhost',
    'user': 'beta_tcc_user',
    'password': 'bcw,8907',
    'database': 'database_beta_tcc',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

def restaurar_dados():
    """Restaura dados de exemplo com encoding UTF-8 correto"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Limpar tabelas
        print("Limpando tabelas...")
        cursor.execute("DELETE FROM aluno_evento")
        cursor.execute("DELETE FROM sessoes")
        cursor.execute("DELETE FROM evento")
        cursor.execute("DELETE FROM `usuario-cadastrado`")
        
        # Inserir dados de teste
        print("Inserindo dados de exemplo com UTF-8...")
        
        # Usuários (CPF como INT, não string)
        usuarios = [
            (12345, 'João Silva', 12345678, 'joao@isepam.edu', 'Aluno', '123456'),
            (12346, 'Maria Santos', 12345679, 'maria@isepam.edu', 'Aluno', '123456'),
            (12347, 'Prof. Carlos', 12345680, 'carlos@isepam.edu', 'Professor', '123456'),
        ]
        
        for matricula, nome, cpf, email, funcao, senha in usuarios:
            cursor.execute(
                "INSERT INTO `usuario-cadastrado` (Matricula, Nome_Completo, CPF, Email, Funcao, Senha) VALUES (%s, %s, %s, %s, %s, %s)",
                (matricula, nome, cpf, email, funcao, senha)
            )
        
        # Eventos
        eventos = [
            ('Semana de Tecnologia e Inovação', '2026-03-15', 'Engenharia de Software, Ciência da Computação', 'Semana dedicada à inovação tecnológica'),
            ('Conferência de Inteligência Artificial', '2026-04-10', 'Ciência da Computação', 'Palestra sobre IA e Machine Learning'),
            ('Workshop de Desenvolvimento Web', '2026-05-20', 'Engenharia de Software', 'Aprenda as melhores práticas em desenvolvimento web'),
            ('Seminário de Gestão de Projetos', '2026-06-05', 'Administração', 'Metodologias ágeis e gestão eficiente'),
            ('Jornada de Sustentabilidade', '2026-07-12', 'Engenharia, Administração', 'Práticas sustentáveis nas empresas'),
            ('Congresso de Inovação e Empreendedorismo', '2026-08-22', 'Ciência da Computação, Administração', 'Pitches de startups e networking'),
            ('Festival de Programação', '2026-09-18', 'Ciência da Computação', 'Competição de programação e hackathon'),
            ('Simpósio de Pesquisa Acadêmica', '2026-10-10', 'Ciência da Computação, Engenharia', 'Apresentação de pesquisas dos alunos'),
        ]
        
        event_ids = []
        for nome, data, cursos, descricao in eventos:
            cursor.execute(
                "INSERT INTO evento (Nome, Data, Cursos, Descrição) VALUES (%s, %s, %s, %s)",
                (nome, data, cursos, descricao)
            )
            event_ids.append(cursor.lastrowid)
        
        # Sessões
        sessoes = [
            (event_ids[0], 'Abertura e Visão do Futuro', '09:00', '10:00', 'Prof. Carlos Silva', 'Boas-vindas e perspectivas da semana', event_ids[0]),
            (event_ids[0], 'Tendências em Tecnologia', '10:30', '12:00', 'Dra. Ana Santos', 'Discussão sobre tecnologias emergentes', event_ids[0]),
            (event_ids[1], 'Fundamentos de IA', '14:00', '15:30', 'Prof. João Luis', 'Introdução aos conceitos de IA', event_ids[1]),
            (event_ids[1], 'Machine Learning na Prática', '16:00', '17:30', 'Dr. Ricardo Costa', 'Casos de uso reais de ML', event_ids[1]),
        ]
        
        for nome, hora_inicio, hora_fim, palestrante, descricao, evento_id in sessoes:
            cursor.execute(
                "INSERT INTO sessoes (Nome, Hora_Inicio, Hora_Fim, Palestrantes, Descricao, ID_Evento) VALUES (%s, %s, %s, %s, %s, %s)",
                (nome, hora_inicio, hora_fim, palestrante, descricao, evento_id)
            )
        
        # Inscrições
        cursor.execute("INSERT INTO aluno_evento (Matricula_Usuario, ID_Evento) VALUES (%s, %s)", (12345, event_ids[0]))
        cursor.execute("INSERT INTO aluno_evento (Matricula_Usuario, ID_Evento) VALUES (%s, %s)", (12345, event_ids[1]))
        cursor.execute("INSERT INTO aluno_evento (Matricula_Usuario, ID_Evento) VALUES (%s, %s)", (12346, event_ids[0]))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✓ Dados restaurados com sucesso em UTF-8!")
        
    except Error as e:
        print(f"✗ Erro ao restaurar dados: {e}")
    except Exception as e:
        print(f"✗ Erro inesperado: {e}")

if __name__ == '__main__':
    print("=== Restaurando Dados com Encoding UTF-8 ===\n")
    restaurar_dados()
