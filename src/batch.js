class Batch {
  constructor(ref, sku, {qty, eta}) {
    this.available_quantity = qty;
  }

  allocate(line) {
    this.available_quantity -= line.qty;
  }
}


module.exports = {
  Batch,
}
