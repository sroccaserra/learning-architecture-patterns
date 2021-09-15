// @ts-check

const { expect } = require('chai');

const { Batch } = require('../src/batch');
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

/** @returns {[Batch, OrderLine]} */
function make_batch_and_line(sku, batch_qty, line_qty) {
  return [
    new Batch('batch-001', sku, {qty: batch_qty, eta: new Date()}),
    new OrderLine('order-123', sku, line_qty),
  ]
}
