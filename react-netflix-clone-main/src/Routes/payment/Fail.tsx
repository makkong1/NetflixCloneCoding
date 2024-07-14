import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

interface FailPageProps {}

const Wrapper = styled.div`
  max-width: 600px;
  margin: 90px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};

  .box_section {
    margin-bottom: 20px;

    h1 {
      font-size: 1.5rem;
      margin-top: 20px;
      margin-bottom: 20px;
      color: white;
      text-align: center;
    }

    #payment-method {
      display: flex;
      justify-content: center; /* Center align buttons */
      gap: 10px; /* Spacing between buttons */
    }
  }
`;

const StyledButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const FailPage: React.FC<FailPageProps> = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code") || "500";
  const message = searchParams.get("message") || "An error occurred.";

  return (
    <Wrapper>
      <div className="box_section">
        <h1>결제 실패</h1>
        <h1>Error Code: {code}</h1>
        <h1>Error Message: {message}</h1>
        <div id="payment-method">
          <StyledButton to="/">홈으로 돌아가기</StyledButton>
        </div>
      </div>
    </Wrapper>
  );
};
export default FailPage;
