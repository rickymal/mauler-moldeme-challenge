import numpy as np
import time
import pants
import time
from base_ai import BaseIA

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
