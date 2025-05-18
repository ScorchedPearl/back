import { prismaClient } from "../client/client";
import { users } from "..";
import { WebSocket } from "ws";
class RoomService {
  public static async joinRoom(roomId: string, ws: WebSocket) {
    const roominDb = await prismaClient.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!roominDb) {
      ws.send(JSON.stringify({ error: "RoomNotFound" }));
      ws.close();
      return;
    }
    const user = users.find((u) => u.ws === ws);
    if (!user) {
      ws.send(JSON.stringify({ error: "User not found" }));
      ws.close();
      return;
    }
    user.rooms.push(roomId);
  }
  public static async leaveRoom(roomId: string, ws: WebSocket) {
    const user = users.find((u) => u.ws === ws);
    if (!user) {
      ws.send("User not found");
      ws.close();
      return;
    }
    const index = user.rooms.indexOf(roomId);
    if (index === -1) {
      ws.send("Room not found");
      return;
    }
    user.rooms.splice(index, 1);
  }
  public static async msgInRoom(roomId: string, ws: WebSocket, message: string ,userId:string,imageURL?:string){
    console.log("msgInRoom", roomId, message);
    const newMessage=await prismaClient.message.create({
      data: {
        room:{
          connect:{
            id:roomId
          }
        },
        text: message,
        author:{
          connect:{
            id:userId
          }
        },
        imageURL:imageURL
      },
    });
    users.forEach((u) => { 
      if (u.rooms.includes(roomId)&&u.ws!==ws) {
        u.ws.send(JSON.stringify({
         type:"message_in_room",
         message:message,
         messageId:newMessage.id,
         roomId:roomId,
         imageURL:imageURL,
         userId:userId
        })); 
       }
     });
    }
  public static async reactInRoom(roomId: string, ws: WebSocket, messageId: string,reaction:string,userId:string) {
    try {
      console.log("reactInRoom", roomId, messageId, reaction,userId);
      await prismaClient.$transaction(async (prisma) => {
        const reactionInDb = await prisma.reaction.findUnique({
          where: { authorId_messageId: { messageId, authorId: userId } },
        });
    
        let updatedReaction = reaction;
    
        if (reactionInDb) {
          if (reactionInDb.type === reaction) {
            await prisma.reaction.delete({ where: { id: reactionInDb.id } });
          } else {
            await prisma.reaction.update({
              where: { id: reactionInDb.id },
              data: { type: reaction },
            });
          }
        } else {
          await prisma.reaction.create({
            data: {
              message: { connect: { id: messageId } },
              type: reaction,
              author: { connect: { id: userId } },
            },
          });
        }
    
        users.forEach((u) => {
          if (u.rooms.includes(roomId) && u.ws !== ws) {
            u.ws.send(
              JSON.stringify({
                type: "reaction_in_room",
                messageId,
                roomId,
                reaction: updatedReaction,
              })
            );
          }
        });
      });
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  }
}
export default RoomService;
