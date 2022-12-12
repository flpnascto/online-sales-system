import express, { Request, Response } from 'express';
import pgp from "pg-promise";
import validateCPF from './utils/validateCPF'

export const db = pgp()("postgres://postgres:postgres@localhost:3002");

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
class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    this.app.get('/', (_req: Request, res: Response) => res.json({ ok: true }));
    this.app.post('/orders', async (req: Request, res: Response) => {
      const orderProducts = req.body as IOrder;
      if (! orderProducts.cpf || !validateCPF(orderProducts.cpf)) {
        return res.status(422).json({ message: 'Invalid CPF'})
      }
      let totalPrice = 0;
      const productsIds: number[] = [];
      let freight = 0
      for (const item of orderProducts.itens) {
        if (item.quantity <= 0) {
          return res.status(422).json({ message: 'Product quantity must be positive number' });
        }
        if (productsIds.some((id) => id === item.productId)) {
          return res.status(422).json({ message: 'Duplicated product' });
        } else {
          productsIds.push(item.productId);
        }
        const [product] = await db.query<IProduct[]>('SELECT * FROM sales_system.products where id = $1', [item.productId]);
        if (product) {
          // Valor do Frete = distância (km) * volume (m3) * (densidade/100)
          const distance = 1000;
          const volume = (product.height/100) * (product.width/100) * (product.length/100);
          const density = product.weight/volume;
          const itemFreight = distance * volume * density/100;
          freight += itemFreight;
          totalPrice += product.price * item.quantity;
        } else {
          return res.status(422).json({
            message: "Product not found"
          });
        }
      };
      if (req.body.coupon){
        const [coupon] = await db.query('SELECT * FROM sales_system.coupons WHERE description = $1', [req.body.coupon])
        if (coupon &&  coupon.expire_date.getTime() > (new Date()).getTime()) {
          totalPrice -= (totalPrice * coupon.percentage) / 100;
        }
      }
      totalPrice += freight;
      const { id } = await db.one('INSERT INTO sales_system.orders(total_price) VALUES($1) RETURNING id', [totalPrice])
      return res.status(201).json({ id, totalPrice })
    });
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();