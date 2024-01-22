import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'lotto' })
export class LottoEntity {
  @PrimaryColumn({ name: 'id', type: 'smallint' })
  id: number;

  @Column({ name: 'one', type: 'tinyint' })
  one: number;

  @Column({ name: 'two', type: 'tinyint' })
  two: number;

  @Column({ name: 'three', type: 'tinyint' })
  three: number;

  @Column({ name: 'four', type: 'tinyint' })
  four: number;

  @Column({ name: 'five', type: 'tinyint' })
  five: number;

  @Column({ name: 'bonus', type: 'tinyint' })
  bonus: number;
}
