#!/usr/bin/env python3
"""Corrigir tabelas para adicionar AUTO_INCREMENT"""

import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'host': 'localhost',
    'user': 'beta_tcc_user',
    'password': 'bcw,8907',
    'database': 'database_beta_tcc',
    'charset': 'utf8mb4',
}

def fix_auto_increment():
    """Adiciona AUTO_INCREMENT às tabelas"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Passo 1: Remover constraint de sessoes
        print("1. Remover constraint de sessoes...")
        try:
            cursor.execute("ALTER TABLE sessoes DROP FOREIGN KEY sessoes_ibfk_1")
            print("   ✓")
        except Exception as e:
            print(f"   ~ {e}")
        
        # Passo 2: Limpar evento
        print("2. Limpando evento...")
        cursor.execute("DELETE FROM evento")
        print("   ✓")
        
        # Passo 3: Alterar evento para AUTO_INCREMENT
        print("3. Alterando evento para AUTO_INCREMENT...")
        try:
            cursor.execute("ALTER TABLE evento DROP PRIMARY KEY")
        except:
            pass
        cursor.execute("ALTER TABLE evento MODIFY ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY")
        print("   ✓")
        
        # Passo 4: Limpar e alterar sessoes
        print("4. Limpando sessoes...")
        cursor.execute("DELETE FROM sessoes")
        print("   ✓")
        
        print("5. Alterando sessoes para AUTO_INCREMENT...")
        try:
            cursor.execute("ALTER TABLE sessoes DROP PRIMARY KEY")
        except:
            pass
        cursor.execute("ALTER TABLE sessoes MODIFY ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY")
        print("   ✓")
        
        # Passo 5: Re-adicionar constraint
        print("6. Re-adicionando constraint...")
        try:
            cursor.execute("ALTER TABLE sessoes ADD CONSTRAINT sessoes_ibfk_1 FOREIGN KEY (ID_Evento) REFERENCES evento(ID)")
            print("   ✓")
        except Exception as e:
            print(f"   ~ {e}")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\n✓ AUTO_INCREMENT configurado com sucesso!")
        
    except Error as e:
        print(f"✗ Erro MySQL: {e}")
    except Exception as e:
        print(f"✗ Erro inesperado: {e}")

if __name__ == '__main__':
    print("=== Configurando AUTO_INCREMENT ===\n")
    fix_auto_increment()
