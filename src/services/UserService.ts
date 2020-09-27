import bcrypt from "bcrypt";
import NodeSsh from "node-ssh";
import { Op } from "sequelize";

import User from "@models/User";

import Logger from "@util/logger";

import UserUpdates from "UserUpdates";
import UserGetOptions from "UserGetOptions";
import EmailService from "@services/EmailService";

export default class UserService {
  /**
   * Add new user
   * @param userData
   */
  public static async addUser(userData: Partial<User>): Promise<boolean> {
    try {
      userData.password = await bcrypt.hash(userData.password, 10);
      const newUser = new User(userData);
      await newUser.save();
      return true;
    } catch (err) {
      Logger.log("error", "UserService addUser error", { err });
      return false;
    }
  }

  /**
   * Returns all users
   * @param opts
   */
  public static async getUsers(opts?: UserGetOptions): Promise<User[]> {
    try {
      if (opts) {
        return await User.findAll({
          where: {
            ...opts,
          },
        });
      }

      return await User.findAll();
    } catch (err) {
      Logger.log("error", "UserService getUsers error", { err });
      return null;
    }
  }

  /**
   * Returns user based on username and password
   * @param username
   * @param password
   */
  public static async getUserByLoginAndPassword(username: string, password: string): Promise<User> {
    try {
      const user = await User.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        Logger.log("info", `This user doesn't exists! (${username})`);
        return null;
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        Logger.log("info", `Incorrect password for user! (${username})`);
        return null;
      }

      return user;
    } catch (err) {
      Logger.log("error", "UserService getUserByLoginAndPassword error", { err });
      return null;
    }
  }

  /**
   * Gets user by ID
   * @param id
   */
  public static async getUserById(id: number): Promise<User> {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        Logger.log("info", `This user doesn't exists! (${id})`);
        return null;
      }

      return user;
    } catch (err) {
      Logger.log("error", "UserService getUserById error", { err });
      return null;
    }
  }

  /**
   * Finds users based on username or email
   * @param input
   * @param opts
   */
  public static async findUserByUsernameOrEmail(input: string, opts?: UserGetOptions): Promise<User[]> {
    try {
      const searchOpts = {
        where: {
          [Op.or]: [
            {
              username: {
                [Op.like]: `%${input}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${input}%`,
              },
            },
          ],
        },
      };

      if (opts) {
        searchOpts.where = {
          ...searchOpts.where,
          ...opts,
        };
      }

      return await User.findAll(searchOpts);
    } catch (err) {
      Logger.log("error", "UserService findUserByUsernameOrEmail", { err });
      return [];
    }
  }

  /**
   * Import all users from certain year via Taurus SSH connection
   * @param beginningYear
   * @param taurusUser
   * @param taurusPassword
   */
  public static async importUsers(beginningYear: number, taurusUser: string, taurusPassword: string): Promise<boolean> {
    try {
      const ssh = new NodeSsh();
      await ssh.connect({
        host: "taurus.fis.agh.edu.pl",
        username: taurusUser,
        password: taurusPassword,
        tryKeyboard: true,
        onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
          if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes("password")) {
            finish([taurusPassword]);
          }
        },
      });

      const result = await ssh.execCommand("ls", { cwd: `/home/stud${beginningYear}` });

      await ssh.dispose();

      const userNames = result.stdout.split("\n");

      return await UserService.importUsersFromArray(userNames, beginningYear);
    } catch (err) {
      Logger.log("error", "UserService importUsers error", { err });
      return false;
    }
  }

  /**
   * Updates user by ID
   * @param id
   * @param updates
   */
  public static async updateUser(id: number, updates: UserUpdates): Promise<boolean> {
    try {
      if (updates.password.length === 0) {
        delete updates.password;
      } else {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      await User.update(updates, {
        where: {
          id,
        },
      });
      return true;
    } catch (err) {
      Logger.log("error", "UserService updateUser error", { err });
      return false;
    }
  }

  /**
   * Import users by array of names
   * @param userNames
   * @param beginningYear
   * @param fieldOfStudy
   */
  public static async importUsersFromArray(
    userNames: string[],
    beginningYear: number,
    fieldOfStudy?: FieldOfStudy,
  ): Promise<boolean> {
    try {
      const promises = userNames.map(username => {
        const password = Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 15);
        return UserService.addUser({
          username,
          email: `${username}@fis.agh.edu.pl`,
          password,
          fieldOfStudy: fieldOfStudy ? fieldOfStudy : FieldOfStudy.AppliedCS, // Unfortunately we have no way to distinguish different FOSes
          beginningYear,
          privilege: Privilege.Student,
        }).then(async () => {
          await EmailService.sendEmail(
            `${username}@fis.agh.edu.pl`,
            "Dostep do WFIIS Accounts",
            `Czesc!<br>
            Twoje konto z Taurusa zostalo zaimportowane do systemu WFiIS Accounts - otrzymujesz miedzy innymi dostep do wiki wydzialowej!<br>
            Aby sie zalogowac skorzystaj z ponizszych hasel:<br>
            username: ${username}<br>
            haslo: ${password}<br><br>
            
            link: <a href="https://accounts.wfiis.pl/">https://accounts.wfiis.pl/</a><br><br>
            
            Wiki wydzialowa dostepna pod linkiem: <a href="https://wiki.wfiis.pl/">https://wiki.wfiis.pl/</a>
            Kliknij "WFiIS OAUTH2", aby zalogowac sie swoim kontem WFiIS.<br>
            Wiecej instrukcji powinno sie pojawic na Waszych grupach kierunkowych na FB.<br>
            W razie pytan prosze kontaktowac sie ze swoim starostom roku.<br><br>
            
            Prosze nie kontaktowac sie na ten adres mailowy - nie odpiszemy.<br><br>
            
            Pozdrawiamy,<br>
            KNI Kernel.
            `,
          );
        });
      });

      await Promise.all(promises);

      return true;
    } catch (err) {
      Logger.log("error", "UserService importUsersFromArray error", { err });
      return false;
    }
  }
}
