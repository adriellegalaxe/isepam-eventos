#!/usr/bin/env python3
"""Verificar e corrigir problemas de múltiplas PRIMARY KEYS"""

import mysql.connector

DB_CONFIG = {
    'host': 'localhost',
    'user': 'beta_tcc_user',
    'password': 'bcw,8907',
    'database': 'database_beta_tcc',
    'charset': 'utf8mb4',
}

def fix_evento():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Ver constraints de evento
        print("Verificando índices de evento...")
        cursor.execute("SHOW INDEXES FROM evento")
        indices = cursor.fetchall()
        for idx in indices:
            print(f"  {idx[2]} - {idx[4]}")
        
        # Dropar todas as constraints
        print("\nRemovendo PRIMARY KEY de evento...")
        try:
            cursor.execute("ALTER TABLE evento DROP PRIMARY KEY, DROP PRIMARY KEY")
        except:
            try:
                cursor.execute("ALTER TABLE evento DROP PRIMARY KEY")
            except Exception as e:
                print(f"  Erro: {e}")
        
        print("Alterando ID de evento para AUTO_INCREMENT...")
        cursor.execute("ALTER TABLE evento MODIFY ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✓ Corrigido!")
        
    except Exception as e:
        print(f"✗ Erro: {e}")

if __name__ == '__main__':
    fix_evento()
