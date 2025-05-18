"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
 verifyCredentialsToken(email:String!,password:String!): String
 getCurrentUser: User
 getAllUser:[User]
 sendOtpEmail(email:String!,otp:String!):Boolean
 getSignedUrlForImage(imageName:String!,imageType:String!):String
 getSignedUrlForVideo(videoName:String!,videoType:String!):String
 getChartData(userId:String!):ChartData
 getRecentActivity(userId:String!):[Activity]
`;
