const jsGenetic = require('jsGenetic');
const AntColony = require('ant-colony');

import jsGenetic from 'jsGenetic'
import AntColony from 'ant-colony'

// Criando um conjunto de 10 pontos (cidades) para o drone visitar
let cidades = [...Array(100)].map(_ => [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)]);

// Função para calcular a distância entre duas cidades
function getRoutesDistance(cidade1, cidade2) {
    return Math.sqrt(Math.pow(cidade1[0] - cidade2[0], 2) + Math.pow(cidade1[1] - cidade2[1], 2));
}

function calculateDistance(individual) {
    // Calcula a distância total da rota
    let distance = 0;
    for(let i = 0; i < individual.length - 1; i++){
        distance += getRoutesDistance(cidades[individual[i]], cidades[individual[i+1]]);
    }
    // Adiciona a distância da última cidade de volta à primeira cidade
    distance += getRoutesDistance(cidades[individual[individual.length - 1]], cidades[individual[0]]);
    return distance;
}

// Algoritmo genético
let AG = new jsGenetic.Algorithm({
    mutationFunction: jsGenetic.mutation.swap,
    crossoverFunction: jsGenetic.crossover.ordered,
    selectionFunction: jsGenetic.selection.tournament3,
    fitnessFunction: calculateDistance,
    populationSize: 100,
    genotypeLength: cidades.length
});

AG.initializePopulation();
AG.run(1000, 0.1, 0.9);

let best_route_AG = AG.best();

// Algoritmo de colônia de formigas
let ACO = new AntColony.ACO({
    alpha: 1,
    beta: 1,
    rho: 0.1,
    Q: 1
});

let best_route_ACO = ACO.solve(cidades, getRoutesDistance, 1000, 0.1, 0.9);

console.log(`Best route (AG): ${best_route_AG}`);
console.log(`Best route (ACO): ${best_route_ACO}`);
