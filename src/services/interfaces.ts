export interface GoogleTokenResult {
 email:string;
 email_verified:string;
 given_name:string;
 name:string;
 picture:string;
 sub?:string;
}
export interface JWTPayload extends JWTUser{
 [key: string]: any; 
}
export interface ImageSignedURLPayload{
 imageType:string;
 imageName:string;
 ctx:GraphqlContext;
}
export interface VideoSignedURLPayload{
  videoType:string;
  videoName:string;
  ctx:GraphqlContext;
}
export type User = {
 id: string;
 email: string;
 name: string;
 password: string|null;
 createdAt: Date;
 updatedAt: Date;
 posts?:Post[]
}
export interface JWTUser{
 id: string;
 email: string;
 expiresAt: Date;
 name:string;
}
export interface GraphqlContext{
 user?: JWTUser
}
export interface Post{
  id: string
  content: string
  imageURL?: string
  createdAt: Date
  updatedAt: Date
  author: User
  likes: Like[]
}
export interface Like{       
  createdAt: Date  
  userId: string     
  postId: string      
  user: User         
  post: Post         
}
export interface Room {
  id: string
  messages: Message[]
  name?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  users: [User]
}
export interface Reaction{
  id: string
  type: string
  authorId: string
  author: User
  messageId?: string
  message?: Message
  postId?: String
  post?: Post
  createdAt: Date
  updatedAt: Date
}
export interface Message {   
  id: string
  text: string
  imageUrl: string
  room: Room    
  roomId: string
  createdAt: Date    
  authorId: string
  author: User
  reactions: [Reaction]            
}

export interface Story{
  id: string
  content: string
  imageURL?: string
  videoURL?: string
  createdAt: Date
  updatedAt: Date
  likes: Like[]
  reactions: Reaction[]
  author: User
  authorId: string
}
export interface ChartData{
  weeklyData:{
    name:string
    likes:number
    shares:number
    comments:number
  }
  monthlyData:{
    name:string
    likes:number
    shares:number
    comments:number
  }
}