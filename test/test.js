// @ts-check

const { expect } = require('chai');

const { Batch, allocate } = require('../src/batch');
const { OrderLine } = require('../src/order-line');

describe('Allocating to a batch', function() {
  it('reduces the available quantity', function() {
    const batch = new Batch('batch-001', 'SMALL-TABLE', {qty: 20, eta: new Date()})
    const line = new OrderLine('order-ref', 'SMALL-TABLE', 2)

    batch.allocate(line);

    expect(batch.available_quantity).to.equal(18);
  });
});

describe('Logic for allocation', function() {
  it('can allocate if available greater than required', function() {
    const [large_batch, small_line] = make_batch_and_line('ELEGANT-LAMP', 20, 2);
    expect(large_batch.can_allocate(small_line)).to.be.true;
  });

  it('cannot allocate if available smaller than required', function() {
    const [large_batch, small_line] = make_batch_and_line('ELEGANT-LAMP', 2, 20);
    expect(large_batch.can_allocate(small_line)).to.be.false;
  });

  it('can allocate if available equal to required', function() {
    const [large_batch, small_line] = make_batch_and_line('ELEGANT-LAMP', 2, 2);
    expect(large_batch.can_allocate(small_line)).to.be.true;
  });

  it('cannot allocate if sku do not match', function() {
    const batch = new Batch('batch-001', 'UNCOMFORTABLE-CHAIR', {qty: 100, eta: new Date()})
    const line = new OrderLine('order-123', 'EXPENSIVE-TOASTER', 10)
    expect(batch.can_allocate(line)).to.be.false;
  });

  it('is idempotent', function() {
    const [batch, line] = make_batch_and_line('ANGULAR-DESK', 20, 2);
    batch.allocate(line)
    batch.allocate(line);
    expect(batch.available_quantity).to.equal(18);
  });
});

describe('Logic for deallocation', function() {
  it('can deallocate allocated lines', function() {
    const [batch, line] = make_batch_and_line('DECORATIVE-TRINKET', 20, 2);
    batch.allocate(line)
    batch.deallocate(line);
    expect(batch.available_quantity).to.equal(20);
  });

  it('can only deallocate allocated lines', function() {
    const [batch, unallocated_line] = make_batch_and_line('DECORATIVE-TRINKET', 20, 2);
    batch.deallocate(unallocated_line);
    expect(batch.available_quantity).to.equal(20);
  });
});

describe('Stocks', function() {
  it('prefers current stock batches to shipments 1/2', function() {
    const tomorrow = get_tomorrow();
    const in_stock_batch = new Batch('in-stock-batch', 'RETRO-CLOCK', {qty: 100, eta: null});
    const shipment_batch = new Batch('shipment-batch', 'RETRO-CLOCK', {qty: 100, eta: tomorrow});
    const line = new OrderLine('oref', 'RETRO-CLOCK', 10);

    allocate(line, [in_stock_batch, shipment_batch]);

    expect(in_stock_batch.available_quantity).to.equal(90)
    expect(shipment_batch.available_quantity).to.equal(100)
  });

  it('prefers current stock batches to shipments 2/2', function() {
    const tomorrow = get_tomorrow();
    const in_stock_batch = new Batch('in-stock-batch', 'RETRO-CLOCK', {qty: 100, eta: null});
    const shipment_batch = new Batch('shipment-batch', 'RETRO-CLOCK', {qty: 100, eta: tomorrow});
    const line = new OrderLine('oref', 'RETRO-CLOCK', 10);

    allocate(line, [shipment_batch, in_stock_batch]);

    expect(in_stock_batch.available_quantity).to.equal(90)
    expect(shipment_batch.available_quantity).to.equal(100)
  });

  it('prefers earlier batches', function() {
    const today = get_today();
    const tomorrow = get_tomorrow();
    const later = get_later_date();
    const earliest = new Batch('speedy-batch', 'MINIMALIST-SPOON', {qty: 100, eta: today});
    const medium = new Batch('normal-batch', 'MINIMALIST-SPOON', {qty: 100, eta: tomorrow});
    const latest = new Batch('slow-batch', 'MINIMALIST-SPOON', {qty: 100, eta: later});
    const line = new OrderLine('oref', 'MINIMALIST-SPOON', 10);

    allocate(line, [medium, earliest, latest]);

    expect(earliest.available_quantity).to.equal(90)
    expect(medium.available_quantity).to.equal(100)
    expect(latest.available_quantity).to.equal(100)
  });
});

 /** @returns {Date} */
function get_today() {
  return get_date(0)
}

 /** @returns {Date} */
function get_tomorrow() {
  return get_date(1)
}

 /** @returns {Date} */
function get_later_date() {
  return get_date(10)
}

/**
 * @param {number} days
 * @returns {Date}
  * */
function get_date(days) {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
}

/** @returns {[Batch, OrderLine]} */
function make_batch_and_line(sku, batch_qty, line_qty) {
  return [
    new Batch('batch-001', sku, {qty: batch_qty, eta: new Date()}),
    new OrderLine('order-123', sku, line_qty),
  ]
}
