export class User {
  constructor(
    public userId: string,
    public role: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public workshopId?: string,
    public profilePic?: string,
  ) {}
}
