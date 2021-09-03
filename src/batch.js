// @ts-check

/** @typedef {import('./order-line').OrderLine} OrderLine */

class Batch {
  /**
   * @param {string} ref
   * @param {string} sku
   * @param {object} obj
   * @param {number} obj.qty
   * @param {Date} obj.eta
   */
  constructor(ref, sku, {qty, eta}) {
    this.sku = sku;
    this.available_quantity = qty;
  }

  /**
   * @param {OrderLine} line
   */
  allocate(line) {
    this.available_quantity -= line.qty;
  }

  /**
   * @param {OrderLine} line
   * @returns {Boolean}
   */
  can_allocate(line) {
    if (this.sku != line.sku) {
      return false
    }
    return this.available_quantity >= line.qty;
  }
}

module.exports = {
  Batch,
}
