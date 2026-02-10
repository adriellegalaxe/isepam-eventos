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
    cursor = conn.cursor(dictionary=True)
    
    print("="*80)
    print("DADOS NA TABELA usuario-cadastrado")
    print("="*80)
    cursor.execute("SELECT Matricula, Nome_Completo, Email, Funcao, LENGTH(Senha) as Senha_Len, Senha FROM `usuario-cadastrado`")
    
    for row in cursor.fetchall():
        print(f"Matricula: {row['Matricula']}")
        print(f"  Nome: {row['Nome_Completo']}")
        print(f"  Email: {row['Email']}")
        print(f"  Funcao: {row['Funcao']}")
        print(f"  Senha Length: {row['Senha_Len']}")
        print(f"  Senha: {row['Senha'][:50]}..." if row['Senha'] else "  Senha: (vazia/NULL)")
        print()
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ ERRO: {e}")
