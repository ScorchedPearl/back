import { prismaClient } from "../client/client.js";
import { GraphqlContext, Room } from "./interfaces.js";
import * as dotenv from "dotenv";
import { CreateRoomPayload } from "../app/room/types.js";
dotenv.config();
class RoomService {
  public static async getAllRooms() {
    const rooms = await prismaClient.room.findMany({
      orderBy: { 
       messages: {
         _count: "desc"
       }
      },
      include: {
        messages: {
         include:{
          author:true,
          reactions:{
            include:{
              author:true
            }
          }
         }
        },
        users:true
      }
    });
    return rooms;
  }
  public static async getRoomsById(userId: string) {
    const rooms=await prismaClient.room.findMany({
      orderBy: { 
        messages: {
          _count: "desc"
        }
       },
      where:{
        users:{
          some:{
            id:userId
          }
        }
      },
      include: {
        messages: {
         include:{
          author:true,
          reactions:{
            include:{
              author:true
            }
          }
         }
        },
        users:true
      }
    })
    return rooms
  }
  public static async createRoom(
    payload: CreateRoomPayload,
    ctx: GraphqlContext
  ) {
    if (!ctx.user) {
      throw new Error("You must be logged in to create a room");
    }
    console.log("Received payload:", payload);
    const room = await prismaClient.room.create({
      data: {
        name: payload.name,
        avatar: payload.avatar,
        users:{
         connect:payload.usersId.map((id)=>({id:id}))
        }
      },
    });
    // await redisClient.del("rooms");
    return room;
  }
  public static async getMessages(room: Room) {
    const messages = await prismaClient.message.findMany({
      where: {
        roomId: room.id,
      },
      include: {
        reactions: true,
      },
    });
    return messages;
  }
  public static async getReactions(parent: any) {
    const reactions = await prismaClient.reaction.findMany({
      where: {
        messageId: parent.id,
      },
    });
    return reactions;
  }
  public static async getUsers(room: Room) {
    const users = await prismaClient.user.findMany({
      where: {
        rooms: {
          some: {
            id: room.id,
          },
        },
      },
    });
    return users;
  }
  public static async getAuthor(parent: any) {
    const author = await prismaClient.user.findFirst({
      where: {
        id: parent.authorId,
      },
    });
    return author;
  }
}
export default RoomService;
