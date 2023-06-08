package com.nodens.post.Controllers;

import com.nodens.post.Documents.Like;
import com.nodens.post.Documents.Post;
import com.nodens.post.Documents.PostComment;
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

    @PostMapping(value="/new")
    public ResponseEntity PostNewPost(@RequestBody Post newPost) throws Exception {
        try{
            Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
            newPost.setUser_id(claims.get("Id").toString());
            Post createdPost = this.service.createAPost(newPost);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        }
        catch (Exception err){
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> PutActualPost(@PathVariable String id){
        this.service.DeleteAPost(id);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post eliminado correctamente");
    }

    @PatchMapping("/like/add/{id}")
    public ResponseEntity<String> LikePost(@PathVariable String id){
        Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
        Like newLike = new Like(claims.get("Id").toString());
        this.service.likePost(newLike,id);
        return ResponseEntity.ok("Like añadido correctamente");
    }

    @PatchMapping("/like/delete/{id}")
    public ResponseEntity UnLikePost(@PathVariable String id) throws Exception{
        try{
            Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
            this.service.unlikePost(id, claims.get("Id").toString());
            return ResponseEntity.ok("Like eliminado correctamente");
        }
        catch (Exception err){
            System.out.println(err.getCause().toString());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @GetMapping("/liked")
    public ResponseEntity GetLikedPosts() throws Exception{
        try{
            Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
            return ResponseEntity.ok(this.service.getPostsLiked(claims.get("Id").toString()));
        }
        catch (Exception err){
            System.out.println(err.getCause().toString());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @PatchMapping("/comment/{id}")
    public ResponseEntity CommentPost(@RequestBody PostComment newComment, @PathVariable String id){
        Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
        newComment.setUser_id(claims.get("Id").toString());
        this.service.commentPost(newComment, id);
        return ResponseEntity.ok("Post Comentado Correctamente");
    }

    @GetMapping("/commented")
    public ResponseEntity GetCommentedPosts(){
        try{
            Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
            return ResponseEntity.ok(this.service.getPostCommented(claims.get("Id").toString()));
        }
        catch (Exception err){
            System.out.println(err.getCause().toString());
            return ResponseEntity.internalServerError().body(err);
        }
    }

    @DeleteMapping("/comment/delete/{postid}/{commentid}")
    public ResponseEntity DeleteComment(@PathVariable String postid, @PathVariable String commentid){
        try{
            Claims claims = jwtUtils.getTokenClaims(((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization").replace("Bearer ", ""));
            this.service.deletPostComment(postid, commentid, claims.get("Id").toString());
            return ResponseEntity.ok("Comentario eliminado");
        }catch (Exception err){
            System.out.println(err.getCause().toString());
            return ResponseEntity.internalServerError().body(err);
        }
    }

}
