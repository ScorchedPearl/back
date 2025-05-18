import JWTService from "./jwtService";
class UserService{
 public static async verifyUser(token:string){
  const user= await JWTService.decodeToken(token||"");
  if(!user){
   return null;
  }
  return user;
 }
}
export default UserService;