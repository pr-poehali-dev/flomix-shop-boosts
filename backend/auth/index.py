import json
import os
import psycopg2
from google.oauth2 import id_token
from google.auth.transport import requests

def handler(event: dict, context) -> dict:
    '''API для авторизации пользователей через Google OAuth'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        if not body_str or body_str == '':
            body_str = '{}'
        
        try:
            body = json.loads(body_str)
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid JSON'})
            }
        
        token = body.get('token')
        
        if not token:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Token is required'})
            }
        
        try:
            
            client_id = os.environ.get('GOOGLE_CLIENT_ID')
            
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                client_id
            )
            
            google_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', '')
            avatar_url = idinfo.get('picture', '')
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute(
                "SELECT id, email, name, avatar_url, is_seller FROM users WHERE google_id = %s",
                (google_id,)
            )
            user = cur.fetchone()
            
            if user:
                user_data = {
                    'id': user[0],
                    'email': user[1],
                    'name': user[2],
                    'avatar_url': user[3],
                    'is_seller': user[4]
                }
            else:
                cur.execute(
                    "INSERT INTO users (google_id, email, name, avatar_url) VALUES (%s, %s, %s, %s) RETURNING id, email, name, avatar_url, is_seller",
                    (google_id, email, name, avatar_url)
                )
                new_user = cur.fetchone()
                conn.commit()
                user_data = {
                    'id': new_user[0],
                    'email': new_user[1],
                    'name': new_user[2],
                    'avatar_url': new_user[3],
                    'is_seller': new_user[4]
                }
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'user': user_data})
            }
            
        except ValueError as e:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid token'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }