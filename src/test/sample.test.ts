// import { expect } from "vitest";
import AiApiService from "../services/AiApiService";
import UserController from "../controllers/UserController";
import PerformController from "../controllers/PerformController";
import dashboardController from "../controllers/DashboardController";
import MoldemeService from "../services/MoldemeService";
import type IMoldemeService from "../services/IMoldemeService";

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


// describe("UserController ", () => {
//   let email = 'henriquemauler@gmail.com'
//   let password = '052NEGk='
//   const moldemeService = new MoldemeService('https://recrutamento.molde.me')
//   const userController = new UserController(moldemeService as unknown as IMoldemeService)

//   it("Ser capaz de fazer login utilizando credenciais corretas", async () => {
//     userController.login(email, password).then(response => {
//       const expected_field = ['auth','name']
//       console.log({response})
//     })
//   })

//   it("Deve retornar um erro caso as credenciais estejam erradas", () => {
//     userController.login("an-fake-user-email","an-fake-user-password").catch(error => {
//       console.log({error})
//     })
//   })
// })