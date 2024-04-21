import requests

# URL of your FastAPI server
url = 'http://localhost:8000/score'

# JSON data for the PUT request
data = {
    "key": "-NvxCg1RdOcPgv3x4UFX",
    "is_like": True  # Set to True if the user likes the article, False otherwise
}

# Making the PUT request
response = requests.put(url, json=data)

# Checking the response status
if response.status_code == 200:
    print("Score updated successfully.")
else:
    print("Failed to update score. Status code:", response.status_code)
    print("Response:", response.text)
