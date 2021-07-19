import os
from PyInquirer import prompt
from dotenv import load_dotenv
import logging as log
import kb_creator as kb
from faq_ai import FaqAI

load_dotenv()
log.basicConfig(level=log.INFO, filename='debug.log')


def setup(force=False):
    log.info('Buongiorno, sto configurando l\'ambiente...')
    faqAI = FaqAI(log)
    if force:
        log.info('building dataset')

        dataset_en, dataset_it, data_json_en, data_json_it = kb.load_fastweb_kb(
            './datasets', log)
        log.info('dataset built. Now building FAQ')
    else:
        dataset_en = './datasets/en.jsonl'
    log.info('Creating dataset...')
    # faqAI.load_dataset(dataset_en)
    log.info('..dataset created.')
    return faqAI


def cli(faqAI):
    log.info('Buongiorno, sono il tuo assistente Fastweb, come posso aiutarti?')
    answers = prompt([{
        'type': 'list',
        'name': 'action',
        'message': 'Come posso aiutarti?',
        'choices': ['Informazioni', 'Esci'],
    }])
    action = answers.get('action')
    log.info(action)
    if(action == 'Esci'):
        print('Grazie e arrivederci!')
        return False
    else:
        q_answer = prompt([{
            'type': 'input',
            'name': 'question',
            'message': 'Inserisci la domanda'
        }])
        question = q_answer.get('question')
        log.info('Grazie. Ottengo la risposta...')
        answer = faqAI.get_response(question)
        print(''.join(answer))
        return True


if __name__ == '__main__':
    faqAI = setup(force=False)
    repeat = True
    while repeat:
        repeat = cli(faqAI)
