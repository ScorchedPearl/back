export const types=`#graphql
  type Like {       
    createdAt: DateTime     
    userId: String     
    postId: String      
    user: User         
    post: Post  
    commentId: String
    comment: Comment
    replyId: String
    reply: Reply
    storyId: String
    story: Story       
  }
  input CreatePostData {
    content: String!
    imageURL: String
    videoURL: String
  }
  scalar DateTime
  type Post {
    id: ID!
    content: String!
    imageURL: String
    videoURL: String 
    createdAt: DateTime!
    updatedAt: DateTime
    author: User!
    likes: [Like]
    comments: [Comment]
  }
  input CreateCommentData {
    content: String!
    imageURL: String
    postid: ID!
  }
  type Comment {
    id: ID!
    content: String!
    imageURL: String
    public:Boolean
    author: User!
    authorId: String
    post: Post!
    postid: ID!
    replies: [Reply]
    likes:[Like]
    createdAt: DateTime!
    updatedAt: DateTime
  }
  type Reply{
    id: ID!
    content: String!
    imageURL: String
    commentId: String!
    comment:Comment!
    authorId: String!
    author: User!
    likes:[Like]
    createdAt: DateTime!
    updatedAt: DateTime
  }
  input CreateReplyData{
    content:String!
    imageURL:String
    commentId:String!
  }
`;
export interface CreatePostPayload{
  content: string
  imageURL: string
  videoURL: string
}
export interface CreateCommentData {
  content: string
  imageURL?: string
  postid: string
}