import numpy as np
import pandas as pd

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
