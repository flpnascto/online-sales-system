import express, { Request, Response } from 'express';
import pgp from "pg-promise";
import Checkout from './Checkout';
import CouponDataDatabase from './CouponDataDatabase';
import ProductDataDatabase from './ProductDataDatabase';

export const db = pgp()('postgres://postgres:postgres@localhost:3002');

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    this.app.get('/', (_req: Request, res: Response) => res.json({ ok: true }));
    this.app.post('/orders', async (req: Request, res: Response) => {
      try {
        const productData = new ProductDataDatabase();
        const couponData = new CouponDataDatabase();
        const checkout = new Checkout(db, productData, couponData);
        const output = await checkout.execute(req.body)
        return res.status(201).json(output);
      } catch (error: any) {
        return res.status(422).json({ message: error.message });
      }
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