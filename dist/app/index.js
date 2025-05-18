"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = initServer;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const jwtService_1 = __importDefault(require("../services/jwtService"));
const user_1 = require("./user");
const post_1 = require("./post");
const room_1 = require("./room");
const story_1 = require("./story");
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use(body_parser_1.default.json());
        const server = new server_1.ApolloServer({
            typeDefs: `
   ${user_1.User.Types}
   ${post_1.Post.types}
   ${room_1.Room.types}
   ${story_1.Story.types}
   type Query{
     ${user_1.User.queries}
     ${post_1.Post.query}
     ${room_1.Room.query}
     ${story_1.Story.query}
   }
   type Mutation{
     ${user_1.User.mutations}
     ${post_1.Post.mutations}
     ${room_1.Room.mutations}
     ${story_1.Story.mutations}
   }
    `,
            resolvers: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ Query: Object.assign(Object.assign(Object.assign(Object.assign({}, user_1.User.resolvers.queries), post_1.Post.resolvers.queries), room_1.Room.resolvers.queries), story_1.Story.resolvers.queries), Mutation: Object.assign(Object.assign(Object.assign(Object.assign({}, user_1.User.resolvers.mutations), post_1.Post.resolvers.mutations), room_1.Room.resolvers.mutations), story_1.Story.resolvers.mutations) }, post_1.Post.resolvers.PostResolvers), post_1.Post.resolvers.CommentResolvers), post_1.Post.resolvers.ReplyResolvers), user_1.User.resolvers.UserResolvers), user_1.User.resolvers.LikesResolvers), room_1.Room.resolvers.RoomResolvers), room_1.Room.resolvers.MessageResolvers), room_1.Room.resolvers.ReactionResolvers), story_1.Story.resolvers.StoryResolver),
        });
        yield server.start();
        app.use("/graphql", (0, express4_1.expressMiddleware)(server, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) {
                return {
                    user: req.headers.authorization ? yield jwtService_1.default.decodeToken(req.headers.authorization.split('Bearer ')[1] || '') : undefined
                };
            })
        }));
        return app;
    });
}
