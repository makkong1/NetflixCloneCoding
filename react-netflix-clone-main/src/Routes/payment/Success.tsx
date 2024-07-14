import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 70px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  text-align: center;

  h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: white;
    text-align: center;
  }

  .box_section {
    margin-top: 20px;
    margin-bottom: 20px;

    img {
      width: 100px;
      margin-bottom: 20px;
    }

    .p-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }

    .typography--p {
      margin-top: 10px;

      .p-grid-col {
        flex: 1;
        text-align: left;

        &.text--right {
          text-align: right;
          white-space: initial;
          width: 250px; /* Adjust width as needed */
        }
      }
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-right: 10px;
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

      &.p-grid-col5 {
        width: 45%;
        margin-right: 5px;
        margin-left: 5px;
      }
    }
  }
`;

const Button = styled.button`
  margin: 20px 10px;
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
`;

export function SuccessPage() {
  const location = useLocation();
  const { message } = location.state || {};

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null); // Adjust type as needed
  const [subscribed, setSubscribed] = useState(null); // State to track subscription status

  useEffect(() => {
    async function confirmPayment() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
      };

      try {
        const response = await fetch("/api/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        const jsonData = await response.json();
        setResponseData(jsonData); // Update response data
        setSubscribed(jsonData.subscribed); // Update subscription status
      } catch (error: any) {
        // Explicitly define 'error' as 'any' type
        console.error("Payment confirmation failed:", error);
        navigate(
          `/payment/fail?code=500&message=${encodeURIComponent(
            error.message ?? "Unknown error"
          )}`
        );
      }
    }

    confirmPayment();
  }, [searchParams, navigate]);

  return (
    <>
      <div className="box_section">
        <img
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="blue check mark"
        />
        <h2>결제를 완료했어요</h2>
        <div className="p-grid typography--p">
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p">
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right">
            {`${searchParams.get("orderId")}`}
          </div>
        </div>
        <div className="p-grid typography--p">
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div className="p-grid-col text--right">
            {`${searchParams.get("paymentKey")}`}
          </div>
        </div>
        <div className="p-grid-col">
          <a href="https://docs.tosspayments.com/guides/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </a>
          <a href="https://discord.gg/A4fRFXQhRu">
            <button
              className="button p-grid-col5"
              style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
            >
              실시간 문의
            </button>
          </a>
        </div>
      </div>
      <div className="box_section" style={{ textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>

      <Wrapper>
        <h2>결제성공</h2>
        <Button>
          <Link to="/">HOME</Link>
        </Button>
      </Wrapper>

      {/* Display subscription status */}
      <div className="box_section" style={{ marginTop: "20px" }}>
        {subscribed !== null && (
          <p>현재 구독 상태: {subscribed ? "구독 중" : "구독 중이 아님"}</p>
        )}
      </div>
    </>
  );
}
