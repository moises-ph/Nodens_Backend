package com.nodens.post.Services.PostServiceIMPL;

import com.nodens.post.Documents.Post;
import com.nodens.post.Documents.PostComment;
import com.nodens.post.Repositories.PostRepository;
import com.nodens.post.Services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public void likePost(String id) {
        Post postLiked = this.repo.findById(id).get();
        postLiked.setLikes(postLiked.getLikes() + 1);
        this.repo.save(postLiked);
    }

    @Override
    public void unlikePost(String id) {
        Post postLiked = this.repo.findById(id).get();
        postLiked.setLikes(postLiked.getLikes() - 1);
        this.repo.save(postLiked);
    }

    @Override
    public void commentPost(PostComment newComment, String postId) {
        Post postToComment = this.repo.findById(postId).get();
        List<PostComment> newComments = postToComment.getComments();
        newComments.add(newComment);
        postToComment.setComments(newComments);
        this.repo.save(postToComment);
    }

}
