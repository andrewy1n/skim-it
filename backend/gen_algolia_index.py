from algoliasearch.search_client import SearchClient
import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv
import os

load_dotenv()

cred = credentials.Certificate("backend/skim-it-566ae-firebase-adminsdk-420z2-381613649b.json")
firebase_app = firebase_admin.initialize_app(cred, {'databaseURL':"https://skim-it-566ae-default-rtdb.firebaseio.com"})
ref = db.reference("/")

# Initialize Algolia client
ANGOLIA_ADMIN_API_KEY = os.getenv("ANGOLIA_ADMIN_API_KEY")
ANGOLIA_APP_ID = os.getenv("ANGOLIA_APP_ID")
client = SearchClient.create(ANGOLIA_APP_ID, ANGOLIA_ADMIN_API_KEY)
index = client.init_index('Skim-it')

all_items = ref.get()

for key, item in all_items.items():
    record = {
        'objectID': key,
        'article': item
    }
    index.save_object(record)
