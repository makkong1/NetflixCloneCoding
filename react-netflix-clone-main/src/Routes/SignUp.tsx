import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import DaumPostcode from "react-daum-postcode"; // react-daum-postcode import

const Container = styled.div`
  position: fixed;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -55%);
  min-width: 500px;
  min-height: 700px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
  scale: 1;
`;

const Title = styled.h2`
  margin-bottom: 25px;
  text-align: center;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
  background-color: rgba(119, 119, 119, 0.7);
  margin: 25px 0;
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
    top: -25px;
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
  margin-top: 15px;
`;

const Button2 = styled.button`
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 160px;
`;

const StyledLink = styled(Link)`
  text-align: center;
  display: block;
  margin-top: 20px;
  color: white;
`;

const PopupWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 110%;
  width: 400px;
  height: 420px;
  z-index: 1000;
  background-color: white;
`;

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    pwd: "",
    confirmPwd: "",
    phone: "",
    birthDay: "",
    userAddr: "",
  });
  const [message, setMessage] = useState("");
  const [tempCode, checkTempCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [EmailError, setEmailError] = useState<string | null>(null);
  const [PhoneError, setPhoneError] = useState<string | null>(null);
  const [PwdError, setPwdError] = useState<string | null>(null);
  const [checkPwdError, setCheckPwdError] = useState<string | null>(null);
  const [BirthError, setBirthError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showPostcode, setShowPostcode] = useState(false); // 주소 팝업을 보여줄지
  const [verificationCode, setVerificationCode] = useState(""); //이메일인증

  // 이름 공백 검사
  const checkName = (e: ChangeEvent<HTMLInputElement>) => {
    // 원래 입력값과 공백 제거된 값을 비교
    const originalValue = e.target.value;
    const value = originalValue.replace(/\s/g, "");

    // 공백이 제거되기 전과 후의 값이 다른 경우 공백이 있었다는 의미
    if (originalValue !== value) {
      setNameError("공백이 있습니다. 공백을 제거해 주세요.");
      return;
    } else {
      setNameError(null);
    }

    console.log("이름 유효성 검사 :: ", value);
  };

  // 이메일 유효성 검사
  const checkEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const originalValue = e.target.value;
    // 입력값에서 공백 제거
    const value = e.target.value.replace(/\s/g, "");

    // 가능한 이메일 형식: example123@gmail.com, my-email_address@domain.co.kr
    const regExp =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

    // 입력값이 정규식에 맞는지 검사
    const isValid = regExp.test(value);

    if (isValid) {
      console.log("통과");
      setEmailError(null);
    } else {
      setEmailError("이메일 다시 입력해 주세요");
      return;
    }
  };

  // 전화번호 유효성 검사
  const checkPhonenumber = (e: ChangeEvent<HTMLInputElement>) => {
    // 입력값에서 공백 제거
    const value = e.target.value.replace(/\s/g, "");

    // 가능한 전화번호 형식: 010-1234-5678, 01012345678
    const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    const regExp2 = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;

    // 입력값이 첫 번째 또는 두 번째 정규식에 맞는지 검사
    const isValid = regExp.test(value) || regExp2.test(value);

    if (!isValid) {
      setPhoneError("번호 형식을 맞추세요");
      return;
    } else {
      console.log("통과");
      setPhoneError(null);
    }
  };

  // 비밀번호 유효성 검사
  const checkPassword = (e: ChangeEvent<HTMLInputElement>) => {
    // 입력값에서 공백 제거
    const value = e.target.value.replace(/\s/g, "");

    // 가능한 비밀번호 형식: 8자 이상 20자 이하의 영문자, 숫자, 특수문자 조합
    const regExp =
      /^(?=.*\d)(?=.*[a-zA-Z])|(?=.*\d)(?=.*[\W_])|(?=.*[a-zA-Z])(?=.*[\W_])[0-9a-zA-Z\W_]{8,20}$/;

    // 입력값이 정규식에 맞는지 검사
    const isValid = regExp.test(value);

    if (!isValid) {
      setPwdError("비밀번호 다시 입력");
      return;
    } else {
      console.log("통과");
      setPwdError(null);
    }
  };

  // 생년월일 유효성 검사
  const checkBirth = (e: ChangeEvent<HTMLInputElement>) => {
    // 입력값에서 공백 제거
    const value = e.target.value.replace(/\s/g, "");

    // 가능한 생년월일 형식: YYYYMMDD (예: 19900101)
    const regExp = /^\d{4}\d{2}\d{2}$/;

    // 입력값이 정규식에 맞는지 검사
    const isValid = regExp.test(value);

    if (!isValid) {
      setBirthError("생년월일 다시 입력해 주세요");
      return;
    } else {
      console.log("통과");
      setBirthError(null);
    }
  };
  // 비번 맞는지 확인
  const CheckPwd = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.pwd === "" || formData.confirmPwd === "") {
      setError("비번 빈칸 입력하시오");
      return;
    }
    if (formData.pwd !== formData.confirmPwd) {
      setCheckPwdError("비밀번호가 일치하지 않습니다.");
    } else {
      setCheckPwdError(null);
      alert("비밀번호가 일치합니다.");
    }
  };

  // 인증코드 확인 버튼
  const checkverificationCode = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (tempCode === "") {
      alert("인증코드를 입력하시오.");
      return;
    } else if (tempCode !== verificationCode) {
      alert("인증코드 틀렸음");
      return;
    } else if (tempCode === verificationCode) {
      alert("인증완료!");
    }
  };

  // 이메일 중복, 이메일 인증 발송 폼 (sendTempEmailCode)
  const sendTempEmailCode = async () => {
    try {
      //이메일 중복
      const response2 = await axios.post(
        `/api/duplicateEmail`,
        { email: formData.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response2.data.exists) {
        alert("이미 등록된 이메일입니다.");
        return;
      }

      //이메일 인증
      const response = await axios.post(
        `/api/sendTempEmailCode`,
        { email: formData.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("이메일 전송!");
      const tempEmail = response.data.tempEmail; // 인증코드 받아오기
      console.log(tempEmail);
      checkTempCode(tempEmail);
    } catch (error: any) {
      if (error.response) {
        // 서버에서 예외 응답을 받은 경우
        console.error("임시 이메일 인증 코드 전송 오류:", error.response.data);
        alert(`${error.response.data}`);
      } else {
        // 네트워크 오류 등 예기치 않은 오류 발생한 경우
        console.error("임시 이메일 인증 코드 전송 오류:", error.message);
        alert("서버 오류: 잠시 후 다시 시도해주세요.");
      }
    }
  };
  // 이메일인증기능
  const handleVerificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  // db제출 저장할 뭐시기??인듯
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // db보내기
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      nameError ||
      EmailError ||
      PwdError ||
      PhoneError ||
      BirthError ||
      checkPwdError
    ) {
      setError("양식을 다시 확인해주세요.");
      return;
    }
    try {
      const response = await axios.post("/api/signup", formData);
      console.log(response.data);
      alert("회원가입 성공!");
      navigate("/subscription");
    } catch (error) {
      console.error("회원가입 실패:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError("서버에서 오류가 발생했습니다.");
        }
      } else {
        setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 주소
  const handleComplete = (data: any) => {
    setFormData({
      ...formData,
      userAddr: `${data.zonecode}, ${data.address}`,
    });
    setShowPostcode(false);
  };

  // 주소창 팝업
  const togglePostcode = () => {
    setShowPostcode(!showPostcode);
  };

  // 이메일 입력란에서 Enter 키 처리
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // 이메일 유효성 검사 함수 호출
    }
  };

  const openAddr = () => {
    togglePostcode(); // openAddr을 togglePostcode로 변경
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSignUp}>
        {/* -----------------------------------이름 -----------------------------------*/}
        <InputWrapper>
          <InputField
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onKeyDown={handleEmailKeyDown}
            onBlur={checkName}
            placeholder=" "
            required
          />
          <FloatingLabel>이름</FloatingLabel>
        </InputWrapper>
        {nameError && (
          <div
            style={{
              color: "red",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            {nameError}
          </div>
        )}
        {/* ------------------------------------ 이메일--------------------------------------------*/}
        <InputWrapper>
          <InputContainer>
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleEmailKeyDown}
              onBlur={checkEmail}
              placeholder=" "
              required
            />
            <FloatingLabel>이메일</FloatingLabel>
            <Button2 onClick={sendTempEmailCode}>이메일중복/인증</Button2>
          </InputContainer>
        </InputWrapper>
        {EmailError && (
          <div style={{ color: "red", marginBottom: "20px", fontSize: "13px" }}>
            {EmailError}
          </div>
        )}
        {/* 인증 코드 입력 필드 */}
        <InputWrapper>
          <InputContainer>
            <InputField
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              onKeyDown={handleEmailKeyDown}
              placeholder=" "
              required
            />
            <FloatingLabel>인증 코드</FloatingLabel>
            <Button2 onClick={checkverificationCode}>인증번호확인</Button2>
          </InputContainer>
        </InputWrapper>
        {/* ----------------------------------- 비밀번호 -----------------------------------*/}
        <InputWrapper>
          <InputField
            type="password"
            name="pwd"
            value={formData.pwd}
            onChange={handleChange}
            onKeyDown={handleEmailKeyDown}
            onBlur={checkPassword}
            placeholder=" "
            minLength={4}
            required
          />
          <FloatingLabel>
            비밀번호(8자이상 영문자와 숫자, 특수문자 중 2가지 이상 조합)
          </FloatingLabel>
        </InputWrapper>
        {PwdError && (
          <div style={{ color: "red", marginBottom: "20px", fontSize: "13px" }}>
            {PwdError}
          </div>
        )}
        {/* ----------------------------------- 비밀번호 확인 -----------------------------------*/}
        <InputWrapper>
          <InputContainer>
            <InputField
              type="password"
              name="confirmPwd"
              value={formData.confirmPwd}
              onChange={handleChange}
              onKeyDown={handleEmailKeyDown}
              placeholder=" "
              required
            />
            <FloatingLabel>비밀번호확인</FloatingLabel>
            <Button2 onClick={CheckPwd}>비번확인</Button2>
          </InputContainer>
        </InputWrapper>
        {checkPwdError && (
          <div style={{ color: "red", marginBottom: "20px", fontSize: "13px" }}>
            {checkPwdError}
          </div>
        )}
        {/* ----------------------------------- 전화번호 -----------------------------------*/}
        <InputWrapper>
          <InputField
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onKeyDown={handleEmailKeyDown}
            onBlur={checkPhonenumber}
            placeholder=" "
            required
          />
          <FloatingLabel>전화번호("-"없어도됨)</FloatingLabel>
        </InputWrapper>
        {PhoneError && (
          <div style={{ color: "red", marginBottom: "20px", fontSize: "13px" }}>
            {PhoneError}
          </div>
        )}
        {/* ----------------------------------- 생년월일 -----------------------------------*/}
        <InputWrapper>
          <InputField
            type="text"
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
            onKeyDown={handleEmailKeyDown}
            onBlur={checkBirth}
            placeholder=" "
            required
          />
          <FloatingLabel>생년월일(YYYYMMDD)</FloatingLabel>
        </InputWrapper>
        {BirthError && (
          <div
            style={{
              color: "red",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            {BirthError}
          </div>
        )}
        {/* ----------------------------------- 주소 -----------------------------------*/}
        <InputWrapper>
          <InputContainer>
            <InputField
              type="text"
              name="userAddr"
              value={formData.userAddr}
              onChange={handleChange}
              onKeyDown={handleEmailKeyDown}
              onClick={openAddr}
              placeholder=" "
              required
              readOnly
            />
            <FloatingLabel>주소</FloatingLabel>
            <Button2 type="button" onClick={togglePostcode}>
              주소검색
            </Button2>
          </InputContainer>
        </InputWrapper>{" "}
        {/* 다음 우편번호 검색 팝업 */}
        {showPostcode && (
          <PopupWrapper>
            <DaumPostcode onComplete={handleComplete} autoClose />
          </PopupWrapper>
        )}
        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            {/* {화면에보이는 간격 맞출려고 넣었음 아무기능 안함} */}
          </div>
        )}
        {/* ---------------------------------------------------------------------- */}
        <Button type="submit">가입하기</Button>
        {error && (
          <div
            style={{
              color: "red",
              margin: "20px 0",
              fontSize: "18px",
            }}
          >
            {error}
          </div>
        )}
      </Form>

      <StyledLink to="/login">로그인 페이지로 이동</StyledLink>
    </Container>
  );
}

export default SignUp;
