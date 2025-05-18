"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_js_1 = require("../client/client.js");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class RoomService {
    static getAllRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield client_js_1.prismaClient.room.findMany({
                orderBy: {
                    messages: {
                        _count: "desc"
                    }
                },
                include: {
                    messages: {
                        include: {
                            author: true,
                            reactions: {
                                include: {
                                    author: true
                                }
                            }
                        }
                    },
                    users: true
                }
            });
            return rooms;
        });
    }
    static getRoomsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield client_js_1.prismaClient.room.findMany({
                orderBy: {
                    messages: {
                        _count: "desc"
                    }
                },
                where: {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                },
                include: {
                    messages: {
                        include: {
                            author: true,
                            reactions: {
                                include: {
                                    author: true
                                }
                            }
                        }
                    },
                    users: true
                }
            });
            return rooms;
        });
    }
    static createRoom(payload, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.user) {
                throw new Error("You must be logged in to create a room");
            }
            console.log("Received payload:", payload);
            const room = yield client_js_1.prismaClient.room.create({
                data: {
                    name: payload.name,
                    avatar: payload.avatar,
                    users: {
                        connect: payload.usersId.map((id) => ({ id: id }))
                    }
                },
            });
            // await redisClient.del("rooms");
            return room;
        });
    }
    static getMessages(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield client_js_1.prismaClient.message.findMany({
                where: {
                    roomId: room.id,
                },
                include: {
                    reactions: true,
                },
            });
            return messages;
        });
    }
    static getReactions(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactions = yield client_js_1.prismaClient.reaction.findMany({
                where: {
                    messageId: parent.id,
                },
            });
            return reactions;
        });
    }
    static getUsers(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield client_js_1.prismaClient.user.findMany({
                where: {
                    rooms: {
                        some: {
                            id: room.id,
                        },
                    },
                },
            });
            return users;
        });
    }
    static getAuthor(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield client_js_1.prismaClient.user.findFirst({
                where: {
                    id: parent.authorId,
                },
            });
            return author;
        });
    }
}
exports.default = RoomService;
