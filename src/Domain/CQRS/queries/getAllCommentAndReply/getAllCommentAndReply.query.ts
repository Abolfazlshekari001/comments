export class AllCommentAndGetReplyQuery {
    constructor(req: any, body: any) {
      this.req = req;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
      this.section = body.section;
    }
    req: any;
    system_name: string;
    system_password: string;
    section: string;
  }
  