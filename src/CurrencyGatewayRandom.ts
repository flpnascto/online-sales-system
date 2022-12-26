import CurrencyGateway from "./CurrencyGateway";

export default class CurrencyGatewayRandom implements CurrencyGateway {
  async getCurrencies(): Promise<any> {
    return {
      "BRL": 1,
      "USD": 2 + Math.random(),
    }
  }
}