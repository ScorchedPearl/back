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
exports.resolvers = void 0;
const roomService_1 = __importDefault(require("../../services/roomService"));
const queries = {
    getAllRooms: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield roomService_1.default.getAllRooms();
    }),
    getRoomsById: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user) {
            throw new Error("User not authenticated");
        }
        return yield roomService_1.default.getRoomsById(ctx.user.id);
    })
};
const mutations = {
    createRoom: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        return yield roomService_1.default.createRoom(payload, ctx);
    }),
};
const RoomResolvers = {
    Room: {
        messages: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield roomService_1.default.getMessages(parent);
        }),
        users: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield roomService_1.default.getUsers(parent);
        })
    }
};
const MessageResolvers = {
    Message: {
        reactions: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield roomService_1.default.getReactions(parent);
        }),
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield roomService_1.default.getAuthor(parent);
        })
    }
};
const ReactionResolvers = {
    Reaction: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield roomService_1.default.getAuthor(parent);
        })
    }
};
exports.resolvers = { mutations, MessageResolvers, queries, RoomResolvers, ReactionResolvers };
