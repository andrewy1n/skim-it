from typing import Union
from algoliasearch.search_client import SearchClient
import os
from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import firebase_admin
from firebase_admin import credentials, db
import json
import random

load_dotenv()

cred = credentials.Certificate("backend/skim-it-566ae-firebase-adminsdk-420z2-381613649b.json")
firebase_app = firebase_admin.initialize_app(cred, {'databaseURL':"https://skim-it-566ae-default-rtdb.firebaseio.com"})
ref = db.reference("/")

ALGOLIA_ADMIN_API_KEY = os.getenv("ALGOLIA_API_KEY")
ALGOLIA_APP_ID = os.getenv("ALGOLIA_APP")
client = SearchClient.create(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY)
index = client.init_index('Skim-it')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/random_item")
def get_random_item():
    # Fetch all values from the Firebase database
    all_items = ref.get()
    
    # Select a random item
    random_item_key = random.choice(list(all_items.keys()))
    random_item = all_items[random_item_key]
    
    return {"random_item": random_item}

@app.get("/search")
def search_item(page: int, q: Union[str, None] = None):
    results_list = []
    PAGE_LENGTH = 10
    
    if q is not None:
        results = index.search(q, {
            'attributesToRetrieve': ['title', 'content', 'description', 'tldr']
        })

        page_count = 0
        subpages = []
        for hit in results['hits']:
            article_json = hit['_highlightResult']['article']
            article_json = dict(map(lambda item: (item[0], item[1]['value']) if 'value' in item[1] else (item[0], item[1]), article_json.items()))
            article_json['key'] = hit['objectID']
            print(article_json)
            
            subpages.append(article_json)
            page_count += 1
            if page_count >= PAGE_LENGTH:
                results_list.append(subpages[::])
                subpages.clear()
                page_count = 0

        return {"numElements": len(results_list[page]), "items": results_list[page]}
    else:
        # Fetch all values from the Firebase database
        all_items = ref.get()
        
        page_count = 0
        subpages = []
        for key, item in list(all_items.items())[:50]:
            item['key'] = key
            subpages.append(item)
            page_count += 1
            if page_count >= PAGE_LENGTH:
                results_list.append(subpages[::])
                subpages.clear()
                page_count = 0
        
        return {"numElements" : len(results_list[page]), "items": results_list[page]}

@app.put("/score")
def increment_score(key: str, is_like: bool):
    # Retrieve current value of score
    article = ref.child(key).get()

    # Increment the score
    if is_like:
        article['score'] += 1
    else:
        article['score'] -= 1

    # Update the score in the database
    ref.update({key: article})
    
    new_record = {
        'objectID': key,
        'article': article
    }
    index.save_object(new_record)

    return article['score']

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
