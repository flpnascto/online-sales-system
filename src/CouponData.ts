export interface ICoupon {
  id: number,
  description: string,
  percentage: number,
  expire_date: Date,
}

export default interface CouponData {
  getCoupon (code: string): Promise<ICoupon>;
}