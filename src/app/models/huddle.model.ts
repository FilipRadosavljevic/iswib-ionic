export class Huddle {
  constructor(
    public huddleID: string,
    public creatorID: string,
    public huddleDay: number,
    public time: string,
    public title: string,
    public description: string,
    public userIDs: string[],
    public location?: string,
    //public image?: string,
  ) {}
}
