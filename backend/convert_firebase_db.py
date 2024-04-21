import firebase_admin
from firebase_admin import credentials, db
import json
from dotenv import load_dotenv
import os

load_dotenv()

FIREBASE_CERTIFICATE_PATH = os.getenv("FIREBASE_CERTIFICATE_PATH")
FIREBASE_URL = os.getenv("FIREBASE_URL")
cred = credentials.Certificate(FIREBASE_CERTIFICATE_PATH)
firebase_app = firebase_admin.initialize_app(cred, {'databaseURL': FIREBASE_URL})

ref = db.reference("/")

articles = ref.get()

for key, article in articles.items():
    if isinstance(article, dict):
        continue
    else:
        ref.update({key: json.loads(article)})