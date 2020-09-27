import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "users",
  underscored: true,
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Unique
  @Column
  public username: string;

  @Column
  public password: string;

  @Unique
  @IsEmail
  @Column
  public email: string;

  @Column
  public beginningYear: number;

  @Column({
    type: DataType.ENUM("Student", "Foreman", "Admin"),
  })
  public privilege: Privilege;

  @Column({
    type: DataType.ENUM("AppliedCS", "TechnicalPH", "MedicalPH", "NanoTech", "NanoInz"),
  })
  public fieldOfStudy: FieldOfStudy;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;

  @DeletedAt
  public deletedAt: Date;
}
