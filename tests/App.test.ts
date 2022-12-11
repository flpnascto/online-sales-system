import axios from 'axios'
import { App } from '../src/App';
import { clearDB } from './helper/clearDb';

const PORT_TEST = 3030;
const BASE_URL = `http://localhost:${PORT_TEST}`;
const ENDPOINT_ORDERS = `${BASE_URL}/orders`;
const server = new App();
server.start(PORT_TEST);
axios.defaults.validateStatus = function () { return true };

describe('App', () => {
  beforeEach(async () => await clearDB());

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
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(output)
  })

  test('Deve criar um pedido com 3 produtos, com cupom de desconto e calcular o valor total', async () => {
    const input = {
      cpf: '987.654.321-00',
      itens: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
        { productId: 3, quantity: 3 },
      ],
      coupon: "COUPON10",
    }
    const output = {
      id: 1,
      totalPrice: 126,
    };
    const response = await axios.post(ENDPOINT_ORDERS, input);
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(output)
  })

  test('Ao criar um pedido com CPF inválido deve retornar mensagem de erro', async () => {
    const input = {
      cpf: '987.654.321-10',
    }
    const response = await axios.post(ENDPOINT_ORDERS, input);
    expect(response.status).toBe(422);
    expect(response.data).toMatchObject({ message: 'Invalid CPF'})
  })

  test("Não deve fazer pedido com produto que não existe", async function () {
    const input = {
      cpf: "987.654.321-00",
      itens: [
        { idProduct: 5, quantity: 1 }
      ]
    };
    const response = await axios.post(ENDPOINT_ORDERS, input)
    expect(response.status).toBe(422);
    const output = response.data;
    expect(output.message).toBe("Product not found");
  });

  test('Não deve fazer aplicar desconto se o cupom estiver expirado', async () => {
    const input = {
      cpf: '987.654.321-00',
      itens: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
        { productId: 3, quantity: 3 },
      ],
      coupon: "COUPON_EXPIRED",
    }
    const output = {
      id: 1,
      totalPrice: 126,
    };
    const response = await axios.post(ENDPOINT_ORDERS, input);
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(output)
  })
})