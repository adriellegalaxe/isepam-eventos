#!/usr/bin/env python3
"""Script para corrigir encoding das tabelas do banco de dados"""

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

def fix_database_encoding():
    """Altera o encoding do banco e suas tabelas para UTF-8"""
    try:
        # Conexão sem specified charset primeiro
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
        )
        cursor = conn.cursor()
        
        # Alterar encoding do banco
        print("Alterando encoding do banco de dados...")
        cursor.execute(f"ALTER DATABASE {DB_CONFIG['database']} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print("✓ Banco de dados alterado para UTF-8")
        
        # Conectar ao banco
        cursor.execute(f"USE {DB_CONFIG['database']}")
        
        # Obter lista de tabelas
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        # Alterar cada tabela
        for table in tables:
            table_name = table[0]
            print(f"Alterando tabela {table_name}...")
            cursor.execute(f"ALTER TABLE {table_name} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✓ Tabela {table_name} alterada")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\n✓ Todas as tabelas foram convertidas para UTF-8 (utf8mb4)")
        print("✓ Encoding corrigido com sucesso!")
        
    except Error as e:
        print(f"✗ Erro ao corrigir encoding: {e}")
    except Exception as e:
        print(f"✗ Erro inesperado: {e}")

def test_encoding():
    """Testa se o encoding está funcionando corretamente"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        # Buscar um evento
        cursor.execute("SELECT * FROM evento LIMIT 1")
        evento = cursor.fetchone()
        
        if evento:
            print("\n--- Teste de Encoding ---")
            print(f"Nome do evento: {evento['Nome']}")
            print(f"Descrição: {evento['Descricao'][:100] if evento['Descricao'] else 'N/A'}")
            print("\nSe os acentos/caracteres especiais aparecem corretamente, o encoding está OK!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"✗ Erro ao testar encoding: {e}")

if __name__ == '__main__':
    print("=== Corrigindo Encoding do Banco de Dados ===\n")
    fix_database_encoding()
    test_encoding()
