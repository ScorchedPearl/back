import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import JWTService from "../services/jwtService";
import { Express } from "express";
import { User } from "./user";
import { Post } from "./post";
import { Room } from "./room";
import { Story } from "./story";
export async function initServer(): Promise<Express>{
  const app=express();
  app.use(cors());
  app.use(bodyParser.json());
  const server=new ApolloServer({
   typeDefs:`
   ${User.Types}
   ${Post.types}
   ${Room.types}
   ${Story.types}
   type Query{
     ${User.queries}
     ${Post.query}
     ${Room.query}
     ${Story.query}
   }
   type Mutation{
     ${User.mutations}
     ${Post.mutations}
     ${Room.mutations}
     ${Story.mutations}
   }
    `,
    resolvers:{
      Query:{
        ...User.resolvers.queries,
        ...Post.resolvers.queries,
        ...Room.resolvers.queries,
        ...Story.resolvers.queries
       },
       Mutation:{
        ...User.resolvers.mutations,
        ...Post.resolvers.mutations,
        ...Room.resolvers.mutations,
        ...Story.resolvers.mutations
       },
       ...Post.resolvers.PostResolvers,
       ...Post.resolvers.CommentResolvers,
       ...Post.resolvers.ReplyResolvers,
       ...User.resolvers.UserResolvers,
       ...User.resolvers.LikesResolvers,
       ...Room.resolvers.RoomResolvers,
       ...Room.resolvers.MessageResolvers,
       ...Room.resolvers.ReactionResolvers,
       ...Story.resolvers.StoryResolver
    },
  });
  await server.start();
  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => {
      return {
        user: req.headers.authorization ? await JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1] || '') : undefined
      };
    }
  }) as unknown as express.RequestHandler);
  return app;
}