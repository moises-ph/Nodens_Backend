package com.nodens.post.Services.JwtService;
import org.slf4j.LoggerFactory;
import java.util.logging.Logger;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

public class JwtService {
    private static final Logger LOGGER = (Logger) LoggerFactory.getLogger(JwtService.class);

    public boolean validateToken(String token) {
        try {
            /*Jwts.parser().setSigningKey()*/
            return true;
        } catch (Exception exception) {

        }
        return false;
    }

}
