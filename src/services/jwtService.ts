import { SignJWT, jwtVerify } from "jose";
import { JWTUser } from "./interfaces";
import dotenv from "dotenv";
import { JWTPayload } from "./interfaces";
import { User } from "./interfaces";
dotenv.config();

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET as string);

class JWTService{
  public static async generateTokenForUser(user:User){
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await JWTService.encrypt({ id:user.id, email:user.email,name:user.name,expiresAt:expiresAt });
    return session;
  }
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
  public static async encrypt(payload: JWTPayload) {
   return new SignJWT(payload)
     .setProtectedHeader({ alg: "HS256" })
     .setIssuedAt()
     .setExpirationTime("7d")
     .sign(encodedKey);
 }
}
export default JWTService;