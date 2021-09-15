// @ts-check

class OrderLine {
  /**
   * @param {string} order_id
   * @param {string} sku
   * @param {number} qty
   */
  constructor(order_id, sku, qty) {
    this.order_id = order_id;
    this.sku = sku;
    this.qty = qty;
  }

  equals(line) {
    return line instanceof OrderLine &&
      this.order_id === line.order_id &&
      this.sku === line.sku &&
      this.qty === line.qty
  }
}

module.exports = {
  OrderLine,
}
