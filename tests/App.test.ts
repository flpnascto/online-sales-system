import request from 'supertest'
import { app } from '../src/App';

test('Verifica se a aplicação está operando', async () => {
  const response = await request(app).get('/');
  expect(response.body).toEqual({ ok: true })
} )

test('Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total', async () => {
  const products = [
    {
      description: 'Produto 01',
      price: 10.00,
      quantity: 1
    },
    {
      description: 'Produto 02',
      price: 20.00,
      quantity: 2
    },
    {
      description: 'Produto 03',
      price: 30.00,
      quantity: 3
    }
  ];
  const totalPrice = 140.00
  const newOrder = {
    id: 1,
    totalPrice,
    products
  }
  const response = await request(app).post('/orders').send(products);
  expect(response.statusCode).toBe(201);
  expect(response.body).toMatchObject(newOrder)
})
