export class  replyCommentCommand {
    constructor(req: any, body: any,commentId:any,postId:string) {
        this.req = req;
        this.name= body.name; 
        this.comment_text = body.comment_text;  
        this.email =body.email;
        this.system_name =body.system_name;
        this.system_password = body.system_password;
        this.userId = body.userId;
        this.section = body.sction;
        this.commentId = commentId;
        this.postId = postId;
    }
    req: any;
    body: any;
    name:string;
    comment_text:string;
    email:string;
    system_name:string;
    system_password:string;
    section:string;
    commentId:any;
    postId:string;
    userId:string;
}