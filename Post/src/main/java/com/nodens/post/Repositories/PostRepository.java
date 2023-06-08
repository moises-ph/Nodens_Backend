package com.nodens.post.Repositories;

import com.nodens.post.Documents.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    @Query("{user_id : '?0'}")
    List<Post> getPostByCreator(String id);

    @Query("{ likes : { $elemMatch : { user_id : '?0' } } }")
    List<Post> getPostsLiked(String user_id);

    @Query("{ comments : { $elemMatch : { user_id : '?0' } } }")
    List<Post> getPostsCommentedByUserId(String user_id);
}
