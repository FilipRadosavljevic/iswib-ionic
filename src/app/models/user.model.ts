export class User {
  constructor(
    public userID: string,
    public role: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public profilePic: string
  ) {}
}
