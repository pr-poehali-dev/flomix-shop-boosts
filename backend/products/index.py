import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления товарами (получение списка и создание новых)'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    
    if method == 'GET':
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute(
                """SELECT p.*, u.name as seller_name, u.email as seller_email 
                   FROM products p 
                   LEFT JOIN users u ON p.seller_id = u.id 
                   WHERE p.status = 'active' 
                   ORDER BY p.created_at DESC"""
            )
            products = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'products': products}, default=str)
            }
        except Exception as e:
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        if not body_str or body_str == '':
            body_str = '{}'
        
        try:
            body = json.loads(body_str)
        except json.JSONDecodeError:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid JSON'})
            }
        
        seller_id = body.get('seller_id')
        title = body.get('title')
        price = body.get('price')
        product_type = body.get('product_type')
        
        if not all([seller_id, title, price, product_type]):
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        try:
            
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute(
                """INSERT INTO products 
                   (seller_id, title, description, price, old_price, product_type, trophies, image_emoji, status) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
                   RETURNING *""",
                (
                    seller_id,
                    title,
                    body.get('description', ''),
                    price,
                    body.get('old_price'),
                    product_type,
                    body.get('trophies', ''),
                    body.get('image_emoji', '🎮'),
                    'active'
                )
            )
            product = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'product': product}, default=str)
            }
        except Exception as e:
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }