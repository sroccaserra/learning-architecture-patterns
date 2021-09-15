// @ts-check

const _ = require('lodash');

/** @typedef {import('./order-line').OrderLine} OrderLine */

/**
 * @param {OrderLine} line
 * @param {Batch[]} batches
 * @returns {string}
 */
function allocate(line, batches) {
  const sorted = _.orderBy(batches, [(batch) => batch.eta ? 1 : 0, (batch) => batch.eta], ['asc']);

  let batch_index = 0;
  let can_allocate = false
  let batch = sorted[batch_index];

  while(batch_index < sorted.length) {
    if (batch.can_allocate(line)) {
      can_allocate = true;
      break;
    }
    batch = sorted[batch_index];
    batch_index += 1;
  }

  if (!can_allocate) {
    throw new OutOfStockError(`Out of stock for sku ${line.sku}`)
  }

  batch.allocate(line);
  return batch.ref
}

class Batch {
  /**
   * @param {string} ref
   * @param {string} sku
   * @param {object} obj
   * @param {number} obj.qty
   * @param {Date|null} obj.eta
   */
  constructor(ref, sku, {qty, eta}) {
    this.ref = ref;
    this.sku = sku;
    this.eta = eta;
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
      return false;
    }
    if (this._allocations.some((allocated_line) => allocated_line.equals(line))) {
      return false;
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

class OutOfStockError extends Error {}

module.exports = {
  allocate,
  Batch,
  OutOfStockError,
};
