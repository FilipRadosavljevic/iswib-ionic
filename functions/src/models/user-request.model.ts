export class UserRequest {
  constructor(
    public userId: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public role: string,
  ) {}
}
