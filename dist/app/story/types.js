"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql
  input CreateStoryData {
    imageURL: String
    videoURL: String
  }
  type Story {
    id: ID!
    imageURL: String
    videoURL: String 
    createdAt: DateTime!
    updatedAt: DateTime
    author: User!
    likes: [Like]
  }
`;
