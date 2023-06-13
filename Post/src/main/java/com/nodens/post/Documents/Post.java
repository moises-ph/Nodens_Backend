package com.nodens.post.Documents;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.*;

@Document("Posts")
@Data
@AllArgsConstructor
public class Post {

    @Id
    private String id;
    private String user_id;
    private String title;
    private String text;
    private List<String> links;
    private List<String> images;
    private LocalDateTime Date;
    private List<Like> likes;
    private List<PostComment> comments;
}
