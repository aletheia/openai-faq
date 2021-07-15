import os
import json
import openai

import jsonlines

import click

# openai.api_key = os.getenv("OPENAI_API_KEY")


# # "Devo pagare per una tecnologia migliore?"
# prompt = 'Chi sei tu?'

# print('Buongiorno, sono il tuo assistente Fastweb.\nCome posso aiutarti?\n')
# print(f'Domanda:\n{prompt}')
# p_en = mmt.translate('it', 'en', prompt).translation
# #print(f'Translated to {p_en}')

# response = openai.Answer.create(
#     search_model="ada",
#     model="curie",
#     question=p_en,
#     documents=openai_faq_documents,
#     examples_context="In 2017, U.S. life expectancy was 78.6 years.",
#     examples=[["What is human life expectancy in the United States?", "78 years."]],
#     max_tokens=50,
#     stop=["\n", "<|endoftext|>"],
# )

# print('\nRisposta:\n')
# for answer in response.answers:
#     print(mmt.translate('en', 'it', answer).translation)


# # @click.command()
# # @click.argument('question')
# # def main(question):
# #     click.echo('Benvenuto, sono il tuo assistente Fastweb. Come posso aiutarti?')
