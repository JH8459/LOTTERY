import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'lotto' })
export class LottoEntity {
  @PrimaryColumn({ name: 'drw_no', type: 'smallint' })
  drwNo: number;

  @Column({ name: 'drwt_no_1', type: 'tinyint' })
  drwtNo1: number;

  @Column({ name: 'drwt_no_2', type: 'tinyint' })
  drwtNo2: number;

  @Column({ name: 'drwt_no_3', type: 'tinyint' })
  drwtNo3: number;

  @Column({ name: 'drwt_no_4', type: 'tinyint' })
  drwtNo4: number;

  @Column({ name: 'drwt_no_5', type: 'tinyint' })
  drwtNo5: number;

  @Column({ name: 'drwt_no_6', type: 'tinyint' })
  drwtNo6: number;

  @Column({ name: 'bnus_no', type: 'tinyint' })
  bnusNo: number;

  @Column({ name: 'first_winamnt', type: 'double' })
  firstWinamnt: number;

  @Column({ name: 'first_przwner_co', type: 'smallint' })
  firstPrzwnerCo: number;

  @Column({ name: 'second_winamnt', type: 'double' })
  secondWinamnt: number;

  @Column({ name: 'second_przwner_co', type: 'smallint' })
  secondPrzwnerCo: number;

  @Column({ name: 'third_winamnt', type: 'double' })
  thirdWinamnt: number;

  @Column({ name: 'third_przwner_co', type: 'smallint' })
  thirdPrzwnerCo: number;

  @Column({ name: 'drw_no_date', type: 'datetime' })
  drwNoDate: Date;
}
