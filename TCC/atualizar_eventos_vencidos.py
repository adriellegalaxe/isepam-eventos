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
    print("ATUALIZANDO EVENTOS PARA VENCIDOS")
    print("="*80)
    
    today = datetime(2026, 2, 9)
    
    # Datas no passado para os eventos
    data_passada_3 = (today - timedelta(days=3)).strftime('%Y-%m-%d')   # 06/02/2026
    data_passada_4 = (today - timedelta(days=1)).strftime('%Y-%m-%d')   # 08/02/2026
    
    print(f"\nData atual: {today.strftime('%d/%m/%Y')}")
    print(f"\nAtualizando eventos:")
    print(f"  Festival de Programação (ID 7) → PASSADO: {data_passada_3}")
    print(f"  Simpósio de Pesquisa Acadêmica (ID 8) → PASSADO: {data_passada_4}")
    
    # Atualizar evento 7
    cursor.execute("UPDATE evento SET Data = %s WHERE ID = 7", (data_passada_3,))
    print(f"\n✓ Evento 7 atualizado para {data_passada_3}")
    
    # Atualizar evento 8
    cursor.execute("UPDATE evento SET Data = %s WHERE ID = 8", (data_passada_4,))
    print(f"✓ Evento 8 atualizado para {data_passada_4}")
    
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
