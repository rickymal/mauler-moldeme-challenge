# Moldeme - O Desafio de código

- Este projeto foi criado como parte de um desafio. O objetivo do projeto é demonstrar o uso de Algoritmo Genético (GA) para resolver o problema do caixeiro viajante.
- O sistema foi desenvolvido sob o template [Vue 3 + Vite] + [Python + Flask]
- O projeto em Node.js cuida da interação com o usuário enquanto o projeto em Python é unica e exclusivamente para o algoritmo bioinspirado.
- O desafio pede para aplicar ao máximo os princípios MVC e SOLID ao projeto, porém há resalvas:

1. Os princípios SOLID não são 100% transponíveis para o Vue.js. Este framework é voltado para criaçãod e interfaces baseando no modelo reativo 
2. Vue.js opera por design utilizando arquitetura MVVM (Model-View-Model), uma variação do modelo tradicional MVC. Este padrão permite uma separação mais estreita entre a interface de usuário (Camada VIew), do controle da regra de negócio. Por esta razão optei por realizar a separação de duas formas distintas para padronizar na arquitetura MVC:
   1. Utilizando Promises
   2. Utilizando Callbacks
   
OBS: os diferente métodos foram marcados em comentário. pesquise por `[method]`

## Pré-requisitos:

- Docker
- Docker-compose
- WSL2 (recomendado)

## Configuração e Instalação

1. **Clone o repositório**

2. **Crie e configure o arquivo .env**
- Na pasta raiz do projeto, crie um arquivo chamado `.env`. Este arquivo deve conter as seguintes variáveis de ambiente:
```bash
EMAIL='<seu_email>'
PASSWORD='<sua_senha>'
TOKEN='<um_token_valido>'
```

- As variáveis acima correspondem ao e-mail, senha e um token para acessar a API da Moldeme. Esta variável de ambiente não é necessária para o funcionamento do programa, porém deve ser inserida caso se queira executar o testes de integração.

3. **Construa e inicie os contêineres Docker**

Execute o seguinte comando para construir e iniciar os contêineres:

```bash
docker-compose up
```

Caso não funcione, teste:

```bash
docker-compose up --build
```

Se ainda assim você encontrar problemas, pode ser que haja uma incompatibilidade entre o arquivo `docker-compose.yaml` e a versão do Docker instalada em seu sistema. É possível que o problema esteja na versão do Docker que você possui. Caso encontre algum erro, você tem a opção de alterar a versão especificada no arquivo para a versão que é suportada pela sua instalação do Docker. Isso pode ser feito modificando o parâmetro 'version' no arquivo docker-compose. Por exemplo:

```
version: 3.3
services:
  app_python:
    image: python:3.8.10
    volumes:
      - ./src/api:/app
[...]
```

1. **Acesse a aplicação**

Depois que os contêineres estiverem em execução e as aplicações inicializadas, você pode acessar a aplicação:
- [http://localhost:5173](http://localhost:5173)
- Se você estiver rodando o projeto em um ambiente WSL, pode ser necessário substituir "localhost" pelo endereço IPv4 da sua máquina WSL. Para descobrir isso, abra o prompt de comando ou o PowerShell e digite `ipconfig` para obter o IPv4 da interface de rede.

## Executando testes

Para rodar os testes da aplicação, após iniciar o docker e as aplicações, execute o seguinte comando: 

```bash
docker exec -it <container-id> npm run test
```
- substituindo `<container-id>` pelo ID do container node
- Você pode encontrar o ID do contêiner usando o comando `docker ps`. Outra alternativa é substituir `<container-id>` pelo nome do processo docker. Caso o nome da pasta não tenha sido alterada durante o clone do projeto, o ID do contêiner provavelmente é `mauler-moldeme-challenge_app_node_1`, e o comando ficaria assim:

```bash
docker exec -it mauler-moldeme-challenge_app_node_1 npm run test
```