import AiApiService from "../services/AiApiService";
import UserController from "../controllers/UserController";
import PerformController from "../controllers/PerformController";
import DashboardController from "../controllers/DashboardController";
import MoldemeService from "../services/MoldemeService";
import { expect, test, describe, it, beforeAll, beforeEach } from '@jest/globals';
require('dotenv').config()


// sampleFunction.ts
export function sampleFunction(x: number, y: number): number {
  return x + y;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sampleFunction(1, 2)).toBe(3);
});

let token = process.env.TOKEN as string
// let token = ''
const moldemeService = new MoldemeService('https://recrutamento.molde.me')
const userController = new UserController(moldemeService)

beforeAll(() => { });


describe("UserController ", () => {
  const moldemeService = new MoldemeService('https://recrutamento.molde.me')
  const userController = new UserController(moldemeService)
  let email = process.env.EMAIL as string
  let password = process.env.PASSWORD as string
  it("Ser capaz de fazer login utilizando credenciais corretas", async () => {
    try {
      const response = await userController.login(email, password)
      token = response.data.auth_token
      expect(token).not.toEqual('')
    } catch (error) {
      throw error
    }
  })

  it("Deve retornar um erro caso as credenciais estejam erradas", async () => {
    const error = await userController.login('an_salt_for_email' + email, password + 'an_salt_for_password')
    expect(error.response.status).toEqual(400)

    expect(error.response.data).toEqual({
      message: "Usuário ou senha inválidos."
    })
  })
})


describe("DashboardController", () => {
  const moldemeService = new MoldemeService('https://recrutamento.molde.me')
  const dashboardController = new DashboardController(moldemeService, token, {})
  const salt = '2hf2scaa2li'
  const expiredDashboardController = new DashboardController(moldemeService, token + salt, {})
  let coords_id: number = -1

  it('capaz de acessar a pagina principal', async () => {
    const response = await dashboardController.paginateData(0)
    expect(response.status).toEqual(200)
    const keys = Object.keys(response.data)
    expect(keys).toEqual([
      'data',
      'limit',
      'page',
      'pages',
      'total'
    ])
  })

  it('não pode acessar a página anterior, pois não existe', async () => {
    const response = await dashboardController.paginateData(-1)
    expect(response).toBeNull()
  })


  it("capaz de adicionar coordenadas à API", async () => {
    const response = await dashboardController.addCoordinate(142, 423)

    expect(response.status).toEqual(200)
    expect(Object.keys(response.data)).toEqual(expect.arrayContaining([
      'created_at',
      'updated_at',
      'id',
      'x',
      'y'
    ]))

    coords_id = response.data.id
  })


  it("tentando adicionar coordenadas à API supondo que o token expirou", async () => {
    const { response } = await expiredDashboardController.addCoordinate(142, 423)
    expect(response.status).toEqual(401)

  })

  it("capaz de deletar coordenadas à API", async () => {
    const response = await dashboardController.deleteCoordinate(coords_id)
    expect(response.status).toEqual(200)
  })

  it("Não pode adicionar coordenadas fora do range", async () => {

    const { response } = await dashboardController.addCoordinate(-142, 4230)
    expect(response.status).toEqual(400)

    // const message_error = [response.data.fields?.x, response.data.fields?.y]
    // message_error.forEach(element => {
    //   expect(["deve ser menor ou igual a 1000", "deve ser maior ou igual a 0"]).toContain(element);
    // });

    expect(response.data.fields?.x).toEqual("deve ser maior ou igual a 0")
    expect(response.data.fields?.y).toEqual("deve ser menor ou igual a 1000")
  })
})


describe("PerformController", () => {
  const moldemeService = new MoldemeService('https://recrutamento.molde.me');
  const aiApiService = new AiApiService('')
  const performController = new PerformController(moldemeService, aiApiService, token, {})

  it("Deve obter um json contendo informações sobre as coordenadas", async () => {
    const response = await performController.getAllCoordinates()
    expect(response.status).toEqual(200)
    const data = response.data

    expect(Object.keys(data)).toEqual(expect.arrayContaining([
      'data',
      'limit',
      'page',
      'pages',
      'total'
    ]))

    if (data.data[0]) {
      expect(Object.keys(data.data[0])).toEqual(expect.arrayContaining([
        'id',
        'x',
        'y',
        'created_at',
        'updated_at'
      ]))
    }
  })

  it("Capaz de utilizar a api para o algoritmo evolucionário e obter os resultados a serem apresentado", async () => {
    const response = await performController.findGoodPath('10', '10')
    expect(response.status).toEqual(200)
    expect(response.data).toEqual({
      length: expect.any(Number),
      pathChoosed: expect.any(Array)
    })
  })
})