import os
import requests
from bs4 import BeautifulSoup
from modernmt import ModernMT
import json
import jsonlines
from dotenv import load_dotenv

load_dotenv()

URL = "https://www.fastweb.it/adsl-fibra-ottica/domande-e-risposte/fisso/"
mmt_api_key = os.getenv("MMT_API_KEY")
mmt = ModernMT(mmt_api_key)

dataset_base_path = './datasets'

page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')

questions_box = soup.find_all('div', class_='boxdomanda', recursive=True)


dataset = []
dataset_en = []

for qs_div in questions_box:
    questions = qs_div.find_all('div', class_='domanda', recursive=True)

    for question in questions:
        q = question.find('h2', class_='questxt').text.replace(
            '\n', '').replace('\t', '')
        a = question.find('span', class_='answtxt').find(
            'p').text.replace('\n', '').replace('\t', '')
        dataset.append({'question': q, 'answer': a})

        q_en = mmt.translate('it', 'en', q).translation
        a_en = mmt.translate('it', 'en', a).translation
        dataset_en.append({'question': q_en, 'answer': a_en})

if not os.path.exists(dataset_base_path):
    os.makedirs(dataset_base_path)

with jsonlines.open(os.path.join(dataset_base_path, 'it.jsonl'), 'w') as writer:
    writer.write_all(dataset)

with jsonlines.open(os.path.join(dataset_base_path, 'en.jsonl'), 'w') as writer:
    writer.write_all(dataset_en)

with open(os.path.join(dataset_base_path, 'it.json'), 'w') as fp:
    fp.write(json.dumps(dataset))

with open(os.path.join(dataset_base_path, 'en.json'), 'w') as fp:
    fp.write(json.dumps(dataset_en))
