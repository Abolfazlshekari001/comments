export class updateCommentCommand {
  constructor(req: any, body: any, commentId: any, postId: string) {
    this.req = req;
    this.comment_text = body.comment_text;
    this.system_name = body.system_name;
    this.system_password = body.system_password;
    this.section = body.section;
    this.rating = body.rating;
    this.commentId = commentId;
    this.postId = postId;
  }
  req: any;
  body: any;
  comment_text: string;
  system_name: string;
  system_password: string;
  section: string;
  rating: number;
  commentId: any;
  postId: string;
}
