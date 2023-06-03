package com.nodens.post.utils;

import io.jsonwebtoken.*;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class JWTUtils {
    private String jwtKey = "aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o";

    private SecretKey key;

    public JWTUtils(){
        this.key = new SecretKeySpec(this.jwtKey.getBytes(StandardCharsets.UTF_8), "HMACSHA256");
    }

    public Claims getTokenClaims(String token){
            JwtParser builder = Jwts.parserBuilder().setSigningKey(key).build();
            Jws<Claims> claims = builder.parseClaimsJws(token);
            System.out.println("si");
            return claims.getBody();
    }
}
