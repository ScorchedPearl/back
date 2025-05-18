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
exports.CreateRoomSchema = exports.SignInSchema = exports.CreateUserSchema = void 0;
const axios_1 = __importDefault(require("axios"));
const client_js_1 = require("../client/client.js");
const jwtService_js_1 = __importDefault(require("./jwtService.js"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const nodemailer_1 = __importDefault(require("nodemailer"));
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(3).max(50),
    password: zod_1.z.string().min(6).max(25),
    name: zod_1.z.string(),
});
exports.SignInSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(3).max(50),
    password: zod_1.z.string().min(6).max(25),
});
exports.CreateRoomSchema = zod_1.z.object({
    slug: zod_1.z.string().min(3).max(25),
    password: zod_1.z.string().min(6).max(25),
});
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
});
class UserService {
    static verifyGoogleAuthToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const googletoken = token;
            const googleoauthurl = new URL("https://www.googleapis.com/oauth2/v3/userinfo");
            const { data } = yield axios_1.default.get(googleoauthurl.toString(), {
                headers: {
                    Authorization: `Bearer ${googletoken}`,
                },
                responseType: "json",
            });
            const user = yield client_js_1.prismaClient.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                yield client_js_1.prismaClient.user.create({
                    data: {
                        email: data.email,
                        name: data.given_name,
                        profileImageURL: data.picture,
                    },
                });
            }
            const userInDb = yield client_js_1.prismaClient.user.findUnique({
                where: { email: data.email },
            });
            if (!userInDb)
                throw Error("User.email not found");
            const session = yield jwtService_js_1.default.generateTokenForUser(userInDb);
            return session;
        });
    }
    static getAllUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield client_js_1.prismaClient.user.findMany({
                where: {
                    NOT: {
                        id: id,
                    },
                },
                include: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            });
            return users;
        });
    }
    static verifyCredentialsToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                email: payload.email,
                password: payload.password,
            };
            const d = exports.SignInSchema.safeParse(data);
            if (!d.success) {
                throw new Error("Invalid Data");
            }
            const email = payload.email;
            const password = payload.password;
            const user = yield client_js_1.prismaClient.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (!user) {
                throw new Error("User not found. Redirect to signup page.");
            }
            if (user.password !== password) {
                throw new Error("Password Incorrect");
            }
            const session = yield jwtService_js_1.default.generateTokenForUser(user);
            return session;
        });
    }
    static createCredentialsToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = payload.email;
            const password = payload.password;
            const name = payload.name;
            const user = yield client_js_1.prismaClient.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (user) {
                throw new Error("User Already Exists. Redirect to signin page.");
            }
            const userInDb = yield client_js_1.prismaClient.user.create({
                data: {
                    email: email,
                    password: password,
                    name: name,
                },
            });
            const session = yield jwtService_js_1.default.generateTokenForUser(userInDb);
            return session;
        });
    }
    static getCurrentUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client_js_1.prismaClient.user.findUnique({
                where: {
                    id: id,
                },
                include: {
                    posts: {
                        include: {
                            likes: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                    likes: true,
                    followers: true,
                    following: true,
                    comments: true,
                },
            });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    static sendOtpEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    secure: true,
                    port: 465,
                    auth: {
                        user: "pearlautherizer@gmail.com",
                        pass: "egjvzollbsxedjni",
                    },
                });
                const mailOptions = {
                    from: "pearlautherizer@gmail.com",
                    to: email,
                    subject: "Email Verification OTP",
                    text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
                };
                yield transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error("Error sending OTP email:", error);
                return false;
            }
        });
    }
    static changePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client_js_1.prismaClient.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (!user) {
                throw new Error("User not found");
            }
            yield client_js_1.prismaClient.user.update({
                where: {
                    email: email,
                },
                data: {
                    password: newPassword,
                },
            });
            return true;
        });
    }
    static followUser(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_js_1.prismaClient.follows.create({
                data: {
                    follower: { connect: { id: from } },
                    following: { connect: { id: to } },
                },
            });
            // await redisClient.del(`recommendedUsers:${ctx.user.id}`);
            return;
        });
    }
    static unfollowUser(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_js_1.prismaClient.follows.delete({
                where: {
                    followerid_followingid: {
                        followerid: from,
                        followingid: to,
                    },
                },
            });
            // await redisClient.del(`recommendedUsers:${ctx.user.id}`);
            return;
        });
    }
    static like(user, id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name === "post") {
                yield client_js_1.prismaClient.like.create({
                    data: {
                        userId: user,
                        postId: id,
                    },
                });
            }
            else if (name == 'comment') {
                yield client_js_1.prismaClient.like.create({
                    data: {
                        userId: user,
                        commentId: id,
                    },
                });
            }
            else if (name == 'reply') {
                yield client_js_1.prismaClient.like.create({
                    data: {
                        userId: user,
                        replyId: id,
                    },
                });
            }
        });
    }
    static unlike(user, id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name === "post") {
                yield client_js_1.prismaClient.like.deleteMany({
                    where: {
                        userId: user,
                        postId: id,
                    },
                });
            }
            else if (name == 'comment') {
                yield client_js_1.prismaClient.like.deleteMany({
                    where: {
                        userId: user,
                        commentId: id,
                    },
                });
            }
            else if (name == 'reply') {
                yield client_js_1.prismaClient.like.deleteMany({
                    where: {
                        userId: user,
                        replyId: id,
                    },
                });
            }
        });
    }
    static getFollowers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_js_1.prismaClient.follows.findMany({
                where: { following: { id: id } },
                include: {
                    follower: true,
                    following: true,
                },
            });
            return result.map((el) => el.follower);
        });
    }
    static getFollowing(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_js_1.prismaClient.follows.findMany({
                where: { follower: { id: id } },
                include: {
                    follower: true,
                    following: true,
                },
            });
            return result.map((el) => el.following);
        });
    }
    static getRecommendedUsers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const cachedValue=await redisClient.get(`recommendedUsers:${id}`);
            // if(cachedValue) return JSON.parse(cachedValue);
            const myFollowing = yield client_js_1.prismaClient.follows.findMany({
                where: { follower: { id: id } },
                include: {
                    following: {
                        include: {
                            followers: {
                                include: {
                                    following: true,
                                },
                            },
                        },
                    },
                },
            });
            const userToRecommend = [];
            for (const followings of myFollowing) {
                for (const follower of followings.following.followers) {
                    if (follower.following.id !== id &&
                        myFollowing.findIndex((e) => e.followingid === follower.following.id) < 0) {
                        userToRecommend.push(follower.following);
                    }
                }
            }
            const uniqueArray = userToRecommend.filter((item, index, self) => index === self.findIndex((other) => other.id === item.id));
            // await redisClient.set(`recommendedUsers:${id}`,JSON.stringify(uniqueArray));
            return uniqueArray;
        });
    }
    static getSignedImageURL(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payload.ctx.user || !payload.ctx.user.id) {
                throw new Error("You must be logged in to create a post");
            }
            const allowedImagetype = [
                "image/jpg",
                "image/jpeg",
                "image/png",
                "image/webp",
            ];
            if (!allowedImagetype.includes(payload.imageType)) {
                throw new Error("Invalid image type");
            }
            const putObjectCommand = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `upload/${payload.ctx.user.id}/post/${payload.imageName}-${Date.now()}.${payload.imageType}}`,
            });
            const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
            return signedURL;
        });
    }
    static getSignedVideoURL(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedVideoType = ["video/mp4", "video/webm", "video/ogg", "video/mov"];
            if (!allowedVideoType.includes(payload.videoType)) {
                throw new Error("Invalid video type");
            }
            if (!payload.ctx.user || !payload.ctx.user.id) {
                throw new Error("You must be logged in to upload a video");
            }
            const putObjectCommand = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `upload/${payload.ctx.user.id}/post/${payload.videoName}-${Date.now()}.${payload.videoType}}`,
            });
            const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
            return signedURL;
        });
    }
    static getChartData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likes = yield client_js_1.prismaClient.like.findMany({
                where: {
                    OR: [
                        { post: { authorId: userId } },
                        { comment: { authorId: userId } },
                        { reply: { authorId: userId } },
                        { story: { authorId: userId } },
                    ],
                },
                include: {
                    post: true,
                    comment: true,
                    reply: true,
                    story: true,
                },
            });
            const comments = yield client_js_1.prismaClient.comment.findMany({
                where: {
                    post: { authorId: userId },
                },
            });
            const weeklyData = [
                { name: 'Mon', likes: 0, shares: 0, comments: 0 },
                { name: 'Tue', likes: 0, shares: 0, comments: 0 },
                { name: 'Wed', likes: 0, shares: 0, comments: 0 },
                { name: 'Thu', likes: 0, shares: 0, comments: 0 },
                { name: 'Fri', likes: 0, shares: 0, comments: 0 },
                { name: 'Sat', likes: 0, shares: 0, comments: 0 },
                { name: 'Sun', likes: 0, shares: 0, comments: 0 },
            ];
            const monthlyData = [
                { name: 'Week 1', likes: 0, shares: 0, comments: 0 },
                { name: 'Week 2', likes: 0, shares: 0, comments: 0 },
                { name: 'Week 3', likes: 0, shares: 0, comments: 0 },
                { name: 'Week 4', likes: 0, shares: 0, comments: 0 },
            ];
            const startOfWeek = new Date();
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonth = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            likes.forEach((like) => {
                const likeDate = new Date(like.createdAt);
                if (likeDate >= startOfWeek) {
                    const day = (likeDate.getDay() + 6) % 7;
                    weeklyData[day].likes += 1;
                }
                if (likeDate >= startOfMonth) {
                    const week = Math.ceil((likeDate.getDate() + startOfMonth.getDay() - 1) / 7);
                    monthlyData[week - 1].likes += 1;
                }
            });
            comments.forEach((comment) => {
                const commentDate = new Date(comment.createdAt);
                if (commentDate >= startOfWeek) {
                    const day = (commentDate.getDay() + 6) % 7;
                    weeklyData[day].comments += 1;
                }
                if (commentDate >= startOfMonth) {
                    const week = Math.ceil(commentDate.getDate() / 7);
                    monthlyData[week - 1].comments += 1;
                }
            });
            return { weeklyData, monthlyData };
        });
    }
    static getRecentActivity(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPosts = yield client_js_1.prismaClient.post.findMany({
                where: { authorId: userId },
                include: {
                    comments: {
                        include: {
                            author: true
                        }
                    },
                    likes: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            const userComments = yield client_js_1.prismaClient.comment.findMany({
                where: { authorId: userId },
                include: {
                    replies: {
                        include: {
                            author: true
                        }
                    },
                    likes: {
                        include: {
                            user: true,
                        },
                    }
                },
            });
            const userReplies = yield client_js_1.prismaClient.reply.findMany({
                where: { authorId: userId },
                include: {
                    likes: {
                        include: {
                            user: true
                        }
                    }
                },
            });
            const userStories = yield client_js_1.prismaClient.story.findMany({
                where: { authorId: userId },
                include: {
                    likes: {
                        include: {
                            user: true,
                        },
                    }
                },
            });
            const followers = yield client_js_1.prismaClient.follows.findMany({
                where: { followingid: userId },
                include: {
                    follower: true,
                },
            });
            const activities = [];
            userPosts.forEach(post => {
                post.comments.forEach(comment => {
                    activities.push({
                        id: comment.id,
                        user: { name: comment.author.name, avatar: comment.author.profileImageURL, username: comment.author.name },
                        action: 'comment',
                        content: `commented on your post`,
                        time: comment.createdAt,
                    });
                });
                post.likes.forEach(like => {
                    activities.push({
                        id: like.id,
                        user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
                        action: 'like',
                        content: `liked your post`,
                        time: like.createdAt,
                    });
                });
            });
            userComments.forEach(comment => {
                comment.replies.forEach(reply => {
                    activities.push({
                        id: reply.id,
                        user: { name: reply.author.name, avatar: reply.author.profileImageURL, username: reply.author.name },
                        action: 'reply',
                        content: `replied to your comment`,
                        time: reply.createdAt,
                    });
                });
                comment.likes.forEach(like => {
                    activities.push({
                        id: like.id,
                        user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
                        action: 'like',
                        content: `liked your comment`,
                        time: like.createdAt,
                    });
                });
            });
            userReplies.forEach(reply => {
                reply.likes.forEach(like => {
                    activities.push({
                        id: like.id,
                        user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
                        action: 'like',
                        content: `liked your reply`,
                        time: like.createdAt,
                    });
                });
            });
            userStories.forEach(story => {
                story.likes.forEach(like => {
                    activities.push({
                        id: like.id,
                        user: { name: like.user.name, avatar: like.user.profileImageURL, username: like.user.name },
                        action: 'like',
                        content: `liked your story`,
                        time: like.createdAt,
                    });
                });
            });
            followers.forEach(follow => {
                activities.push({
                    id: follow.followerid,
                    user: { name: follow.follower.name, avatar: follow.follower.profileImageURL, username: follow.follower.name },
                    action: 'follow',
                    content: 'started following you',
                    time: follow.createdAt,
                });
            });
            activities.sort((a, b) => b.time.getTime() - a.time.getTime());
            return activities.slice(0, 5);
        });
    }
}
exports.default = UserService;
