import { GraphqlContext, Message, Reaction, Room } from "../../services/interfaces";
import RoomService from "../../services/roomService";
import { CreateRoomPayload } from "./types";

const queries={
  getAllRooms:async()=>{ 
    return await RoomService.getAllRooms();
  },
  getRoomsById:async(parent:any,args:any,ctx:GraphqlContext)=>{
    if (!ctx.user) {
      throw new Error("User not authenticated");
    }
    return await RoomService.getRoomsById(ctx.user.id);
  }
}
const mutations={
  createRoom:async (parent:any,{payload}:{payload:CreateRoomPayload},ctx:GraphqlContext)=>{
    return await RoomService.createRoom(payload,ctx);
  },
};
const RoomResolvers={
  Room:{
    messages:async(parent:Room)=>{
      return await RoomService.getMessages(parent);
    },
    users:async(parent:Room)=>{
      return await RoomService.getUsers(parent);
    }
  }
}
const MessageResolvers={
  Message:{
    reactions:async(parent:Message)=>{
      return await RoomService.getReactions(parent);
    },
    author:async(parent:Message)=>{
      return await RoomService.getAuthor(parent);
    }
  }
}
const ReactionResolvers={
  Reaction:{
    author:async(parent:Reaction)=>{
      return await RoomService.getAuthor(parent);
    }
  }
}
export const resolvers={mutations,MessageResolvers,queries,RoomResolvers,ReactionResolvers};