package com.kh.project.dto;

public class SignUpRequestDTO {
    private String username;
    private String email;
    private String pwd;
    private String phone;
    private String birthday;
    private String userAddr;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBirthDay() {
        return birthday;
    }

    public void setBirthDay(String birthday) {
        this.birthday = birthday;
    }

    public void setUserAddr(String userAddr) {
        this.userAddr = userAddr;
    }

    public String getUserAddr() {
        return userAddr;
    }
}
