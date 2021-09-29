import * as _ from 'lodash';

import {OrderLine} from './order-line';

export function allocate(line: OrderLine, batches: Batch[]): string {
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

export type Eta = Date | null;

export class Batch {
  public ref: string
  public sku: string
  public eta: Eta
  private _purchased_quantity: number
  private _allocations: OrderLine[]

  constructor(ref: string, sku: string, qty: number, eta: Eta) {
    this.ref = ref;
    this.sku = sku;
    this.eta = eta;
    this._purchased_quantity = qty;
    this._allocations = [];
  }

  get available_quantity(): number {
    return this._purchased_quantity - this.allocated_quantity;
  }

  get allocated_quantity(): number {
    let result = 0;
    this._allocations.forEach((line) => {result += line.qty});
    return result;
  }

  allocate(line: OrderLine): void {
    if (this.can_allocate(line)) {
      this._allocations.push(line);
    }
  }

  can_allocate(line: OrderLine): boolean {
    if (this.sku != line.sku) {
      return false;
    }
    if (this._allocations.some((allocated_line) => allocated_line.equals(line))) {
      return false;
    }
    return this.available_quantity >= line.qty;
  }

  deallocate(line: OrderLine): void {
    this._allocations = this._allocations.filter((allocated_line) => {
       return !allocated_line.equals(line);
    })
  }
}

export class OutOfStockError extends Error {}
