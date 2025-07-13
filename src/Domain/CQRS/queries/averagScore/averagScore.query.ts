export class GetRatingAverageQuery  {
    constructor(req:any, body: any, postId: any) {
      this.req = req;
      this.postId = postId;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
      this.section = body.section;
    }
    req: any;
    postId: any;
    system_name: string;
    system_password: string;
    section: string;
  }

  