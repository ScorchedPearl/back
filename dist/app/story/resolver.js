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
const storyService_1 = __importDefault(require("../../services/storyService"));
const queries = {
    getAllStories: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield storyService_1.default.getAllStories();
    }),
};
const mutations = {
    createStory: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        return yield storyService_1.default.createStory(payload, ctx);
    }),
};
const StoryResolver = {
    Story: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield storyService_1.default.getAuthor(parent);
        }),
        likes: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield storyService_1.default.getLikes(parent);
        })
    }
};
exports.resolvers = { mutations, queries, StoryResolver };
