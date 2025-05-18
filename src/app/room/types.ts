export const types=`#graphql
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
export interface CreateRoomPayload{
  name?: string
  avatar?: string
  usersId: string[]
}