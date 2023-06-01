package com.nodens.post.Services.PostServiceIMPL;

import com.nodens.post.Documents.Post;
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
}
