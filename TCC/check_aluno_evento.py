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
    print("INSCRIÇÕES NA TABELA aluno_evento")
    print("="*80)
    
    cursor.execute("""
        SELECT 
            ae.Matricula_Usuario, 
            ae.ID_Evento, 
            e.Nome, 
            e.Data
        FROM aluno_evento ae
        LEFT JOIN evento e ON ae.ID_Evento = e.ID
        ORDER BY ae.Matricula_Usuario, ae.ID_Evento
    """)
    
    for row in cursor.fetchall():
        print(f"Matricula: {row['Matricula_Usuario']} → Evento {row['ID_Evento']} ({row['Nome']}, {row['Data']})")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ ERRO: {e}")
