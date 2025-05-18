
import { GraphqlContext, User } from "../../services/interfaces";
import UserService from "../../services/userService";
import { CreateCredentialsTokenType, VerifyCredentialsTokenType } from "./types";
import { prismaClient } from "../../client/client";
const queries={
 verifyCredentialsToken:async(parent:any,payload:VerifyCredentialsTokenType)=>{
  const session=UserService.verifyCredentialsToken(payload);
  return session;
 },
 getCurrentUser:async(parent:any,args:any,ctx:GraphqlContext)=>{
  const id=ctx.user?.id;
  if(!id){
   throw new Error("Unauthorized");
  }
  const user=await UserService.getCurrentUser(id);
  return user;
 },
 sendOtpEmail:async(parent:any,{email,otp}:{email:string,otp:string})=>{
  const sent= UserService.sendOtpEmail(email,otp);
  return sent;
 },
 getSignedUrlForImage:async (parent:any,{imageType,imageName}:{imageType:string,imageName:string},ctx:GraphqlContext)=>{
  return await UserService.getSignedImageURL({imageType,imageName,ctx});
 },
 getSignedUrlForVideo:async (parent:any,{videoType,videoName}:{videoType:string,videoName:string},ctx:GraphqlContext)=>{
  return await UserService.getSignedVideoURL({videoType,videoName,ctx});
 },
 getChartData:async(parent:any,{userId}:{userId:string})=>{
  return await UserService.getChartData(userId);
 },
 getRecentActivity:async(parent:any,{userId}:{userId:string})=>{
  return await UserService.getRecentActivity(userId);
 },
 getAllUser:async(parent:any,args:any,ctx:GraphqlContext)=>{
  if (!ctx.user || !ctx.user.id) {
    throw new Error("User not authenticated");
  }
  const users=await UserService.getAllUser(ctx.user.id);
  return users;
 }
}
const mutations={
 createCredentialsToken:async(parent:any,payload:CreateCredentialsTokenType)=>{
  const session=UserService.createCredentialsToken(payload);
  return session;
 },
 verifyGoogleToken:async(parent:any,{token}:{token:string})=>{
  const session=UserService.verifyGoogleAuthToken(token);
  return session;
 },
 changePassword:async(parent:any,{email,newPassword}:{email:string,newPassword:string})=>{
  const success=await UserService.changePassword(email,newPassword);
  return success;
 },
 followUser:async (parent:any,{to}:{to:string},ctx:GraphqlContext)=>{
  if(!ctx.user||!ctx.user.id) throw new Error("User not authenticated");
  await UserService.followUser(ctx.user.id,to);
  return true;

},
unfollowUser:async (parent:any,{to}:{to:string},ctx:GraphqlContext)=>{
  if(!ctx.user||!ctx.user.id) throw new Error("User not authenticated");
  await UserService.unfollowUser(ctx.user.id,to);
  
  return true;

},
like:async (parent:any,{id,name}:{id:string,name:string},ctx:GraphqlContext)=>{
  if(!ctx.user||!ctx.user.id) throw new Error("User not authenticated");
  await UserService.like(ctx.user.id,id,name);
  return true;
},
unlike:async (parent:any,{id,name}:{id:string,name:string},ctx:GraphqlContext)=>{
  if(!ctx.user||!ctx.user.id) throw new Error("User not authenticated");
  await UserService.unlike(ctx.user.id,id,name);
  return true;
}
}
const UserResolvers={
 User:{
   posts:async (parent:User)=>{
     return await prismaClient.post.findMany({where:{authorId:parent.id}})
   },
   followers:async (parent:User)=>{
     return UserService.getFollowers(parent.id);
   },
   following:async (parent:User)=>{
     return UserService.getFollowing(parent.id);
   },
   recommendedUsers:async (parent:User,_:any,ctx:GraphqlContext)=>{
     if(!ctx.user||!ctx.user.id) throw new Error("User not authenticated");
     return UserService.getRecommendedUsers(ctx.user.id);
   },
   likes: async (parent:User)=>{
      return await prismaClient.like.findMany({where:{userId:parent.id}})
   }
 }
}
const LikesResolvers={
 Like:{
    user:async (parent:any)=>{
      return await prismaClient.user.findUnique({where:{id:parent.userId}})
    },
 }
}
export const resolvers={queries,mutations,UserResolvers,LikesResolvers};