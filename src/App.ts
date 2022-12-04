import express, { Request, Response } from 'express';
import pgp from "pg-promise";

const db = pgp()("postgres://postgres:postgres@localhost:3002");

interface IProduct {
  id: number;
  description: string;
  price: number;
}

interface IOrderProduct {
  productId: number;
  quantity: number;
}
interface IOrder {
  id: number;
  products: IOrderProduct[];
  totalPrice:number;
}
class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    this.app.get('/', (_req: Request, res: Response) => res.json({ ok: true }));
    this.app.post('/orders', async (req: Request, res: Response) => {
      // const orderProducts = req.body as IOrderProduct[];
      let totalPrice = 0;
      for (const item of req.body.itens) {
        const [product] = await db.query<IProduct[]>("SELECT * FROM sales_system.products where id = $1", [item.productId]);
        if (product) {
          totalPrice += product.price * item.quantity;
        } else {
          return res.status(422).json({
            message: "Product not found"
          });
        }
      };

      const { id } = await db.one('INSERT INTO sales_system.orders(total_price) VALUES($1) RETURNING id', [totalPrice])

      const newOrder = { id: 1, totalPrice }
      return res.status(201).json(newOrder)
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