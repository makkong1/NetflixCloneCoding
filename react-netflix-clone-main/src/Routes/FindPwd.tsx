import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios, { AxiosError } from "axios";

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px;
  min-width: 500px;
  min-height: 300px;
  padding: 20px;
  border: 1px solid black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  scale: 1.1;
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
  margin-bottom: 40px;
  background-color: rgba(119, 119, 119, 0.7);
  border-radius: 5px;
`;

const InputField = styled.input`
  display: block;
  width: 100%;
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
    font-size: 16px;
    color: #fff;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
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

const StyledLink1 = styled(Link)`
  text-align: center;
  display: block;
  margin-top: 10px;
  color: white;
  margin-right: 40px;
  font-size: 20px;
`;
const StyledLink2 = styled(Link)`
  text-align: center;
  display: block;
  margin-top: 10px;
  color: white;
  margin-left: 40px;
  font-size: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const Button2 = styled.button`
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

//비밀번호찾기(이메일로 임시번호받기 넣었음)
function FindPwd() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [tempPwd, setTempPwd] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [error, setError] = useState("");
  const [tempPwdVerified, setTempPwdVerified] = useState(false);

  // 임시 비밀번호 발송 폼 (SendTempPwdForm)
  const sendTempPwd = async () => {
    try {
      const response = await axios.post(
        `/api/sendTempPwd`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const tempPwd = response.data.tempPwd; // 임시 비밀번호 받아오기
      console.log(`임시 비밀번호: ${tempPwd}`); // 콘솔에 임시 비밀번호 출력
      alert("임시 비밀번호가 이메일로 전송되었습니다.");
    } catch (error) {
      console.error("임시 비밀번호 전송 오류:", error);
      alert("임시 비밀번호 전송 실패");
    }
  };

  // 임시 비밀번호 확인 폼 (VerifyTempPwdForm)
  const verifyTempPwd = async () => {
    try {
      const response = await axios.post(
        `/api/verifyTempPwd`,
        { email, pwd: tempPwd },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setTempPwdVerified(true);
        alert("임시 비밀번호 확인 완료");
      } else {
        setError("임시 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("임시 비밀번호 확인 오류:", error);
      alert("임시 비밀번호 확인 실패");
    }
  };

  // 비밀번호 확인
  const handleChangePwd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pwd1 !== pwd2) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/changePwd`,
        { email, newPwd: pwd1 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("비밀번호 변경 완료", response.data);
      alert("비밀번호 변경 성공");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Axios 오류:", axiosError);

        if (axiosError.response) {
          console.error(
            "서버에서 반환한 상태 코드:",
            axiosError.response.status
          );
          if (axiosError.response.status) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
          } else {
            setError("서버에서 오류가 발생했습니다.");
          }
        } else {
          console.error("서버로 요청을 보낸 후 응답을 받지 못했습니다.");
          setError("서버에 연결할 수 없습니다.");
        }
      } else {
        console.error("기타 오류:", error);
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Container>
      <Title>비밀번호 변경</Title>
      <FormContainer onSubmit={handleChangePwd}>
        {/* ----------------------------------- 이메일로 임시번호 전송 -----------------------------------*/}
        <InputWrapper>
          <InputContainer>
            <InputField
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <FloatingLabel>이메일</FloatingLabel>
            <ButtonContainer>
              <Button2 type="button" onClick={sendTempPwd}>
                임시 비밀번호 전송
              </Button2>
            </ButtonContainer>
          </InputContainer>
        </InputWrapper>
        {/* ----------------------------------- 임시비번 입력 -----------------------------------*/}
        <InputWrapper>
          <InputContainer>
            <InputField
              type="password"
              name="tempPwd"
              value={tempPwd}
              onChange={(e) => setTempPwd(e.target.value)}
              placeholder=" "
              required
            />
            <FloatingLabel>임시 비밀번호</FloatingLabel>
            <ButtonContainer>
              <Button2 type="button" onClick={verifyTempPwd}>
                임시 비밀번호 확인
              </Button2>
            </ButtonContainer>
          </InputContainer>
        </InputWrapper>

        {/* 이메일로 받은 임시번호를 입력해서 맞으면 나오고 바로 비번 */}
        {tempPwdVerified && (
          <>
            <InputWrapper>
              <InputField
                type="password"
                name="pwd1"
                value={pwd1}
                onChange={(e) => setPwd1(e.target.value)}
                placeholder=" "
                required
                minLength={4}
              />
              <FloatingLabel>새 비밀번호</FloatingLabel>
            </InputWrapper>

            <InputWrapper>
              <InputField
                type="password"
                name="pwd2"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
                placeholder=" "
                required
                minLength={4}
              />
              <FloatingLabel>새 비밀번호 확인</FloatingLabel>
            </InputWrapper>

            <ButtonContainer>
              <Button type="submit">비밀번호 변경</Button>
            </ButtonContainer>
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
      {/* ----------------------------------- 나머지 버튼들 -----------------------------------*/}
      <ButtonContainer>
        <StyledLink1 to="/login">로그인</StyledLink1>
        <StyledLink2 to="/">메인으로</StyledLink2>
      </ButtonContainer>
    </Container>
  );
}

export default FindPwd;
