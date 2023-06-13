package com.nodens.post.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("aek8tcdus4km1m0ni32y54thvgbo3cnrmyavhl6o")
    private String jwtKey;

    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry){
                registry.addMapping("/producto/**")
                    .allowedOrigins("*")
                    .allowedHeaders("*")
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEADERS")
                    .maxAge(3600);
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests( auth ->
                        auth.requestMatchers(HttpMethod.GET).permitAll()
                            .requestMatchers(HttpMethod.GET,"/posts/user").authenticated()
                            .requestMatchers(HttpMethod	.OPTIONS).permitAll()
                            .anyRequest().authenticated())
                .oauth2ResourceServer((oauth2) -> oauth2
                .jwt(Customizer.withDefaults()))
                .sessionManagement( session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(withDefaults())
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder(){
        SecretKey secretKey = new SecretKeySpec(this.jwtKey.getBytes(StandardCharsets.UTF_8), "HMACSHA256");
        return NimbusJwtDecoder.withSecretKey(secretKey).build();
    }
}
