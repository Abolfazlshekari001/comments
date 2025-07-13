export class GetOneCommentQuery {
  constructor(req: any, commentId: string, postId: string, body: any) {
    this.req = req;
    this.commentId = commentId;
    this.postId = postId;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
    this.section = body.section;
  }
  req: any;
  commentId: string;
  postId: string;
  system_name: string;
  system_password: string;
  section: string;
}
