export const queries=`#graphql
 verifyCredentialsToken(email:String!,password:String!): String
 getCurrentUser: User
 getAllUser:[User]
 sendOtpEmail(email:String!,otp:String!):Boolean
 getSignedUrlForImage(imageName:String!,imageType:String!):String
 getSignedUrlForVideo(videoName:String!,videoType:String!):String
 getChartData(userId:String!):ChartData
 getRecentActivity(userId:String!):[Activity]
`