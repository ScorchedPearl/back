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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../client/client");
const __1 = require("..");
class RoomService {
    static joinRoom(roomId, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            const roominDb = yield client_1.prismaClient.room.findUnique({
                where: {
                    id: roomId,
                },
            });
            if (!roominDb) {
                ws.send(JSON.stringify({ error: "RoomNotFound" }));
                ws.close();
                return;
            }
            const user = __1.users.find((u) => u.ws === ws);
            if (!user) {
                ws.send(JSON.stringify({ error: "User not found" }));
                ws.close();
                return;
            }
            user.rooms.push(roomId);
        });
    }
    static leaveRoom(roomId, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = __1.users.find((u) => u.ws === ws);
            if (!user) {
                ws.send("User not found");
                ws.close();
                return;
            }
            const index = user.rooms.indexOf(roomId);
            if (index === -1) {
                ws.send("Room not found");
                return;
            }
            user.rooms.splice(index, 1);
        });
    }
    static msgInRoom(roomId, ws, message, userId, imageURL) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("msgInRoom", roomId, message);
            const newMessage = yield client_1.prismaClient.message.create({
                data: {
                    room: {
                        connect: {
                            id: roomId
                        }
                    },
                    text: message,
                    author: {
                        connect: {
                            id: userId
                        }
                    },
                    imageURL: imageURL
                },
            });
            __1.users.forEach((u) => {
                if (u.rooms.includes(roomId) && u.ws !== ws) {
                    u.ws.send(JSON.stringify({
                        type: "message_in_room",
                        message: message,
                        messageId: newMessage.id,
                        roomId: roomId,
                        imageURL: imageURL,
                        userId: userId
                    }));
                }
            });
        });
    }
    static reactInRoom(roomId, ws, messageId, reaction, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reactInRoom", roomId, messageId, reaction, userId);
                yield client_1.prismaClient.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    const reactionInDb = yield prisma.reaction.findUnique({
                        where: { authorId_messageId: { messageId, authorId: userId } },
                    });
                    let updatedReaction = reaction;
                    if (reactionInDb) {
                        if (reactionInDb.type === reaction) {
                            yield prisma.reaction.delete({ where: { id: reactionInDb.id } });
                        }
                        else {
                            yield prisma.reaction.update({
                                where: { id: reactionInDb.id },
                                data: { type: reaction },
                            });
                        }
                    }
                    else {
                        yield prisma.reaction.create({
                            data: {
                                message: { connect: { id: messageId } },
                                type: reaction,
                                author: { connect: { id: userId } },
                            },
                        });
                    }
                    __1.users.forEach((u) => {
                        if (u.rooms.includes(roomId) && u.ws !== ws) {
                            u.ws.send(JSON.stringify({
                                type: "reaction_in_room",
                                messageId,
                                roomId,
                                reaction: updatedReaction,
                            }));
                        }
                    });
                }));
            }
            catch (error) {
                console.error("Error handling reaction:", error);
            }
        });
    }
}
exports.default = RoomService;
