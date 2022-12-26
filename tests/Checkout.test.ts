import Checkout from "../src/Checkout";
import Mailer from "../src/Mailer";
import MailerConsole from "../src/MailerConsole";
import sinon from "sinon";
import ProductData from "../src/ProductData";
import CouponData from "../src/CouponData";
import CurrencyGateway from "../src/CurrencyGatewayRandom";

const productData: ProductData = {
  async getProduct(idProduct: number): Promise<any> {
    const products: { [idProduct: number]: any } = {
      1: { idProduct: 1, description: "A", price: 10, width: 10, height: 10, length: 10, weight: 0.9, currency: "BRL" },
      2: { idProduct: 2, description: "B", price: 20, width: 100, height: 30, length: 10, weight: 3, currency: "BRL" },
      3: { idProduct: 3, description: "C", price: 30, width: 200, height: 100, length: 50, weight: 40, currency: "BRL" },
      4: { idProduct: 4, description: "D", price: 100, width: 100, height: 30, length: 10, weight: 3, currency: "USD" },
    }
    return products[idProduct];
  }
}

const couponData: CouponData = {
  async getCoupon(code: string): Promise<any> {
    const coupons: any = {
      "COUPON10": { code: "COUPON10", percentage: 10, expire_date: new Date("2023-01-01 00:00:00") },
      "COUPON_EXPIRED": { code: "COUPON_EXPIRED", percentage: 14, expire_date: new Date("2021-01-01 00:00:00") }
    }
    return coupons[code];
  }
}

test('Deve criar um pedido com 3 produtos e calcular o valor total', async () => {
  const input = {
    cpf: '987.654.321-00',
    itens: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 2 },
      { productId: 3, quantity: 3 },
    ],
  };
  const checkout = new Checkout(productData, couponData);
  const output = await checkout.execute(input);
  expect(output.totalPrice).toBe(580)
})

test('Deve enviar um email ao final do checkout', async () => {
  const mailerSpy = sinon.spy(MailerConsole.prototype, 'send');
  const input = {
    cpf: '987.654.321-00',
    itens: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 2 },
      { productId: 3, quantity: 3 },
    ],
    email: 'test@example.com'
  }
  const checkout = new Checkout(productData, couponData);
  await checkout.execute(input);
  expect(mailerSpy.calledOnce).toBeTruthy();
  expect(mailerSpy.calledWith('test@example.com', 'Checkout Success', 'Total price: 580')).toBeTruthy();
  mailerSpy.restore();
})

test("Deve fazer um pedido com 4 produtos com moedas diferentes", async function () {
  const currencyGatewayStub = sinon.stub(CurrencyGateway.prototype, "getCurrencies").resolves({
    "BRL": 1,
    "USD": 2,
  });
  const mailerSpy = sinon.spy(MailerConsole.prototype, 'send');
  const input = {
    cpf: '987.654.321-00',
    itens: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 2 },
      { productId: 3, quantity: 3 },
      { productId: 4, quantity: 1 },

    ],
    email: 'test@example.com'
  }
  const checkout = new Checkout(productData, couponData);
  const output = await checkout.execute(input);
  expect(output.totalPrice).toBe(810);
  expect(mailerSpy.calledOnce).toBeTruthy();
  expect(mailerSpy.calledWith('test@example.com', 'Checkout Success', 'Total price: 810')).toBeTruthy();
  currencyGatewayStub.restore();
  mailerSpy.restore();
})