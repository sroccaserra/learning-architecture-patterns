const { expect } = require('chai');

const { Batch } = require('../src/batch');
const { OrderLine } = require('../src/order-line');

describe('allocating to a batch', function() {
  it('reduces the available quantity', function() {
    const batch = new Batch('batch-001', 'SMALL-TABLE', {qty: 20, eta: new Date()})
    const line = new OrderLine('order-ref', 'SMALL-TABLE', 2)

    batch.allocate(line);

    expect(batch.available_quantity).to.equal(18);
  });
});
