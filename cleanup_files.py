from dotenv import load_dotenv

import openai
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

list = openai.File.list()
print(list)

for file in list.data:
    print(f'Deleting {file.id}')
    openai.File(file.id).delete()
