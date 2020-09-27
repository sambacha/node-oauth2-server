import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import User from "@models/User";

@Table({
  tableName: "oauth_clients",
  underscored: true,
})
export default class Client extends Model<Client> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  public clientId: string;

  @Column
  public clientSecret: string;

  @Column
  public redirectUris: string;

  @Column
  public grants: string;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;

  @DeletedAt
  public deletedAt: Date;
}
