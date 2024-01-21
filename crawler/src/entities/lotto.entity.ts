import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'lotto' })
export class LottoEntity {
  @PrimaryColumn()
  id!: number

  @Column()
  one!: number

  @Column()
  two!: number

  @Column()
  three!: number

  @Column()
  four!: number

  @Column()
  five!: number

  @Column()
  bonus!: number
}