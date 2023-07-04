import random
from deap import creator, base, tools, algorithms
import random
import numpy as np

import random
import math
import time
import pants
import time
import pandas as pd
import itertools
import pdb
from dataclasses import dataclass

class BaseIA:
    def __init__(self, max_time = '', max_generations = ''):
        self.max_time = int(max_time) if max_time != '' else np.inf
        self.max_generations = int(max_generations) if max_generations != '' else np.inf

        if self.max_time == np.inf and self.max_generations == np.inf:
            raise ValueError("Deve-se no mínimo definir o número máximo de iterações ou de tempo de execução")
        self.data_for_convergence = {
            'gerações' : [],
            'agentes' : [],
            'distância total' : []
        }
        
        self.data_for_diversity = {
            'gerações' : [],
            'quantidade de rotas divergentes' : [],
        }
        
    def perform(self, cities, start_city = None):
        pass
    
    # Função para calcular a distância entre duas cidades
    def get_routes_distance(self, cidade1, cidade2):
        return np.sqrt((cidade1[0] - cidade2[0])**2 + (cidade1[1] - cidade2[1])**2)

    def calculate_distance(self, individual):
        cidades = self.cities
        # calcula a distância total da rota
        distance = sum(map(lambda c1, c2: self.get_routes_distance(cidades[c1], cidades[c2]), individual[:-1], individual[1:]))
        # adiciona a distância da última cidade de volta à primeira cidade
        distance += self.get_routes_distance(cidades[individual[-1]], cidades[individual[0]])
        return (distance,)
    
    def insert_to_graph_convergence(self, agent, generation, total_distance):
        self.data_for_convergence['gerações'].append(generation)
        self.data_for_convergence['agentes'].append(agent)
        self.data_for_convergence['distância total'].append(total_distance)
        
    def insert_to_graph_diversity(self, idx, quantity):
        self.data_for_diversity['gerações'].append(idx)
        self.data_for_diversity['quantidade de rotas divergentes'].append(quantity)
        
    def resume(self):

        generations = self.data_for_convergence['gerações']
        agents = self.data_for_convergence['agentes']
        total_distance = self.data_for_convergence['distância total']

        indices = pd.MultiIndex.from_arrays([generations, agents], names=('gerações', 'agentes'))

        convergence = pd.Series(data = total_distance, index = indices).unstack()
        new_columns = [f"{x + 1}º modelo" for x in convergence.columns]
        new_columns[0] = "Melhor modelo"
        convergence.columns = new_columns

        return {
            'div' : pd.DataFrame(self.data_for_diversity).set_index('gerações'),
            'con' : convergence.iloc[:,:5]
        }


class GA(BaseIA):

    def fit(self):
        cities = self.cities
        toolbox = base.Toolbox()
        creator.create("FitnessMin", base.Fitness, weights=(-1.0,))
        creator.create("Individual", list, fitness=creator.FitnessMin)

        # Geração de indivíduos e população
        toolbox.register("indices", random.sample, range(len(cities)), len(cities))  
        toolbox.register("individual", tools.initIterate, creator.Individual, toolbox.indices)
        toolbox.register("population", tools.initRepeat, list, toolbox.individual)
        
        # Operadores genéticos
        toolbox.register("mate", tools.cxPartialyMatched)
        toolbox.register("mutate", tools.mutShuffleIndexes, indpb=0.05)
        toolbox.register("select", tools.selTournament, tournsize=3)
        toolbox.register("evaluate", self.calculate_distance)
        
        self.toolbox = toolbox

        
    def perform(self, cities, start_city = None):
        self.cities = cities
        self.start_city = start_city
        self.fit()
        agents = 5
        
        max_generations = self.max_generations

        if np.isinf(max_generations):
            iterator = itertools.count()
        else:
            iterator = range(max_generations)

        
        max_time = self.max_time
        if start_city is not None:
            cities.insert(0, start_city)
        
        population = self.toolbox.population(n = 300)
        
        # Seleciona só o 'n' melhor(es) (sendo n = 1)
        particle_choose_criteria = tools.HallOfFame(agents)
        
        start_time = time.time()
        routes_by_generation = list()
        for gen in iterator:
            if time.time() - start_time > max_time:
                break
            algorithms.eaSimple(population, self.toolbox, cxpb = 0.1, mutpb = 0.3, ngen = 1, halloffame = particle_choose_criteria, verbose = False)
            # A cada 'n' agentes, temos um vetor com todos os caminhos possíveis
            best_path_in_generation = [[cities[i] for i in particle_group] for particle_group in particle_choose_criteria]
            routes_by_generation.append(best_path_in_generation)
        best_route = [cities[i] for i in particle_choose_criteria[0]]
        best_route.append(best_route[0])
        
        for idx, route_generation in enumerate(routes_by_generation):
            unique_routes = set(map(str, (rr[0:3] for rr in route_generation)))
            self.insert_to_graph_diversity(idx, len(unique_routes))
            for idy, route_option in enumerate(route_generation):
                total_distance = sum(self.get_routes_distance(c1, c2) for c1, c2 in zip(route_option[:-1], route_option[1:]))
                self.insert_to_graph_convergence(idy, idx, total_distance)
        return best_route

        
    pass


class ACO(BaseIA):

    def perform(self, cities, start_city=None):
        max_time = self.max_time
        max_generations = self.max_generations
        cities
        if start_city is not None:
            # Adiciona a cidade de início como primeira cidade na lista de cidades
            cities.insert(0, start_city)

        world = pants.World(cities, self.get_routes_distance)
        solver = pants.Solver()

        # Condição de parada: tempo ou número de gerações
        start_time = time.time()
        best_distance = np.inf
        best_tour = None
        for idw in range(max_generations):
            if time.time() - start_time > max_time:
                break
            solution = solver.solve(world)
            if solution.distance < best_distance:
                best_distance = solution.distance
                best_tour = solution.tour
            
            self.insert_to_graph_convergence(0, idw, solution.distance)
        # Assegura que o destino é a cidade inicial
        best_tour.append(best_tour[0])

        return best_tour
    
# aco = ACO(max_time = 10, max_generations = 500)
# best_aco_route = aco.perform(cities)


from flask import Flask, request, jsonify
from flask_cors import CORS


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
    # Suponha que o JSON de entrada tenha uma chave 'message'
    message = data.get('message', '')

    # Processa os dados e cria um novo JSON para resposta
    response = {
        'reply': f'Received the message: {message}'
    }
    
    return jsonify(response), 200  # Retorna o JSON de resposta

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
