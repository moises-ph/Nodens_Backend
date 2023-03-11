import { Schema, model } from "mongoose";

export interface IPostComment{
    user_id : Schema.Types.ObjectId,
    content : IContent,
    date : Schema.Types.Date,
    Responses : Array<IContent>
}

export interface IContent{
    text : string,
    links? : Array<string>,
    images? : Array<string>
}

export interface IPost{
    user_id : Schema.Types.ObjectId,
    title : string,
    content : IContent,
    date : Schema.Types.Date,
    likes : number,
    comments? : Array<IPostComment>
}

const ContentSchema = new Schema<IContent>({
    text : { type : Schema.Types.String , required : true },
    links : { type : [Schema.Types.String] , required : false , default : [] },
    images : { type : [Schema.Types.String] , required : false, default : [] }
},{
    versionKey : false,
    timestamps : false
});

const PostCommentSchema = new Schema<IPostComment>({
    user_id :{ type : Schema.Types.ObjectId, required : true },
    content : { type : ContentSchema, required : true },
    date : { type : Schema.Types.Date , required : true },
    Responses : { type : [ContentSchema], required : true }
},{
    versionKey : false,
    timestamps : false
});

const PostSchema = new Schema<IPost>({
    user_id : { type : Schema.Types.ObjectId, required: true },
    title : { type : Schema.Types.String, required: true },
    content : { type : ContentSchema , required : true },
    date : { type : Schema.Types.Date , required : true },
    likes : { type : Schema.Types.Number , required : true, default : 0 },
    comments : { type : [ContentSchema] , required : false , default : [] }
}, {
    versionKey : false,
    timestamps : false
});

export const Post = model<IPostComment>("Posts", PostSchema);