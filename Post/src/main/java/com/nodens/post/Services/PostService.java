package com.nodens.post.Services;

import com.nodens.post.Documents.Post;

import java.util.List;

public interface PostService {
    List<Post> getAllPosts();
    Post createAPost(Post newPost);
    void DeleteAPost(String id);
    List<Post> getPostsByCreator(String creatorId);
}
