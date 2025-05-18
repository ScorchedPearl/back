export const types=`#graphql
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
export interface CreateStoryPayload{
  imageURL?: string
  videoURL?: string
}