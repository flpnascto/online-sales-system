import axios from 'axios'
import { App } from '../src/App';

const PORT_TEST = 3030;
const BASE_URL = `http://localhost:${PORT_TEST}`;
const ENDPOINT_ORDERS = `${BASE_URL}/orders`;
const server = new App();
server.start(PORT_TEST);

test('Verifica se a aplicação está operando', async () => {
  const response = await axios.get(BASE_URL);
  expect(response.data).toEqual({ ok: true })
} )

test('Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total', async () => {
  const input = {
    cpf: '987.654.321-00',
    itens: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 2 },
      { productId: 3, quantity: 3 },
    ],
  }
  const output = {
    id: 1,
    totalPrice: 140,
  };
  const response = await axios.post(ENDPOINT_ORDERS, input);
  console.log(response);
  
  expect(response.status).toBe(201);
  expect(response.data).toMatchObject(output)
})
