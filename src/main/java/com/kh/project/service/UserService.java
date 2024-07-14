package com.kh.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kh.project.dto.LoginRequestDTO;
import com.kh.project.dto.SignUpRequestDTO;
import com.kh.project.dto.UpdateUserDTO;
import com.kh.project.dto.UserResponseDTO;
import com.kh.project.entity.UserEntity;
import com.kh.project.repository.UserRepository;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    public UserService(BCryptPasswordEncoder bCryptPasswordEncoder, JavaMailSender mailSender) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.mailSender = mailSender;
    }

    // 가입
    public UserResponseDTO registerUser(SignUpRequestDTO signUpRequestDTO) {

        UserEntity user = new UserEntity();
        user.setUsername(signUpRequestDTO.getUsername());
        user.setEmail(signUpRequestDTO.getEmail());
        user.setPwd(bCryptPasswordEncoder.encode(signUpRequestDTO.getPwd()));
        user.setPhone(signUpRequestDTO.getPhone());
        user.setBirthDay(signUpRequestDTO.getBirthDay());
        user.setUserAddr(signUpRequestDTO.getUserAddr());
        user.setRegDate(new Date());

        UserEntity savedUser = userRepository.save(user);

        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setUserIdx(savedUser.getUserIdx());
        responseDTO.setUsername(savedUser.getUsername());
        responseDTO.setEmail(savedUser.getEmail());
        responseDTO.setPhone(savedUser.getPhone());
        responseDTO.setBirthDay(savedUser.getBirthDay());
        responseDTO.setUserAddr(savedUser.getUserAddr());
        responseDTO.setRegDate(savedUser.getRegDate()); // 가입일 설정
        return responseDTO;
    }

    // 로그인
    public UserResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(loginRequestDTO.getEmail());
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            if (bCryptPasswordEncoder.matches(loginRequestDTO.getPwd(), user.getPwd())) {
                UserResponseDTO responseDTO = new UserResponseDTO();
                responseDTO.setEmail(user.getEmail());
                responseDTO.setPwd(user.getPwd());
                responseDTO.setUsername(user.getUsername());
                return responseDTO;
            } else {
                throw new RuntimeException("잘못된 이메일 또는 비밀번호입니다.");
            }
        } else {
            throw new RuntimeException("잘못된 이메일 또는 비밀번호입니다.");
        }
    }

    // 정보보기
    public UserResponseDTO detailUser(String email) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            UserResponseDTO responseDTO = new UserResponseDTO();
            responseDTO.setUsername(user.getUsername());
            responseDTO.setEmail(user.getEmail());
            responseDTO.setPwd(user.getPwd());
            responseDTO.setPhone(user.getPhone());
            responseDTO.setBirthDay(user.getBirthDay());
            responseDTO.setUserAddr(user.getUserAddr());
            responseDTO.setRegDate(user.getRegDate()); // 가입일 설정
            return responseDTO;
        } else {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
    }

    // 수정
    public UserResponseDTO updateUser(String email, UpdateUserDTO updateUserDTO) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            user.setUsername(updateUserDTO.getUsername());
            user.setPhone(updateUserDTO.getPhone());
            user.setBirthDay(updateUserDTO.getBirthDay());
            user.setUserAddr(updateUserDTO.getUserAddr());
            UserEntity updatedUser = userRepository.save(user);

            UserResponseDTO responseDTO = new UserResponseDTO();
            responseDTO.setUsername(updatedUser.getUsername());
            responseDTO.setEmail(updatedUser.getEmail());
            responseDTO.setPhone(updatedUser.getPhone());
            responseDTO.setBirthDay(updatedUser.getBirthDay());
            responseDTO.setUserAddr(updatedUser.getUserAddr());

            return responseDTO;
        } else {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
    }

    // 탈퇴
    public void deleteUser(String email) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
        } else {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
    }

    // 이메일 중복확인
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // verifyTempPwd: 임시 비밀번호 확인
    public boolean validatePassword(String email, String pwd) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("없는뎅?"));
        return bCryptPasswordEncoder.matches(pwd, user.getPwd());
    }

    // 비밀번호 변경
    public void changePwd(String email, String newPwd) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("없는뎅?"));
        user.setPwd(bCryptPasswordEncoder.encode(newPwd));
        userRepository.save(user);
    }

    // sendTempPwd: 사용자에게 임시 비밀번호를 생성하여 이메일로 전송
    public void sendTempPwd(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 가진 사용자가 없습니다."));

        String tempPwd = generateTempPwd();
        user.setPwd(bCryptPasswordEncoder.encode(tempPwd));
        userRepository.save(user);

        sendEmail(email, "임시 비밀번호", "임시 비밀번호는 " + tempPwd + " 입니다. 로그인을 하신 후 비밀번호를 변경해주세요.");
    }

    // 임시 비밀번호 생성 로직
    private String generateTempPwd() {
        return UUID.randomUUID().toString().substring(0, 4); // 예시로 UUID의 첫 8자리 반환
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    // 인증번호 담는거
    String tempEmail = generateTempPEmail();

    // 이메일인증
    public void sendTempEmailCode(String email, String tempEmail) {

        sendEmail(email, "인증번호", "인증번호는  " + tempEmail + " 입니다. ");
    }

    // 이메일 인증코드 생성 로직
    public String generateTempPEmail() {
        return UUID.randomUUID().toString().substring(0, 4); // 예시로 UUID의 첫 8자리 반환
    }
}
