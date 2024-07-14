package com.kh.project.dto;

public class LoginRequestDTO {
    private String email;
    private String pwd;
    private String username;

    // Getters and Setters
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

    public void setUserName(String username) {
        this.username = username;
    }

    public String getUserName() {
        return username;
    }
}
