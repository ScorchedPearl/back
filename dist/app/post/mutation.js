"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
  createPost(payload:CreatePostData!):Post
  createComment(payload:CreateCommentData!):Comment
  createReply(payload:CreateReplyData!):Reply
`;
