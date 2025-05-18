import { WebSocket } from "ws";
export interface JWTUser{
 id: string;
 email: string;
 expiresAt: Date;
 name:string;
}

export interface User{
 userid: string;
 ws: WebSocket;
 rooms: string[];
}