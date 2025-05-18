import { prismaClient } from "../client/client.js";
import { GraphqlContext } from "./interfaces.js";
import * as dotenv from "dotenv";
import { CreateStoryPayload } from "../app/story/types.js";
dotenv.config();

class StoryService {
  public static async getAllStories() {
    const posts = prismaClient.story.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        likes: {
          include: {
            user: true,
          },
        },
      },
    });
    return posts;
  }
  public static async createStory(
    payload: CreateStoryPayload,
    ctx: GraphqlContext
  ) {
    if (!ctx.user) {
      throw new Error("You must be logged in to create a post");
    }
    console.log("Received payload:", payload);
    const story = await prismaClient.story.create({
      data: {
        imageURL: payload.imageURL,
        videoURL: payload.videoURL,
        author: {
          connect: {
            id: ctx.user.id,
          },
        },
      },
    });
    return story;
  }
  public static async getAuthor(story: any) {
    return await prismaClient.user.findUnique({
      where:{
        id:story.authorId
      }
    })
  }
  public static async getLikes(story: any) {
    return await prismaClient.like.findMany({
      where:{
        storyId:story.id
      }
    })
  }
}
export default StoryService;
