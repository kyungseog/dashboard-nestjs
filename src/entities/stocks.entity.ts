import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { WarehouseType } from './enums';

@Entity()
export class Stocks extends BaseEntity {
  @PrimaryColumn('char', { length: 10 })
  id: string;

  @Column({ type: 'enum', enum: WarehouseType })
  warehouse: WarehouseType;

  @Column('int')
  quantity: number;

  @Column('datetime')
  updated_at: Date;
}
