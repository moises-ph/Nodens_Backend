package com.nodens.post.Documents;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class PostComment {
    @Id
    private String comment_id;
    private String user_id;
    private String text;
    private List<String> links;
    private List<String> images;
    private List<PostComment> Responses;

    public PostComment(){
        this.comment_id = new ObjectId().toString();
    }
}
