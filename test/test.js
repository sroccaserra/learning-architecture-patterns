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

describe('Logic for what we cat allocate', function() {

//  def test_cannot_allocate_if_available_smaller_than_required():
//      small_batch, large_line = make_batch_and_line("ELEGANT-LAMP", 2, 20)
//      assert small_batch.can_allocate(large_line) is False
//
//  def test_can_allocate_if_available_equal_to_required():
//      batch, line = make_batch_and_line("ELEGANT-LAMP", 2, 2)
//      assert batch.can_allocate(line)
//
//  def test_cannot_allocate_if_skus_do_not_match():
//      batch = Batch("batch-001", "UNCOMFORTABLE-CHAIR", 100OrderLine(), eta=None)
//      different_sku_line = OrderLine("order-123", "EXPENSIVE-TOASTER", 10)
//      assert batch.can_allocate(different_sku_line) is False

  it('can allocate if available greater than required', function() {
      const [large_batch, small_line] = make_batch_and_line('ELEGANT-LAMP', 20, 2);
      expect(large_batch.can_allocate(small_line)).to.be.true;
  });
});

/** @returns {[Batch, OrderLine]} */
function make_batch_and_line(sku, batch_qty, line_qty) {
  return [
    new Batch('batch-001', sku, {qty: batch_qty, eta: new Date()}),
    new OrderLine('order-123', sku, line_qty),
  ]
}
