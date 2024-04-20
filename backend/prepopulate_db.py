import firebase_admin
from firebase_admin import credentials, db
from backend.gen_news_script import generate_all_news, parse_article_gemini
import json
from dotenv import load_dotenv
import os

load_dotenv()

FIREBASE_CERTIFICATE_PATH = os.getenv("FIREBASE_CERTIFICATE_PATH")
FIREBASE_URL = os.getenv("FIREBASE_URL")
cred = credentials.Certificate(FIREBASE_CERTIFICATE_PATH)
firebase_app = firebase_admin.initialize_app(cred, {'databaseURL': FIREBASE_URL})

articles = generate_all_news()

ref = db.reference("/")

for article in articles:
    parsed_obj = parse_article_gemini(article)
    
    if parsed_obj is None:
        continue
    
    article['title'] = parsed_obj['title'].replace('*', '')
    article['description'] = parsed_obj['summary']
    article['tldr'] = parsed_obj['tldr']
    article['score'] = 0
    
    article_json = json.dumps(article)

    print(article_json)

    ref.push().set(article_json)