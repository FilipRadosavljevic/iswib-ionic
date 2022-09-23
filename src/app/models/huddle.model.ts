export class Huddle {
  constructor(
    public huddleID: string,
    public creatorID: string,
    public time: string,
    public title: string,
    public description: string,
    public userIDs: string[],
    //public image?: string,
  ) {}
}
