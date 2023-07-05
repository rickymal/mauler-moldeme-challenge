
from ga import GA
from aco import ACO
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
app = Flask(__name__)
CORS(app)  # Isso habilita CORS para todas as rotas

@app.route('/', methods=['GET'])
def hello_world():
    # data = request.get_json()  # Extrai o JSON da requisição POST

    # Suponha que o JSON de entrada tenha uma chave 'message'
    # message = data.get('message', '')

    # Processa os dados e cria um novo JSON para resposta
    response = {
        'hello': 'world'
    }
    
    return jsonify(response), 200  # Retorna o JSON de resposta

@app.route('/perform', methods=['POST'])
def process_data():
    data = request.get_json()  # Extrai o JSON da requisição POST
    params = data.get('params')
    coords = data.get('coords')
    coords = np.array(coords)

    print('coords', coords)
    print('params', params)

    try:
        ga = GA(**params)
        # ga = GA(**map(int, data['params']))
        best_route = ga.perform(coords)
        div, conv = ga.resume().values()
        response = {
            'best_route' : np.array(best_route).tolist(),
            'div' : div.to_dict(),
            'conv' : conv.to_dict(),
            'total_distance' : conv.iloc[-1,0]
        }

        return jsonify(response), 200  # Retorna o JSON de resposta
    except ValueError as error:
        return jsonify({
            'message' : str(error)
        }), 400

if __name__ == '__main__':
    print("HELLO MI FRIENDS!")
    app.run(host='0.0.0.0', debug=True)
