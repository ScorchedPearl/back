"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
exports.Types = `#graphql
type User{
 id:ID!
 email:String!
 name:String!
 profileImageURL:String
 title:String
 posts:[Post]
 likes:[Like]
 stories:[Story]
 rooms:[Room]
 createdAt:DateTime!
 updatedAt:DateTime
 recommendedUsers:[User]
 followers:[User]
 following:[User]
}
type WeeklyData {
  name: String!
  likes: Int!
  shares: Int!
  comments: Int!
}

type MonthlyData {
  name: String!
  likes: Int!
  shares: Int!
  comments: Int!
}

type ChartData {
  weeklyData: [WeeklyData]
  monthlyData: [MonthlyData]
}
type Activity{
  id:ID!
  user:ReturnUser!
  action:String!
  content:String!
  time:DateTime!
}
type ReturnUser{
  name:String
  avatar:String
  username:String
}
`;
