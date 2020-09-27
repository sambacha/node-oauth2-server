export default interface UserUpdates {
  username: string;
  email: string;
  password?: string;
  beginningYear?: number;
  fieldOfStudy?: FieldOfStudy;
  privilege?: Privilege;
}
