export class GetPostRatingsAverageQuery  {
    constructor(req: any, body: any, postIds: string) {
      this.req = req;
      this.postIds = postIds;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
      this.section = body.section;
    }
    req: any;
    postIds: string;
    system_name: string;
    system_password: string;
    section: string;
  }

  