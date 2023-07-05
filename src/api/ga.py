import random
from deap import creator, base, tools, algorithms
import random
import numpy as np
import random
import time
import time
import itertools
from base_ai import BaseIA

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

