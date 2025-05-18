export const mutations=`#graphql
    verifyGoogleToken(token:String!): String
    createCredentialsToken(email:String!,password:String!,name:String!): String
    changePassword(email:String!,newPassword:String!):Boolean
    followUser(to:ID!):Boolean
    unfollowUser(to:ID!):Boolean
    like(id:ID!,name:String!):Boolean
    unlike(id:ID!,name:String!):Boolean
`