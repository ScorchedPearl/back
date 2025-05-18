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
const __1 = require("..");
class CallService {
    static initiateCall(roomId, ws, userId, offer) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log("Initiating call to room:", roomId, "from user:", userId, "offer:", offer);
            const otherUserWs = (_a = __1.users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)) === null || _a === void 0 ? void 0 : _a.ws;
            const otherUserUserId = (_b = __1.users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)) === null || _b === void 0 ? void 0 : _b.userid;
            console.log("Other user WebSocket:", otherUserUserId);
            if (!otherUserWs) {
                ws.send(JSON.stringify({ error: "No other user found" }));
                return;
            }
            otherUserWs.send(JSON.stringify({
                type: "incoming_call",
                offer: offer,
                userId: userId
            }));
        });
    }
    static answerCall(roomId, ws, answer, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("Answering call to room:", roomId, "from user:", userId, "answer:", answer);
            const otherUserWs = (_a = __1.users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)) === null || _a === void 0 ? void 0 : _a.ws;
            if (!otherUserWs) {
                ws.send(JSON.stringify({ error: "No other user found" }));
                return;
            }
            otherUserWs.send(JSON.stringify({
                type: "call_answered",
                answer: answer,
                userId: userId
            }));
        });
    }
    static hangupCall(roomId, ws, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("Hanging up call in room:", roomId, "from user:", userId, "data:", data);
            const otherUserWs = (_a = __1.users.find((u) => u.rooms.includes(roomId) && u.ws !== ws)) === null || _a === void 0 ? void 0 : _a.ws;
            if (!otherUserWs) {
                ws.send(JSON.stringify({ error: "No other user found" }));
                return;
            }
            otherUserWs.send(JSON.stringify({
                type: "call_hungup",
                userId: userId
            }));
        });
    }
}
exports.default = CallService;
