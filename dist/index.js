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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const app_1 = require("./app");
const dotenv = __importStar(require("dotenv"));
const ws_1 = require("ws");
const userService_1 = __importDefault(require("./wsservices/userService"));
const roomService_1 = __importDefault(require("./wsservices/roomService"));
const callservice_1 = __importDefault(require("./wsservices/callservice"));
dotenv.config();
const PORT = 8000;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield (0, app_1.initServer)();
        app.listen(PORT, '0.0.0.0', () => console.log(`server started at PORT: ${PORT}`));
    });
}
init();
const wss = new ws_1.WebSocketServer({ port: 8080, });
exports.users = [];
wss.on("connection", (ws, request) => __awaiter(void 0, void 0, void 0, function* () {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const user = yield userService_1.default.verifyUser(token);
    const userid = user === null || user === void 0 ? void 0 : user.id;
    if (!userid) {
        ws.send("Unauthorized");
        ws.close();
        return;
    }
    exports.users.push({ userid, ws, rooms: [] });
    ws.on("message", (message) => {
        const parsedData = JSON.parse(message.toString());
        if (parsedData.type === "join_room") {
            roomService_1.default.joinRoom(parsedData.roomId, ws);
        }
        if (parsedData.type === "leave_room") {
            roomService_1.default.leaveRoom(parsedData.roomId, ws);
        }
        if (parsedData.type === "message_in_room") {
            roomService_1.default.msgInRoom(parsedData.roomId, ws, parsedData.message, parsedData.userId, parsedData.imageURL);
        }
        if (parsedData.type === "reaction_in_room") {
            roomService_1.default.reactInRoom(parsedData.roomId, ws, parsedData.messageId, parsedData.reaction, parsedData.userId);
        }
        if (parsedData.type === "initiate_call") {
            callservice_1.default.initiateCall(parsedData.roomId, ws, parsedData.userId, parsedData.data);
        }
        if (parsedData.type === "answer_call") {
            callservice_1.default.answerCall(parsedData.roomId, ws, parsedData.data, parsedData.userId);
        }
        if (parsedData.type === "hangup_call") {
            callservice_1.default.hangupCall(parsedData.roomId, ws, parsedData.userId, parsedData.data);
        }
    });
}));
