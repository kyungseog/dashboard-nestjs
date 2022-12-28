import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Suppliers extends BaseEntity {
  @PrimaryColumn('int')
  id: number;

  @Column('char')
  integration_code: string;

  @Column('char')
  supplier_code: string;

  @Column('varchar')
  name: string;
}
