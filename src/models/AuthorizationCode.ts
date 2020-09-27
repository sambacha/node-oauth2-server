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

import Client from "@models/Client";
import User from "@models/User";

@Table({
  tableName: "oauth_authorization_codes",
  underscored: true,
})
export default class AuthorizationCode extends Model<AuthorizationCode> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  public authorizationCode: string;

  @Column
  public authorizationCodeExpirationDate: Date;

  @Column
  public scope: string;

  @ForeignKey(() => Client)
  @Column
  public clientId: number;

  @BelongsTo(() => Client)
  public client: Client;

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
