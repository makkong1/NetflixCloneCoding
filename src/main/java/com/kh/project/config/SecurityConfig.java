package com.kh.project.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 이건 비밀번호 암호화 찾아보다가 써야된대서 만든건데 잘 모르겠어여
    // 리액트에서 부트로 이제 db작업하려고 요청할 때
    // .authorizeHttpRequests(auth -> auth 이줄 바로 밑에 requestMatchers 이부분에다가
    // 저처럼 요청하는 주소를 적으면 됩니다. 제 기준으로는 저걸 안하고 그냥 실행하면 302에러가
    // 계속 발생해서 저렇게 했습니다.

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정
                // 활성화
                .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/login", "/api/signup", "/api/profile/*", "/api/update/*",
                                "/api/delete/*", "/api/sendTempPwd", "/api/changePwd", "/api/verifyTempPwd",
                                "/api/findPwd", "/api/sendTempEmailCode", "/api/duplicateEmail",
                                "/api/comment/**", "/api/comments/**", "/api/subscription/*", "/api/confirm")
                        .permitAll()
                        // '/admin' 경로는 'ADMIN' 역할을 가진 사용자에게만 접근을 허용합니다.
                        .requestMatchers("/admin").hasRole("ADMIN")

                        // 나머지 모든 요청은 인증된 사용자에게만 접근을 허용합니다.
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 관리 정책을 설정하여 Stateless 세션을 사용하도록
                                                                                 // 합니다.
                .formLogin(form -> form
                        .loginPage("/login") // 로그인 페이지 URL
                        .loginProcessingUrl("/login") // 로그인 처리 URL
                        .defaultSuccessUrl("/movies", true) // 로그인 성공 시 이동할 URL
                        .failureUrl("/login?error=true")// 로그인 실패 시 이동할 URL
                        .permitAll()); // 로그인 페이지 및 처리 경로 설정
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // 클라이언트 애플리케이션 주소
        config.setAllowedMethods(Arrays.asList("HEAD", "POST", "GET", "DELETE", "PUT"));
        config.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
