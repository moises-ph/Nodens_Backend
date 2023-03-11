"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const ContentSchema = new mongoose_1.Schema({
    text: { type: mongoose_1.Schema.Types.String, required: true },
    links: { type: [mongoose_1.Schema.Types.String], required: false, default: [] },
    images: { type: [mongoose_1.Schema.Types.String], required: false, default: [] }
}, {
    versionKey: false,
    timestamps: false
});
const PostCommentSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    content: { type: ContentSchema, required: true },
    date: { type: mongoose_1.Schema.Types.Date, required: true },
    Responses: { type: [ContentSchema], required: true }
}, {
    versionKey: false,
    timestamps: false
});
const PostSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: mongoose_1.Schema.Types.String, required: true },
    content: { type: ContentSchema, required: true },
    date: { type: mongoose_1.Schema.Types.Date, required: true },
    likes: { type: mongoose_1.Schema.Types.Number, required: true, default: 0 },
    comments: { type: [ContentSchema], required: false, default: [] }
}, {
    versionKey: false,
    timestamps: false
});
exports.Post = (0, mongoose_1.model)("Posts", PostSchema);
