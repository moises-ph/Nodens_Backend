package com.nodens.post.Services.PostServiceIMPL;

import com.mongodb.BasicDBObject;
import com.nodens.post.Documents.Like;
import com.nodens.post.Documents.Post;
import com.nodens.post.Documents.PostComment;
import com.nodens.post.Repositories.PostRepository;
import com.nodens.post.Services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceIMPL implements PostService {
    private PostRepository repo;

    @Autowired
    public PostServiceIMPL(PostRepository repository){
        this.repo = repository;
    }

    @Override
    public List<Post> getAllPosts() {
        return this.repo.findAll();
    }

    @Override
    public Post createAPost(Post newPost) {
        return this.repo.save(newPost);
    }

    @Override
    public void DeleteAPost(String id) {
        this.repo.deleteById(id);
    }

    @Override
    public List<Post> getPostsByCreator(String creatorId) {
        return this.repo.getPostByCreator(creatorId);
    }

    @Override
    public void likePost(Like like, String id) {
        Post postLiked = this.repo.findById(id).get();
        postLiked.getLikes().add(like);
        postLiked.setLikes(postLiked.getLikes());
        this.repo.save(postLiked);
    }

    @Override
    public void unlikePost(String id, String user_id) {
        Post postLiked = this.repo.findById(id).get();
        postLiked.setLikes(postLiked.getLikes().stream().filter(like -> like.getUser_id() == user_id).toList());
        this.repo.save(postLiked);
    }

    @Override
    public List<Post> getPostsLiked(String user_id) {
        BasicDBObject query = new BasicDBObject();
        query.put("likes.user_id", user_id);
        return this.repo.getPostsLiked(user_id);
    }

    @Override
    public void commentPost(PostComment newComment, String postId) {
        Post postToComment = this.repo.findById(postId).get();
        postToComment.getComments().add(newComment);
        postToComment.setComments(postToComment.getComments());
        this.repo.save(postToComment);
    }

    @Override
    public List<Post> getPostCommented(String user_id) {
        return this.repo.getPostsCommentedByUserId(user_id);
    }

    @Override
    public void deletPostComment(String postid, String id, String autorid) {
        Post commentedPost = this.repo.findById(postid).get();
        commentedPost.setComments(commentedPost.getComments().stream().filter(postComment -> postComment.getComment_id() == id && postComment.getUser_id() == autorid).toList());
        this.repo.save(commentedPost);
    }

}
