import CouponData from "./CouponData";
import validateCPF from "./utils/validateCPF";

interface IProduct {
  id: number;
  description: string;
  price: number;
  height: number;
  width: number;
  length: number;
  weight: number;
}

interface IOrderProduct {
  productId: number;
  quantity: number;
}

interface IOrder {
  cpf: string;
  itens: IOrderProduct[];
  coupon:string;
}

export default class Checkout {
  
  constructor(readonly db: any, readonly coupon: CouponData) {}

  async execute(input: IOrder) {
      if (! input.cpf || !validateCPF(input.cpf)) {
        throw new Error('Invalid CPF');
      }
      let totalPrice = 0;
      const productsIds: number[] = [];
      let freight = 0
      for (const item of input.itens) {
        if (item.quantity <= 0) {
          throw new Error('Product quantity must be positive number');
        }
        if (productsIds.some((id) => id === item.productId)) {
          throw new Error('Duplicated product');
        } else {
          productsIds.push(item.productId);
        }
        const [product] = await this.db.query('SELECT * FROM sales_system.products where id = $1', [item.productId]);
        if (product) {
          // Valor do Frete = distância (km) * volume (m3) * (densidade/100)
          const distance = 1000;
          const volume = (product.height/100) * (product.width/100) * (product.length/100);
          const density = product.weight/volume;
          const itemFreight = distance * volume * density/100;
          freight += (itemFreight >= 10) ? itemFreight : 10;
          totalPrice += product.price * item.quantity;
        } else {
          throw new Error('Product not found')
        };
      };
      if (input.coupon){
        const coupon = await this.coupon.getCoupon(input.coupon)
        if (coupon &&  coupon.expire_date.getTime() > (new Date()).getTime()) {
          totalPrice -= (totalPrice * coupon.percentage) / 100;
        }
      }
      totalPrice += freight;
      const { id } = await this.db.one('INSERT INTO sales_system.orders(total_price) VALUES($1) RETURNING id', [totalPrice])
      return { id, totalPrice }
  }
}

function pgp() {
    throw new Error("Function not implemented.");
}
