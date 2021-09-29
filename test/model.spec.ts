import { expect } from 'chai';

import { Batch, allocate, OutOfStockError } from '../src/batch';
import { OrderLine } from '../src/order-line';

describe('Allocating to a batch', function() {
  it('reduces the available quantity', function() {
    const batch = new Batch('batch-001', 'SMALL-TABLE', 20, new Date())
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

  it('cannot allocate if available smaller than required 1/2', function() {
    const [large_batch, small_line] = make_batch_and_line('ELEGANT-LAMP', 2, 20);
    expect(large_batch.can_allocate(small_line)).to.be.false;
  });

  it('cannot allocate if available smaller than required 2/2', function() {
    const batch = new Batch('shipment-batch', 'RETRO-CLOCK', 10, get_tomorrow());
    allocate(new OrderLine('order1', 'RETRO-CLOCK', 10), [batch]);

    expect(batch.can_allocate(new OrderLine('order2', 'RETRO-CLOCK', 1))).to.be.false;
  });

  it('can allocate if available equal to required', function() {
    const [large_batch, small_line] = make_batch_and_line('ELEGANT-LAMP', 2, 2);
    expect(large_batch.can_allocate(small_line)).to.be.true;
  });

  it('cannot allocate if sku do not match', function() {
    const batch = new Batch('batch-001', 'UNCOMFORTABLE-CHAIR', 100, new Date())
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
    const in_stock_batch = new Batch('in-stock-batch', 'RETRO-CLOCK', 100, null);
    const shipment_batch = new Batch('shipment-batch', 'RETRO-CLOCK', 100, tomorrow);
    const line = new OrderLine('oref', 'RETRO-CLOCK', 10);

    allocate(line, [in_stock_batch, shipment_batch]);

    expect(in_stock_batch.available_quantity).to.equal(90)
    expect(shipment_batch.available_quantity).to.equal(100)
  });

  it('prefers current stock batches to shipments 2/2', function() {
    const tomorrow = get_tomorrow();
    const in_stock_batch = new Batch('in-stock-batch', 'RETRO-CLOCK', 100, null);
    const shipment_batch = new Batch('shipment-batch', 'RETRO-CLOCK', 100, tomorrow);
    const line = new OrderLine('oref', 'RETRO-CLOCK', 10);

    allocate(line, [shipment_batch, in_stock_batch]);

    expect(in_stock_batch.available_quantity).to.equal(90)
    expect(shipment_batch.available_quantity).to.equal(100)
  });

  it('prefers earlier batches', function() {
    const today = get_today();
    const tomorrow = get_tomorrow();
    const later = get_later_date();
    const earliest = new Batch('speedy-batch', 'MINIMALIST-SPOON', 100, today);
    const medium = new Batch('normal-batch', 'MINIMALIST-SPOON', 100, tomorrow);
    const latest = new Batch('slow-batch', 'MINIMALIST-SPOON', 100, later);
    const line = new OrderLine('oref', 'MINIMALIST-SPOON', 10);

    allocate(line, [medium, earliest, latest]);

    expect(earliest.available_quantity).to.equal(90)
    expect(medium.available_quantity).to.equal(100)
    expect(latest.available_quantity).to.equal(100)
  });

  it('returns allocated batch ref', function() {
    const tomorrow = get_tomorrow();
    const in_stock_batch = new Batch('in-stock-batch', 'RETRO-CLOCK', 100, null);
    const shipment_batch = new Batch('shipment-batch', 'RETRO-CLOCK', 100, tomorrow);
    const line = new OrderLine('oref', 'RETRO-CLOCK', 10);

    const allocation = allocate(line, [in_stock_batch, shipment_batch]);

    expect(allocation).to.equal(in_stock_batch.ref)
  });

  it('raises out of stock exception if cannot allocate', function() {
    const batch = new Batch('shipment-batch', 'RETRO-CLOCK', 10, get_tomorrow());
    allocate(new OrderLine('order1', 'RETRO-CLOCK', 10), [batch]);

    expect(() => allocate(new OrderLine('order2', 'RETRO-CLOCK', 1), [batch])).to.throw(OutOfStockError);
  });
});

function get_today(): Date {
  return get_date(0)
}

function get_tomorrow(): Date {
  return get_date(1)
}

function get_later_date(): Date {
  return get_date(10)
}

function get_date(days: number): Date {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
}

function make_batch_and_line(sku: string, batch_qty: number, line_qty: number): [Batch, OrderLine] {
  return [
    new Batch('batch-001', sku, batch_qty, new Date()),
    new OrderLine('order-123', sku, line_qty),
  ]
}
