package com.nodens.post.Services;

import com.nodens.post.Documents.Like;
import com.nodens.post.Documents.Post;
import com.nodens.post.Documents.PostComment;

import java.util.List;

public interface PostService {
    List<Post> getAllPosts();
    Post createAPost(Post newPost);
    void DeleteAPost(String id);
    List<Post> getPostsByCreator(String creatorId);
    void likePost(Like newLike, String id);
    void unlikePost(String id, String user_id);
    List<Post> getPostsLiked(String user_id);
    void commentPost(PostComment newComment, String postId);
    List<Post> getPostCommented(String user_id);
    void deletPostComment(String postid, String commentid, String autorid);
}