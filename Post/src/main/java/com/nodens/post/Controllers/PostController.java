package com.nodens.post.Controllers;

import com.nodens.post.Documents.Post;
import com.nodens.post.Services.PostService;
import com.nodens.post.utils.JWTUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/posts")
public class PostController {
    private PostService service;
    private JWTUtils jwtUtils = new JWTUtils();

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

    @GetMapping("/user")
    public ResponseEntity<List<Post>> GetPostsByUser(){
        Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
        return ResponseEntity.ok(this.service.getPostsByCreator(claims.get("Id").toString()));
    }

    @PostMapping(value="/new", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity PostNewPost(@RequestBody Post newPost) {
        Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
        newPost.setUser_id(claims.get("Id").toString());
        Post createdPost = this.service.createAPost(newPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> PutActualPost(@PathVariable String id){
        this.service.DeleteAPost(id);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post eliminado correctamente");
    }

    @PatchMapping("/like/add/{id}")
    public ResponseEntity<String> LikePost(@PathVariable String id){
        this.service.likePost(id);
        return ResponseEntity.ok("Like añadido correctamente");
    }

    @PatchMapping("/like/delete/{id}")
    public ResponseEntity<String> UnLikePost(@PathVariable String id){
        this.service.unlikePost(id);
        return ResponseEntity.ok("Like eliminado correctamente");
    }

}
