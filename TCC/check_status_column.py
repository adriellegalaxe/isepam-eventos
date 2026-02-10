#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Check if evento table has Status column, add if missing"""

import mysql.connector

try:
    conn = mysql.connector.connect(
        host='localhost',
        user='beta_tcc_user',
        password='bcw,8907',
        database='database_beta_tcc',
        charset='utf8mb4',
        collation='utf8mb4_unicode_ci'
    )
    cursor = conn.cursor()
    
    # Check if Status column exists
    cursor.execute("""
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME='evento' AND COLUMN_NAME='Status'
    """)
    
    result = cursor.fetchone()
    
    if result:
        print("✓ Campo 'Status' já existe na tabela 'evento'")
    else:
        print("✗ Campo 'Status' NÃO existe, adicionando...")
        cursor.execute("""
            ALTER TABLE evento 
            ADD COLUMN Status ENUM('em_andamento', 'finalizado') DEFAULT 'em_andamento'
        """)
        conn.commit()
        print("✓ Campo 'Status' adicionado com sucesso")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Erro: {e}")
