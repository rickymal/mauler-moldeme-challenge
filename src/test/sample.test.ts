// import { expect } from "vitest";
import AiApiService from "../services/AiApiService";
import UserController from "../controllers/UserController";
import PerformController from "../controllers/PerformController";
import dashboardController from "../controllers/DashboardController";
import MoldemeService from "../services/MoldemeService";
import type IMoldemeService from "../services/IMoldemeService";
import { expect, test, describe, it, beforeAll } from '@jest/globals';

// sampleFunction.ts
export function sampleFunction(x: number, y: number): number {
    return x + y;
  }

test('adds 1 + 2 to equal 3', () => {
  expect(sampleFunction(1, 2)).toBe(3);
});


beforeAll(() => {
  console.log("Teste")
})


describe("UserController ", () => {
  let email = 'henriquemauler@gmail.com'
  let password = '***'
  const moldemeService = new MoldemeService('https://recrutamento.molde.me')
  const userController = new UserController(moldemeService)

  let token = ''


  it("Ser capaz de fazer login utilizando credenciais corretas", async () => {
    const response = await userController.login(email, password)

    expect(response.status).toEqual(200)

    const keys = Object.keys(response.data)

    expect(response.data).toEqual({
      auth_token: expect.any(String),
      user : expect.objectContaining({
        name : expect.any(String),
        last_login_at: expect.any(String),
        email : expect.any(String)
      }),
    })


    token = response.data.auth_token
  })

  it("Deve retornar um erro caso as credenciais estejam erradas", async () => {
    const error = await userController.login('an_salt_for_email' + email , password + 'an_salt_for_password')
    expect(error.response.status).toEqual(400)
    
    expect(error.response.data).toEqual({
      message : "Usuário ou senha inválidos."
    })
  })
})


