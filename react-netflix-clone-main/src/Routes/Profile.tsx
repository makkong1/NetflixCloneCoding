import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%);
  min-width: 400px;
  min-height: 250px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  scale: 1.1;
`;

const Title = styled.h2`
  text-align: center;
  color: white;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 20px 0; /* 필요에 따라 여백 조정 */
  background-color: rgba(119, 119, 119, 0.7);
  border-radius: 5px;
`;

const InputField = styled.input`
  display: block;
  margin: 40px 0;
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: transparent;
  font-size: 18px;
  color: #fff; /* Change text color to contrast with background */
  position: relative;
  z-index: 1;

  &:focus {
    outline: none;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -20px;
    left: 10px;
    font-size: 16px;
    color: #fff;
  }
`;
const PwdnputWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 20px 0; /* 필요에 따라 여백 조정 */
  background-color: rgba(119, 119, 119, 0.7);
  border-radius: 5px;
`;
const PwdInputField = styled.input`
  display: flex;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: transparent;
  font-size: 18px;
  color: #fff;
  position: relative;
  z-index: 1;

  &:focus {
    outline: none;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -20px;
    left: 10px;
    font-size: 14px;
    color: #5264ae;
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  color: #aaa;
  font-size: 1em;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 0;
`;

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    pwd: "",
    phone: "",
    birthDay: "",
    userAddr: "",
    regDate: "",
  });
  const [password, setPassword] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [error, setError] = useState("");

  // 로그인한 유저정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const email = window.localStorage.getItem("email"); // 로컬 스토리지에서 이메일 가져오기
        // 토큰을 포함한 요청 헤더 설정
        const response = await axios.get(`/api/profile/${email}`);
        setUserInfo(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("사용자 정보를 불러오는 데 실패했습니다:", error);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  // 이거는 그 수정하려 가는데 비번치는 입력칸 보이냐 안보이냐 하는 기능
  const updateUser = () => {
    setPromptOpen(true);
  };

  // 수정페이지 가는데 필요한 비번 설정
  const handlePasswordSubmit = async () => {
    try {
      const email = window.localStorage.getItem("email"); // 로컬 스토리지에서 이메일 가져오기
      const response = await axios.post("/api/login", {
        email: email,
        pwd: password,
      });
      // 로그인 성공
      navigate(`/update/${email}`);
    } catch (error) {
      setError("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <Container>
      <Title>회원정보</Title>
      {/* ----------------------------------- 이름 -----------------------------------*/}
      <InputWrapper>
        <InputField
          type="text"
          name="username"
          value={userInfo.username}
          placeholder=" "
          readOnly
        />
        <FloatingLabel>이름</FloatingLabel>
      </InputWrapper>
      {/* ----------------------------------- 이메일 -----------------------------------*/}
      <InputWrapper>
        <InputField
          type="text"
          name="email"
          value={userInfo.email}
          placeholder=" "
          readOnly
        />
        <FloatingLabel>이메일</FloatingLabel>
      </InputWrapper>
      {/* ----------------------------------- 전화번호 -----------------------------------*/}
      <InputWrapper>
        <InputField
          type="text"
          name="phone"
          value={userInfo.phone}
          placeholder=" "
          readOnly
        />
        <FloatingLabel>전화번호</FloatingLabel>
        {/* -----------------------------------생년월일 -----------------------------------*/}
      </InputWrapper>
      <InputWrapper>
        <InputField
          type="text"
          name="birthDay"
          value={userInfo.birthDay}
          placeholder=" "
          readOnly
        />
        <FloatingLabel>생년월일</FloatingLabel>
      </InputWrapper>
      {/* ----------------------------------- 가입일 -----------------------------------*/}
      <InputWrapper>
        <InputField
          type="text"
          name="regDate"
          value={userInfo.regDate.slice(0, 10)}
          placeholder=" "
          readOnly
        />
        <FloatingLabel>가입일</FloatingLabel>
      </InputWrapper>
      {/* ----------------------------------- 주소 -----------------------------------*/}
      <InputWrapper>
        <InputField
          type="text"
          name="userAddr"
          value={userInfo.userAddr}
          placeholder=" "
          readOnly
        />
        <FloatingLabel>주소:</FloatingLabel>
      </InputWrapper>

      {/* 수정페이지 가려면 비번 필요함 / 버튼눌러서 보이게 한다. */}
      <Button onClick={updateUser}>회원정보수정</Button>
      {promptOpen && (
        <div>
          <PwdnputWrapper>
            <PwdInputField
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FloatingLabel>비밀번호를 입력하세요</FloatingLabel>
          </PwdnputWrapper>
          <Button onClick={handlePasswordSubmit}>확인</Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </Container>
  );
}

export default Profile;
