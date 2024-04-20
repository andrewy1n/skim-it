import firebase_admin
from firebase_admin import credentials, db
from backend.gen_news_script import generate_all_news, parse_article_gemini
import json

cred = credentials.Certificate("backend/skim-it-566ae-firebase-adminsdk-420z2-381613649b.json")
firebase_app = firebase_admin.initialize_app(cred, {'databaseURL':"https://skim-it-566ae-default-rtdb.firebaseio.com"})

articles = generate_all_news()

ref = db.reference("/")

for article in articles:
    parsed_obj = parse_article_gemini(article)
    
    if parsed_obj is None:
        continue
    
    article['title'] = parsed_obj['title'].replace('*', '')
    article['description'] = parsed_obj['summary']
    
    article_json = json.dumps(article)

    print(article_json)

    ref.push().set(article_json)