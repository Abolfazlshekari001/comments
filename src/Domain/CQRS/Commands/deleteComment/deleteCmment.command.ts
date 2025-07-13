export class deleteCommentCommand {
  constructor(body,commentId: any,postId:string,userId:string) {
    this.commentId = commentId;
    this.postId = postId;
    this.section = body.section;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
    this.userId = userId;

  }
  commentId: any;
  postId:string;
  section:string;
  system_name: string;
  system_password: string;
  userId:string;
}
