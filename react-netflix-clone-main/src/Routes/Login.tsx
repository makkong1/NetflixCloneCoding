import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios, { AxiosError } from "axios";

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-40%, -50%);
  max-width: 800px;
  min-width: 400px; /* 최소 너비 설정 */
  min-height: 300px;
  padding: 20px;
  border: 1px solid black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  scale: 1.2;
`;

const Title = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 40px; /* 필요에 따라 여백 조정 */
  background-color: rgba(119, 119, 119, 0.7);
  border-radius: 5px;
`;

const InputField = styled.input`
  display: block;
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: transparent; /* Change background color of input fields */
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

const Button = styled.button`
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  text-align: center;
  display: block;
  margin: 10px 20px;
  color: white;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPassword] = useState("");
  const [error, setError] = useState("");

  // db제출
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/login",
        { email, pwd },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("로그인 성공:", response.data);
      window.localStorage.setItem("email", response.data.email);
      window.localStorage.setItem("username", response.data.username); //이거는 그냥 로그인했을때 이름띄우는용도 이걸로만쓰임
      alert("로그인 성공");
      navigate("/movies");
    } catch (error) {
      //오류메세지 줄이기 실패했음ㅜㅜ
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Axios 오류:", axiosError);

        if (axiosError.response) {
          console.error(
            "서버에서 반환한 상태 코드:",
            axiosError.response.status
          );

          // Handle specific error cases based on HTTP status code
          if (axiosError.response.status) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
          } else {
            setError("서버에서 오류가 발생했습니다.");
          }
        } else {
          console.error("서버로 요청을 보낸 후 응답을 받지 못했습니다.");
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      } else {
        console.error("기타 오류:", error);
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      {/* ----------------------------------- 이메일 -----------------------------------*/}
      <FormContainer onSubmit={handleLogin}>
        <InputWrapper>
          <InputField
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            required
          />
          <FloatingLabel>이메일</FloatingLabel>
        </InputWrapper>
        {/* ----------------------------------- 비밀번호 -----------------------------------*/}
        <InputWrapper>
          <InputField
            type="password"
            name="pwd"
            value={pwd}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
            minLength={4}
          />
          <FloatingLabel>비밀번호</FloatingLabel>
        </InputWrapper>
        <Button type="submit">로그인</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
      {/* ----------------------------------- 나머지 버튼들 -----------------------------------*/}
      <ButtonContainer>
        <StyledLink to="/signup">회원가입</StyledLink>
        <StyledLink to="/findPwd">비밀번호찾기</StyledLink>
      </ButtonContainer>
    </Container>
  );
}

export default Login;
