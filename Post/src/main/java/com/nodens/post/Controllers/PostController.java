package com.nodens.post.Controllers;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.nodens.post.Documents.Post;
import com.nodens.post.Services.PostService;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    private PostService service;

    @Autowired
    public PostController(PostService postService){
        this.service = postService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Post>> GetAllPosts(){
        return ResponseEntity.ok(this.service.getAllPosts());
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<Post>> GetPostsByCreator(@PathVariable String creatorId){
        return ResponseEntity.ok(this.service.getPostsByCreator(creatorId));
    }

    @PostMapping(value="/new", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity PostNewPost(@RequestBody Post newPost){
        Post createdPost = this.service.createAPost(newPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> PutActualPost(@PathVariable String id){
        this.service.DeleteAPost(id);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post eliminado correctamente");
    }

}
