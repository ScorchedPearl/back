"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql
  type Message {   
    id: ID!
    text: String
    imageURL: String
    room: Room    
    roomId: String
    createdAt: DateTime     
    authorId: String
    author: User
    reactions: [Reaction]            
  }
  type Reaction{
    id: ID!
    type: String
    authorId: String!
    author: User!
    messageId: String
    message: Message
    postId: String
    post: Post
    createdAt: DateTime
    updatedAt: DateTime
  }
  input CreateRoomPayload{
    name: String
    usersId: [String]!
    avatar: String
  }
  scalar DateTime
  type Room {
    id: ID!
    messages: [Message]
    name: String
    avatar: String
    createdAt: DateTime!
    updatedAt: DateTime
    users: [User]
  }
`;
