import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'speetto' })
export class SpeettoEntity {
  @PrimaryColumn({ name: 'drw_no', type: 'smallint' })
  drwNo: number;

  @Column({ primary: true, name: 'speetto_type', type: 'smallint' })
  speettoType: number;

  @Column({ name: 'first_prize_date', type: 'datetime', nullable: true })
  firstPrizeDate: Date;

  @Column({ name: 'first_winamnt' })
  firstWinAmnt: string;

  @Column({ name: 'first_win_cnt', type: 'int' })
  firstWinCnt: number;

  @Column({ name: 'second_prize_date', type: 'datetime', nullable: true })
  secondPrizeDate: Date;

  @Column({ name: 'second_winamnt' })
  secondWinAmnt: string;

  @Column({ name: 'second_win_cnt', type: 'int' })
  secondWinCnt: number;

  @Column({ name: 'third_prize_date', type: 'datetime', nullable: true })
  thirdPrizeDate: Date;

  @Column({ name: 'third_winamnt' })
  thirdWinAmnt: string;

  @Column({ name: 'third_win_cnt', type: 'int' })
  thirdWinCnt: number;

  @Column({ name: 'sale_date', type: 'datetime', nullable: true })
  saleDate: Date;

  @Column({ name: 'sale_rate', type: 'smallint' })
  saleRate: number;
}
