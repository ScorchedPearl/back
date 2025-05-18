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
const userService_1 = __importDefault(require("../../services/userService"));
const client_1 = require("../../client/client");
const queries = {
    verifyCredentialsToken: (parent, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const session = userService_1.default.verifyCredentialsToken(payload);
        return session;
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            throw new Error("Unauthorized");
        }
        const user = yield userService_1.default.getCurrentUser(id);
        return user;
    }),
    sendOtpEmail: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { email, otp }) {
        const sent = userService_1.default.sendOtpEmail(email, otp);
        return sent;
    }),
    getSignedUrlForImage: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { imageType, imageName }, ctx) {
        return yield userService_1.default.getSignedImageURL({ imageType, imageName, ctx });
    }),
    getSignedUrlForVideo: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { videoType, videoName }, ctx) {
        return yield userService_1.default.getSignedVideoURL({ videoType, videoName, ctx });
    }),
    getChartData: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { userId }) {
        return yield userService_1.default.getChartData(userId);
    }),
    getRecentActivity: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { userId }) {
        return yield userService_1.default.getRecentActivity(userId);
    }),
    getAllUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user || !ctx.user.id) {
            throw new Error("User not authenticated");
        }
        const users = yield userService_1.default.getAllUser(ctx.user.id);
        return users;
    })
};
const mutations = {
    createCredentialsToken: (parent, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const session = userService_1.default.createCredentialsToken(payload);
        return session;
    }),
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        const session = userService_1.default.verifyGoogleAuthToken(token);
        return session;
    }),
    changePassword: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { email, newPassword }) {
        const success = yield userService_1.default.changePassword(email, newPassword);
        return success;
    }),
    followUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("User not authenticated");
        yield userService_1.default.followUser(ctx.user.id, to);
        return true;
    }),
    unfollowUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("User not authenticated");
        yield userService_1.default.unfollowUser(ctx.user.id, to);
        return true;
    }),
    like: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { id, name }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("User not authenticated");
        yield userService_1.default.like(ctx.user.id, id, name);
        return true;
    }),
    unlike: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { id, name }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("User not authenticated");
        yield userService_1.default.unlike(ctx.user.id, id, name);
        return true;
    })
};
const UserResolvers = {
    User: {
        posts: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield client_1.prismaClient.post.findMany({ where: { authorId: parent.id } });
        }),
        followers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return userService_1.default.getFollowers(parent.id);
        }),
        following: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return userService_1.default.getFollowing(parent.id);
        }),
        recommendedUsers: (parent, _, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            if (!ctx.user || !ctx.user.id)
                throw new Error("User not authenticated");
            return userService_1.default.getRecommendedUsers(ctx.user.id);
        }),
        likes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield client_1.prismaClient.like.findMany({ where: { userId: parent.id } });
        })
    }
};
const LikesResolvers = {
    Like: {
        user: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield client_1.prismaClient.user.findUnique({ where: { id: parent.userId } });
        }),
    }
};
exports.resolvers = { queries, mutations, UserResolvers, LikesResolvers };
