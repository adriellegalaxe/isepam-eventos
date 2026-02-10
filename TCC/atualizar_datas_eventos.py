#!/usr/bin/env python
import mysql.connector
from datetime import datetime, timedelta

DB_CONFIG = {
    'host': 'localhost',
    'user': 'beta_tcc_user',
    'password': 'bcw,8907',
    'database': 'database_beta_tcc'
}

try:
    conn = mysql.connector.connect(**DB_CONFIG, charset='utf8mb4')
    cursor = conn.cursor()
    
    print("="*80)
    print("ATUALIZANDO DATAS DOS EVENTOS")
    print("="*80)
    
    today = datetime(2026, 2, 9)  # Data atual do sistema
    
    # 2 eventos no PASSADO (já vencidos)
    data_passada_1 = (today - timedelta(days=10)).strftime('%Y-%m-%d')  # 30/01/2026
    data_passada_2 = (today - timedelta(days=5)).strftime('%Y-%m-%d')   # 04/02/2026
    
    # 2 eventos no FUTURO (ainda abertos)
    data_futura_1 = (today + timedelta(days=10)).strftime('%Y-%m-%d')   # 19/02/2026
    data_futura_2 = (today + timedelta(days=20)).strftime('%Y-%m-%d')   # 01/03/2026
    
    print(f"\nData atual: {today.strftime('%d/%m/%Y')}")
    print(f"\nAtualizando eventos:")
    print(f"  Evento 1 → PASSADO: {data_passada_1}")
    print(f"  Evento 2 → PASSADO: {data_passada_2}")
    print(f"  Evento 3 → FUTURO: {data_futura_1}")
    print(f"  Evento 4 → FUTURO: {data_futura_2}")
    
    # Atualizar evento 1
    cursor.execute("UPDATE evento SET Data = %s WHERE ID = 1", (data_passada_1,))
    print(f"\n✓ Evento 1 atualizado para {data_passada_1}")
    
    # Atualizar evento 2
    cursor.execute("UPDATE evento SET Data = %s WHERE ID = 2", (data_passada_2,))
    print(f"✓ Evento 2 atualizado para {data_passada_2}")
    
    # Atualizar evento 3
    cursor.execute("UPDATE evento SET Data = %s WHERE ID = 3", (data_futura_1,))
    print(f"✓ Evento 3 atualizado para {data_futura_1}")
    
    # Atualizar evento 4
    cursor.execute("UPDATE evento SET Data = %s WHERE ID = 4", (data_futura_2,))
    print(f"✓ Evento 4 atualizado para {data_futura_2}")
    
    conn.commit()
    
    # Verificar
    print(f"\n{'='*80}")
    print("EVENTOS APÓS ATUALIZAÇÃO:")
    print(f"{'='*80}")
    cursor.execute("SELECT ID, Nome, Data FROM evento ORDER BY ID")
    for row in cursor.fetchall():
        evento_id, nome, data = row
        dias_atrás = (today.date() - data).days
        status = "✓ VENCIDO" if dias_atrás > 0 else "• ABERTO"
        print(f"ID {evento_id}: {nome} → {data} ({status})")
    
    cursor.close()
    conn.close()
    
    print(f"\n{'='*80}")
    print("✓ Eventos atualizados com sucesso!")
    print(f"{'='*80}")
    
except Exception as e:
    print(f"❌ ERRO: {e}")
