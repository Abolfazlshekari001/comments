export class GetUserCommentsInSystemQuery {
    constructor(req: any, userId: string, body: any) {
      this.req = req;
      this.userId = userId;
      this.system_name = body.system_name;
      this.system_password = body.system_password;
      this.section = body.section;
    }
    req: any;
    userId: string;
    system_name: string;
    system_password: string;
    section: string;
  }
  