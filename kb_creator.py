import os
import requests
from bs4 import BeautifulSoup
from modernmt import ModernMT
import json
import jsonlines


def load_fastweb_kb(destination_path, log):
    URL = "https://www.fastweb.it/adsl-fibra-ottica/domande-e-risposte/fisso/"
    mmt_api_key = os.getenv("MMT_API_KEY")
    mmt = ModernMT(mmt_api_key)

    dataset_base_path = destination_path

    log.info("Downloading FastWeb KB from {}".format(URL))
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')

    log.info("Parsing FastWeb KB")
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
            #dataset.append({'question': q, 'answer': a})
            dataset.append({'text': a})

            log.info("Loading question: {}".format(q))
            q_en = mmt.translate('it', 'en', q).translation
            a_en = mmt.translate('it', 'en', a).translation
            #dataset_en.append({'question': q_en, 'answer': a_en})
            dataset_en.append({'text': a_en})

    if not os.path.exists(dataset_base_path):
        os.makedirs(dataset_base_path)

    dataset_it_filename = os.path.join(dataset_base_path, 'it.jsonl')
    with jsonlines.open(dataset_it_filename, 'w') as writer:
        writer.write_all(dataset)

    dataset_en_filename = os.path.join(dataset_base_path, 'en.jsonl')
    with jsonlines.open(dataset_en_filename, 'w') as writer:
        writer.write_all(dataset_en)

    data_json_it = os.path.join(dataset_base_path, 'it.json')
    with open(data_json_it, 'w') as fp:
        fp.write(json.dumps(dataset))

    data_json_en = os.path.join(dataset_base_path, 'en.json')
    with open(data_json_en, 'w') as fp:
        fp.write(json.dumps(dataset_en))

    log.info("FastWeb KB downloaded and saved to {}".format(dataset_base_path))

    return dataset_en_filename, dataset_it_filename, data_json_en, data_json_it
