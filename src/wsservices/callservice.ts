import { users } from "..";
import { WebSocket } from "ws";
class CallService{
 public static async initiateCall(roomId:string,ws:WebSocket,userId:string,offer:RTCSessionDescriptionInit){
   console.log("Initiating call to room:", roomId,"from user:", userId,"offer:", offer);
   const otherUserWs=users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)?.ws;
   const otherUserUserId=users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)?.userid;
   console.log("Other user WebSocket:", otherUserUserId);
   if(!otherUserWs){
     ws.send(JSON.stringify({error:"No other user found"}));
     return;
   }
   otherUserWs.send(JSON.stringify({
     type:"incoming_call",
     offer:offer,
     userId:userId
   }));
 }
 public static async answerCall(roomId:string,ws:WebSocket,answer:RTCSessionDescriptionInit,userId:string){
   console.log("Answering call to room:", roomId,"from user:", userId,"answer:", answer);
  const otherUserWs=users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)?.ws;
   if(!otherUserWs){
     ws.send(JSON.stringify({error:"No other user found"}));
     return;
   }
   otherUserWs.send(JSON.stringify({
     type:"call_answered",
     answer:answer,
     userId:userId
   }));
 }
 public static async hangupCall(roomId:string,ws:WebSocket,userId:string,data:string){
   console.log("Hanging up call in room:", roomId,"from user:", userId,"data:", data);
  const otherUserWs=users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)?.ws;
   if(!otherUserWs){
     ws.send(JSON.stringify({error:"No other user found"}));
     return;
   }
   otherUserWs.send(JSON.stringify({
     type:"call_hungup",
     userId:userId
   }));
 }
}

export default CallService;