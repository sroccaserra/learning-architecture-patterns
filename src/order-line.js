class OrderLine {
  constructor(order_id, sku, qty) {
    this.order_id = order_id;
    this.sku = sku;
    this.qty = qty;
  }
}

module.exports = {
  OrderLine,
}
