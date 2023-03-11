import { Post } from "../models/posts.model";

export const getPosts = async (req : any, reply : any) => {
    try{

    }
    catch(err){
        return reply.code(500).send(err);
    }
};


