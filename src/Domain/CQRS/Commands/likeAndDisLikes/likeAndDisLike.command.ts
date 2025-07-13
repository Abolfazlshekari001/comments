export class likeAndDisLikeCommentCommand {
    constructor(req:any,body: any,commentId: any,postId:string,userId:string) {
        this.req = req;
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.system_name =body.system_name;
        this.system_password = body.system_password;
        this.like = body.like;
        this.dislike = body.dislike;
        this.section = body.section;
    
      }
      req:any;
      commentId: any;
      postId:string;
      userId:string;
      system_name:string;
      system_password:string;
      like:boolean;
      dislike:boolean;
      section:string;
  }
  