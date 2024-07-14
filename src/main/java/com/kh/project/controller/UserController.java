package com.kh.project.controller;

import com.kh.project.dto.LoginRequestDTO;
import com.kh.project.dto.SignUpRequestDTO;
import com.kh.project.dto.UpdateUserDTO;
import com.kh.project.dto.UserResponseDTO;
import com.kh.project.service.UserService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody SignUpRequestDTO signUpRequestDTO) {
        userService.registerUser(signUpRequestDTO);
        return ResponseEntity.ok("회원가입이 성공적으로 처리되었습니다.");
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        UserResponseDTO responseDTO = userService.loginUser(loginRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    // 유저정보 가져오기
    @GetMapping("/profile/{email}")
    public ResponseEntity<UserResponseDTO> getUserProfile(@PathVariable(value = "email") String email) {
        UserResponseDTO responseDTO = userService.detailUser(email);
        return ResponseEntity.ok(responseDTO);
    }

    // 수정
    @PutMapping("/update/{email}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable(value = "email") String email,
            @RequestBody UpdateUserDTO updateUserDTO) {
        UserResponseDTO responseDTO = userService.updateUser(email, updateUserDTO);
        return ResponseEntity.ok(responseDTO);
    }

    // 탈퇴
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable(value = "email") String email) {
        userService.deleteUser(email);
        return ResponseEntity.ok("회원 탈퇴가 성공적으로 처리되었습니다.");
    }

    // 임시 비밀번호 전송
    @PostMapping("/sendTempPwd")
    public ResponseEntity<String> sendTempPwd(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        userService.sendTempPwd(email);
        return ResponseEntity.ok("임시 비밀번호가 이메일로 전송되었습니다.");
    }

    // 비밀번호 찾기 (검증)
    // verifyTempPwd: 임시 비밀번호 확인
    @PostMapping("/verifyTempPwd")
    public ResponseEntity<Map<String, Boolean>> validatePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String pwd = request.get("pwd");
        boolean isValid = userService.validatePassword(email, pwd);
        Map<String, Boolean> response = new HashMap<>();
        response.put("success", isValid);
        return ResponseEntity.ok(response);
    }

    // 비밀번호 변경
    @PostMapping("/changePwd")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPwd = request.get("newPwd");
        userService.changePwd(email, newPwd);
        return ResponseEntity.ok("비밀번호 변경이 성공적으로 처리되었습니다.");
    }

    // 이메일 중복
    @PostMapping("/duplicateEmail")
    public ResponseEntity<String> duplicateEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (userService.isEmailExists(email)) {
            return ResponseEntity.badRequest().body("이미 등록된 이메일입니다.");
        }

        return ResponseEntity.ok("사용 가능한 이메일입니다.");
    }

    // 이메일 본인 인증
    @PostMapping("/sendTempEmailCode")
    public ResponseEntity<Map<String, String>> sendTempEmailCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        String tempEmail = userService.generateTempPEmail();

        try {
            userService.sendTempEmailCode(email, tempEmail);
            // 클라이언트에게 인증 코드를 JSON 형식으로 반환
            Map<String, String> response = new HashMap<>();
            response.put("tempEmail", tempEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

}
