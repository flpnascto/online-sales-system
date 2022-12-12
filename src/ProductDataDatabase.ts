import ProductData, { IProduct } from "./ProductData";
import pgp from 'pg-promise';

export default class ProductDataDatabase implements ProductData{
    async getProduct(id: number): Promise<IProduct> {
      const connection = pgp()('postgres://postgres:postgres@localhost:3002');
      const query = 'SELECT * FROM sales_system.products where id = $1';
      const [product] = await connection.query<IProduct[]>(query, [id]);
      await connection.$pool.end();
      return product;
    }
}
