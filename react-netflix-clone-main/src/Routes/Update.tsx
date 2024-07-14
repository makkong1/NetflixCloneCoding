import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import DaumPostcode from "react-daum-postcode";

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  min-width: 400px;
  min-height: 550px;
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: relative; /* 부모 컨테이너를 기준으로 팝업 배치 */
`;

const Button = styled.button`
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  background: rgba(119, 119, 119, 0.7);
  margin: 20px 0;
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
  color: white;
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

const Button2 = styled.button`
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 130px;
`;
const PopupWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  width: 400px;
  height: 550px;
  z-index: 1000;
  background-color: white;
`;

function UpdateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    pwd: "",
    phone: "",
    birthDay: "",
    userAddr: "",
  });
  const [error, setError] = useState<string | null>(null);
  const email = window.localStorage.getItem("email");
  const [showPostcode, setShowPostcode] = useState(false);

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/api/profile/${email}`);
        setFormData(response.data);
        console.log(response.data);
        alert("가져오기 성공");
      } catch (error) {
        console.error("사용자 정보를 불러오는 데 실패했습니다:", error);
      }
    };
    fetchUserInfo();
  }, [email]);

  // 입력한 값 저장할 뭐시기
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // db제출
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/update/${email}`, formData);
      console.log(response.data);
      alert("회원정보 수정 성공!");
      navigate(`/profile/${email}`);
    } catch (error) {
      console.error("회원정보 수정 실패:", error);
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

  // 회원탈퇴
  const DeleteUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (window.confirm("정말 할겨?")) {
        const response = await axios.delete(`/api/delete/${email}`);
        window.localStorage.removeItem("email");
        alert("탈퇴 성공!");
        navigate("/");
      }
    } catch (error) {
      console.log("탈퇴실패: ", error);
      setError("탈퇴실패, 코드고쳐");
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

  return (
    <Container>
      <Title>회원정보 수정</Title>
      <Form onSubmit={handleUpdate}>
        <InputWrapper>
          <InputField
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder=" "
          />
          <FloatingLabel>이름</FloatingLabel>
        </InputWrapper>

        <InputWrapper>
          <InputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=" "
          />
          <FloatingLabel>이메일</FloatingLabel>
        </InputWrapper>

        <InputWrapper>
          <InputField
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder=" "
          />
          <FloatingLabel>전화번호</FloatingLabel>
        </InputWrapper>

        <InputWrapper>
          <InputField
            type="text"
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
            placeholder=" "
          />
          <FloatingLabel>생년월일</FloatingLabel>
        </InputWrapper>

        <InputWrapper>
          <InputContainer>
            <InputField
              type="text"
              name="userAddr"
              value={formData.userAddr}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <FloatingLabel>주소</FloatingLabel>
            <Button2 type="button" onClick={togglePostcode}>
              주소검색
            </Button2>
          </InputContainer>
        </InputWrapper>
        {showPostcode && (
          <PopupWrapper>
            <DaumPostcode onComplete={handleComplete} autoClose />
          </PopupWrapper>
        )}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {/* {화면에보이는 간격 맞출려고 넣었음 아무기능 안함} */}
          </div>
        )}
        <Button type="submit">수정하기</Button>
        <Button onClick={DeleteUser}>탈퇴하기</Button>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </Form>
    </Container>
  );
}

export default UpdateUser;
