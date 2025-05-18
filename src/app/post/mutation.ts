export const mutations=`#graphql
  createPost(payload:CreatePostData!):Post
  createComment(payload:CreateCommentData!):Comment
  createReply(payload:CreateReplyData!):Reply
`;