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
const postService_1 = __importDefault(require("../../services/postService"));
const queries = {
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield postService_1.default.getAllPost();
    })
};
const mutations = {
    createPost: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        return yield postService_1.default.createPost(payload, ctx);
    }),
    createComment: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        if (!ctx.user) {
            throw new Error("You must be logged in to create a Comment");
        }
        return yield postService_1.default.createComment(payload, ctx);
    }),
    createReply: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        if (!ctx.user) {
            throw new Error("You must be logged in to create a Reply");
        }
        return yield postService_1.default.createReply(payload, ctx);
    })
};
const PostResolvers = {
    Post: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getAuthor(parent);
        }),
        likes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getLikes(parent);
        }),
        comments: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getComments(parent);
        })
    }
};
const CommentResolvers = {
    Comment: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getCommentAuthor(parent);
        }),
        replies: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getCommentReplies(parent);
        }),
        likes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getCommentLikes(parent);
        })
    }
};
const ReplyResolvers = {
    Reply: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getReplyAuthor(parent);
        }),
        likes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield postService_1.default.getReplyLikes(parent);
        })
    }
};
exports.resolvers = { mutations, PostResolvers, queries, CommentResolvers, ReplyResolvers };
