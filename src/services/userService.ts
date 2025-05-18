import axios from "axios";
import { prismaClient } from "../client/client.js";
import { GoogleTokenResult, User, ImageSignedURLPayload, VideoSignedURLPayload } from "./interfaces.js";
import JWTService from "./jwtService.js";
import {
  CreateCredentialsTokenType,
  VerifyCredentialsTokenType,
} from "../app/user/types.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import nodemailer from "nodemailer";
import {z} from 'zod';
export const CreateUserSchema = z.object({
  email: z.string().email().min(3).max(50),
  password: z.string().min(6).max(25),
  name: z.string(),
});
export const SignInSchema = z.object({
  email: z.string().email().min(3).max(50),
  password: z.string().min(6).max(25),
});
export const CreateRoomSchema = z.object({
  slug: z.string().min(3).max(25),
  password: z.string().min(6).max(25),
});
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});
class UserService {
  public static async verifyGoogleAuthToken(token: string) {
    const googletoken = token;
    const googleoauthurl = new URL(
      "https://www.googleapis.com/oauth2/v3/userinfo"
    );
    const { data } = await axios.get<GoogleTokenResult>(
      googleoauthurl.toString(),
      {
        headers: {
          Authorization: `Bearer ${googletoken}`,
        },
        responseType: "json",
      }
    );
    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          name: data.given_name,
          profileImageURL: data.picture,
        },
      });
    }
    const userInDb = await prismaClient.user.findUnique({
      where: { email: data.email },
    });
    if (!userInDb) throw Error("User.email not found");
    const session = await JWTService.generateTokenForUser(userInDb);
    return session;
  }
  public static async getAllUser(id: string) {
    const users = await prismaClient.user.findMany({
      where: {
        NOT: {
          id: id,
        },
      },
      include: {
        followers: true,
        following: true,
        posts: true,
      },
    });
    return users;
  }
  public static async verifyCredentialsToken(payload: VerifyCredentialsTokenType) {
    const data = {
      email: payload.email as string,
      password: payload.password as string,
    };
    const d = SignInSchema.safeParse(data);
    if (!d.success) {
      throw new Error("Invalid Data");
    }
    const email = payload.email as string;
    const password = payload.password as string;
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("User not found. Redirect to signup page.");
    }
    if (user.password !== password) {
      throw new Error("Password Incorrect");
    }
    const session = await JWTService.generateTokenForUser(user);
    return session;
  }
  public static async createCredentialsToken(payload: CreateCredentialsTokenType) {
    const email = payload.email as string;
    const password = payload.password as string;
    const name = payload.name as string;
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new Error("User Already Exists. Redirect to signin page.");
    }
    const userInDb = await prismaClient.user.create({
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
    const session = await JWTService.generateTokenForUser(userInDb);
    return session;
  }
  public static async getCurrentUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: id,
      },
      include: {
        posts: {
          include: {
            likes: {
              include: {
                user: true,
              },
            },
          },
        },
        likes: true,
        followers: true,
        following: true,
        comments: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  public static async sendOtpEmail(email: string, otp: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
          user: "pearlautherizer@gmail.com",
          pass: "egjvzollbsxedjni",
        },
      });

      const mailOptions = {
        from: "pearlautherizer@gmail.com",
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
      };
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return false;
    }
  }
  public static async changePassword(email: string, newPassword: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    await prismaClient.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPassword,
      },
    });
    return true;
  }
  public static async followUser(from: string, to: string) {
    await prismaClient.follows.create({
      data: {
        follower: { connect: { id: from } },
        following: { connect: { id: to } },
      },
    });
    // await redisClient.del(`recommendedUsers:${ctx.user.id}`);
    return;
  }
  public static async unfollowUser(from: string, to: string) {
    await prismaClient.follows.delete({
      where: {
        followerid_followingid: {
          followerid: from,
          followingid: to,
        },
      },
    });
    // await redisClient.del(`recommendedUsers:${ctx.user.id}`);
    return;
  }
  public static async like(user: string, id:string,name:string) {
    if(name==="post"){
    await prismaClient.like.create({
      data: {
        userId: user,
        postId: id,
      },
    });
  }else if(name=='comment'){
    await prismaClient.like.create({
      data: {
        userId: user,
        commentId: id,
      },
    });
  }else if(name=='reply'){
    await prismaClient.like.create({
      data: {
        userId: user,
        replyId: id,
      },
    });
  }
  }
  public static async unlike(user: string, id:string,name:string) {
    if(name==="post"){
    await prismaClient.like.deleteMany({
      where: {
        userId: user,
        postId: id,
      },
    });
  }else if(name=='comment'){
    await prismaClient.like.deleteMany({
      where: {
        userId: user,
        commentId: id,
      },
    });
  }else if(name=='reply'){
    await prismaClient.like.deleteMany({
      where: {
        userId: user,
        replyId: id,
      },
    });
  }
  }
  public static async getFollowers(id: string) {
    const result = await prismaClient.follows.findMany({
      where: { following: { id: id } },
      include: {
        follower: true,
        following: true,
      },
    });
    return result.map((el) => el.follower);
  }
  public static async getFollowing(id: string) {
    const result = await prismaClient.follows.findMany({
      where: { follower: { id: id } },
      include: {
        follower: true,
        following: true,
      },
    });
    return result.map((el: any) => el.following);
  }
  public static async getRecommendedUsers(id: string) {
    // const cachedValue=await redisClient.get(`recommendedUsers:${id}`);
    // if(cachedValue) return JSON.parse(cachedValue);
    const myFollowing = await prismaClient.follows.findMany({
      where: { follower: { id: id } },
      include: {
        following: {
          include: {
            followers: {
              include: {
                following: true,
              },
            },
          },
        },
      },
    });
    const userToRecommend: User[] = [];
    for (const followings of myFollowing) {
      for (const follower of followings.following.followers) {
        if (
          follower.following.id !== id &&
          myFollowing.findIndex(
            (e: any) => e.followingid === follower.following.id
          ) < 0
        ) {
          userToRecommend.push(follower.following);
        }
      }
    }
    const uniqueArray = userToRecommend.filter(
      (item: any, index: number, self: any[]) =>
        index === self.findIndex((other: any) => other.id === item.id)
    );

    // await redisClient.set(`recommendedUsers:${id}`,JSON.stringify(uniqueArray));
    return uniqueArray;
  }
  public static async getSignedImageURL(payload: ImageSignedURLPayload) {
    if (!payload.ctx.user || !payload.ctx.user.id) {
      throw new Error("You must be logged in to create a post");
    }
    const allowedImagetype = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedImagetype.includes(payload.imageType)) {
      throw new Error("Invalid image type");
    }
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `upload/${payload.ctx.user.id}/post/${payload.imageName}-${Date.now()}.${payload.imageType}}`,
    });
    const signedURL = await getSignedUrl(s3Client, putObjectCommand);
    return signedURL;
  }
  public static async getSignedVideoURL(payload: VideoSignedURLPayload) {
    const allowedVideoType = ["video/mp4", "video/webm", "video/ogg","video/mov"];
    if (!allowedVideoType.includes(payload.videoType)) {
      throw new Error("Invalid video type");
    }
    if (!payload.ctx.user || !payload.ctx.user.id) {
      throw new Error("You must be logged in to upload a video");
    }
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `upload/${payload.ctx.user.id}/post/${payload.videoName}-${Date.now()}.${payload.videoType}}`,
    });
    const signedURL = await getSignedUrl(s3Client, putObjectCommand);
    return signedURL;
  }
  public static async getChartData(userId: string) {
    const likes = await prismaClient.like.findMany({
      where: {
        OR: [
          { post: { authorId: userId } },
          { comment: { authorId: userId } },
          { reply: { authorId: userId } },
          { story: { authorId: userId } },
        ],
      },
      include: {
        post: true,
        comment: true,
        reply: true,
        story: true,
      },
    });

    const comments = await prismaClient.comment.findMany({
      where: {
        post: { authorId: userId },
      },
    });

    const weeklyData = [
      { name: 'Mon', likes: 0, shares: 0, comments: 0 },
      { name: 'Tue', likes: 0, shares: 0, comments: 0 },
      { name: 'Wed', likes: 0, shares: 0, comments: 0 },
      { name: 'Thu', likes: 0, shares: 0, comments: 0 },
      { name: 'Fri', likes: 0, shares: 0, comments: 0 },
      { name: 'Sat', likes: 0, shares: 0, comments: 0 },
      { name: 'Sun', likes: 0, shares: 0, comments: 0 },
    ];

    const monthlyData = [
      { name: 'Week 1', likes: 0, shares: 0, comments: 0 },
      { name: 'Week 2', likes: 0, shares: 0, comments: 0 },
      { name: 'Week 3', likes: 0, shares: 0, comments: 0 },
      { name: 'Week 4', likes: 0, shares: 0, comments: 0 },
    ];

    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    

    likes.forEach((like: any) => {
          const likeDate = new Date(like.createdAt);
          if (likeDate >= startOfWeek) {
            const day = (likeDate.getDay() + 6) % 7; 
            weeklyData[day].likes += 1;
          }
          if (likeDate >= startOfMonth) {
            const week = Math.ceil((likeDate.getDate() + startOfMonth.getDay()-1) / 7);
            monthlyData[week - 1].likes += 1;
          }
        });

    comments.forEach((comment: any) => {
          const commentDate = new Date(comment.createdAt);
          if (commentDate >= startOfWeek) {
            const day = (commentDate.getDay() + 6) % 7; 
            weeklyData[day].comments += 1;
          }
          if (commentDate >= startOfMonth) {
            const week = Math.ceil(commentDate.getDate() / 7);
            monthlyData[week - 1].comments += 1;
          }
        });

    return { weeklyData, monthlyData };
  }
  public static async getRecentActivity(userId: string) {
    const userPosts = await prismaClient.post.findMany({
      where: { authorId: userId },
      include: {
      comments: {
        include:{
          author:true
        }
      },
      likes: {
        include: {
          user: true,
        },
      },
      },
    });

    const userComments = await prismaClient.comment.findMany({
      where: { authorId: userId },
      include: {
      replies: {
        include:{
          author:true
        }
      },
      likes: {
        include: {
          user: true,
        },
      }
  },});

    const userReplies = await prismaClient.reply.findMany({
      where: { authorId: userId },
      include: {
      likes: {
        include:{
          user:true
        }
      }
      },
    });

    const userStories = await prismaClient.story.findMany({
      where: { authorId: userId },
      include: {
      likes: {
        include: {
          user: true,
        },
      }
      },
    });

    const followers = await prismaClient.follows.findMany({
      where: { followingid: userId },
      include: {
      follower: true,
      },
    });
    const activities: {
      id: string;
      user: { name: string; avatar: string | null; username: string };
      action: string;
      content: string;
      time: Date;
    }[] = [];

    userPosts.forEach((post: any) => {
      post.comments.forEach((comment: any) => {
      activities.push({
        id: comment.id,
        user: { name: comment.author.name, avatar: comment.author.profileImageURL, username: comment.author.name },
        action: 'comment',
        content: `commented on your post`,
        time: comment.createdAt,
      });
      });
      post.likes.forEach((like: any) => {
      activities.push({
        id: like.id,
        user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
        action: 'like',
        content: `liked your post`,
        time: like.createdAt,
      });
      });
    });

    userComments.forEach((comment: any) => {
      comment.replies.forEach((reply: any) => {
      activities.push({
        id: reply.id,
        user: { name: reply.author.name, avatar: reply.author.profileImageURL, username: reply.author.name },
        action: 'reply',
        content: `replied to your comment`,
        time: reply.createdAt,
      });
      });
      comment.likes.forEach((like: any) => {
      activities.push({
        id: like.id,
        user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
        action: 'like',
        content: `liked your comment`,
        time: like.createdAt,
      });
      });
    });

    userReplies.forEach((reply: any) => {
      reply.likes.forEach((like: any) => {
      activities.push({
        id: like.id,
        user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
        action: 'like',
        content: `liked your reply`,
        time: like.createdAt,
      });
      });
    });

    userStories.forEach((story: any) => {
      story.likes.forEach((like: any) => {
        activities.push({
          id: like.id,
          user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
          action: 'like',
          content: `liked your story`,
          time: like.createdAt,
        });
      });
    });

    followers.forEach((follow: any) => {
      activities.push({
      id: follow.followerid,
      user: { name: follow.follower.name, avatar: follow.follower.profileImageURL, username: follow.follower.name },
      action: 'follow',
      content: 'started following you',
      time: follow.createdAt,
      });
    });

    activities.sort((a, b) => b.time.getTime() - a.time.getTime());

    return activities.slice(0, 5);
  }
}
export default UserService;

