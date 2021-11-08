#to install
import requests

from os import name, system


def clear():
    if name == 'nt':
        _ = system('cls')
    else:
        _ = system('clear')


base = "http://127.0.0.1:8080/"


response = requests.post(base+"user", {"name": "jj", "age": 147})
#response = requests.get(base+"user", {"name": "jsj"})


code = response.status_code
print(f'Code:{code}')

type = "string"
try:

    final = response.json()
    type = "json"
except:
    final = response.content
print(f'{type} => {final}')
