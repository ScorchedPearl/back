import { jwtVerify } from "jose";
import { JWTUser } from "../interfaces";
import dotenv from "dotenv";
import { JWTPayload } from "./interfaces"
dotenv.config();

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET as string);

class JWTService{
  public static async decodeToken(token:string){
    if (!token) {
      console.log("No token provided");
      return undefined; 
    }
    try {
      const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ["HS256"],
      });
      const { id, name, email , expiresAt } = payload as JWTPayload;
      const user:JWTUser={
        id, email ,name, expiresAt:new Date(expiresAt)
      }
      return user;
    } catch (error) {
      console.error("Failed to verify token",error);
      return undefined;
    }
  }
}
export default JWTService;
