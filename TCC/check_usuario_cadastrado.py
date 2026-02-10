#!/usr/bin/env python
import mysql.connector

DB_CONFIG = {
    'host': 'localhost',
    'user': 'beta_tcc_user',
    'password': 'bcw,8907',
    'database': 'database_beta_tcc'
}

try:
    conn = mysql.connector.connect(**DB_CONFIG, charset='utf8mb4')
    cursor = conn.cursor()
    
    # Verificar estrutura da tabela
    print("="*60)
    print("ESTRUTURA DA TABELA usuario-cadastrado")
    print("="*60)
    cursor.execute("DESCRIBE `usuario-cadastrado`")
    for row in cursor.fetchall():
        print(row)
    
    print("\n" + "="*60)
    print("DADOS ATUAIS NA TABELA")
    print("="*60)
    cursor.execute("SELECT * FROM `usuario-cadastrado` LIMIT 5")
    columns = [desc[0] for desc in cursor.description]
    print("Colunas:", columns)
    for row in cursor.fetchall():
        print(row)
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ ERRO: {e}")
