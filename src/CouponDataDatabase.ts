import CouponData,  { ICoupon } from './CouponData';
import pgp from 'pg-promise';

export default class CouponDataDatabase implements CouponData {

	async getCoupon(code: string): Promise<ICoupon> {
		const connection = pgp()('postgres://postgres:postgres@localhost:3002');
    const query = 'SELECT * FROM sales_system.coupons WHERE description = $1'
		const [coupon] = await connection.query<ICoupon[]>(query, [code]);
		await connection.$pool.end();
		return coupon;
	}

}
