import {Batch} from './batch';

export interface BatchRepository {
  add(batch: Batch): Promise<void>;
  get(reference: string): Promise<Batch>;
}
