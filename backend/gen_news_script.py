from newsapi import NewsApiClient
import google.generativeai as genai
from newspaper import Article
import json
import os
from dotenv import load_dotenv
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import datetime

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_CLIENT_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

newsapi = NewsApiClient(api_key=NEWS_API_KEY)
genai.configure(api_key=GOOGLE_API_KEY)

safety_settings = {
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
}

model = genai.GenerativeModel('gemini-pro', safety_settings=safety_settings)
image_model = genai.GenerativeModel('gemini-pro-vision', safety_settings=safety_settings)

generation_config={
    "max_output_tokens": 2048,
    "temperature": 0,
    "top_p": 1,
}

with open("backend/hook_title_prompt.txt", "r") as file:
    title_prompt = file.read()

with open("backend/summary_prompt.txt", "r") as file:
    summary_prompt = file.read()

def generate_top_news(search_query = None):
    top_headlines = newsapi.get_top_headlines(q=search_query,
                                          language='en',
                                          country='us',
                                          page=2)
    return top_headlines['articles']

def generate_all_news(search_query = None):
    current_date = datetime.datetime.now()
    two_weeks_from_now = current_date - datetime.timedelta(weeks=2)
    
    two_weeks_from_now = two_weeks_from_now.strftime("%Y-%m-%d")
    current_date = current_date.strftime("%Y-%m-%d")

    top_headlines = newsapi.get_everything(q=search_query,
                                          language='en',
                                          from_param=two_weeks_from_now,
                                          to=current_date,
                                          sources='nbc-news, polygon, politico, newsweek, msnbc',
                                          page=2)
    return top_headlines['articles']

def print_sources():
    sources = newsapi.get_sources(country='us')

    print(sources)

# Returns a dict of generated title and summary
def parse_article_gemini(article_obj: dict) -> tuple:
    generated_content = {}
    url = article_obj['url']
    article = Article(url)

    try:
        article.download()
        article.parse()
    
    except Exception as e:
        print("Could not Parse")
        return
    
    full_text = article.text

    if not full_text:
        print("Empty Text: ", article_obj['title'])
        return
    
    title_message = [
        {
            'role' : 'user',
            'parts' : title_prompt + full_text
        }
    ]

    summary_message = [
        {
            'role' : 'user',
            'parts' : summary_prompt + full_text
        }
    ]

    title_response = model.generate_content(title_message)
    summary_response = model.generate_content(summary_message)
    
    try:
        generated_content['title'] = title_response.text
        generated_content['summary'] = summary_response.text
        return generated_content
    except Exception as e:
        print("Gemini text issue")
        return
        

