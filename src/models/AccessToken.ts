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
  tableName: "oauth_access_tokens",
  underscored: true,
})
export default class AccessToken extends Model<AccessToken> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  public accessToken: string;

  @Column
  public accessTokenExpirationDate: Date;

  @Column
  public refreshToken: string;

  @Column
  public refreshTokenExpirationDate: Date;

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
