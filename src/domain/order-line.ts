export class OrderLine {
  public order_id: string
  public sku: string
  public qty: number

  constructor(order_id: string, sku: string, qty: number) {
    this.order_id = order_id;
    this.sku = sku;
    this.qty = qty;
  }

  equals(line: OrderLine): boolean {
    return line instanceof OrderLine &&
      this.order_id === line.order_id &&
      this.sku === line.sku &&
      this.qty === line.qty
  }
}
