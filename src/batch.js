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
    this._purchased_quantity = qty;
    this._allocations = [];
  }

  /** @returns {number} */
  get available_quantity() {
    return this._purchased_quantity - this.allocated_quantity;
  }

  /** @returns {number} */
  get allocated_quantity() {
    let result = 0;
    this._allocations.forEach((line) => {result += line.qty});
    return result;
  }

  /**
   * @param {OrderLine} line
   */
  allocate(line) {
    if (this.can_allocate(line)) {
      this._allocations.push(line);
    }
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

  /** @param {OrderLine} line */
  deallocate(line) {
    this._allocations = this._allocations.filter((allocated_line) => {
       return !allocated_line.equals(line);
    })
  }
}

module.exports = {
  Batch,
}
