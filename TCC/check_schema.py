#!/usr/bin/env python3
"""Verificar estrutura das tabelas do banco"""

import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'host': 'localhost',
    'user': 'beta_tcc_user',
    'password': 'bcw,8907',
    'database': 'database_beta_tcc',
    'charset': 'utf8mb4',
}

def show_table_structure():
    """Mostra a estrutura das tabelas"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Tabelas para verificar
        tables = ['usuario', 'evento', 'sessoes', 'aluno_evento']
        
        for table in tables:
            print(f"\n=== Estrutura da tabela {table} ===")
            cursor.execute(f"DESCRIBE {table}")
            columns = cursor.fetchall()
            for col in columns:
                print(f"{col[0]}: {col[1]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"✗ Erro: {e}")

if __name__ == '__main__':
    show_table_structure()
