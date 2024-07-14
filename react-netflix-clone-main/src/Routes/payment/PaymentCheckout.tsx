import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { priceState, selectedPlanState } from "./atoms";

const clientKey: string = "test_ck_yZqmkKeP8g9nW5mnod2pVbQRxB9l";

interface PaymentInstance {
  requestPayment: (paymentOptions: any) => Promise<void>;
  requestBillingAuth: (billingOptions: any) => Promise<void>;
}

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

    .button {
      display: block;
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
      }
    }

    .button2 {
      display: inline-block;
      margin-bottom: 20px; /* Adding margin bottom for spacing between buttons */
      padding: 10px;
      background-color: tomato;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &.active {
        background-color: #0056b3;
      }
    }

    #payment-method {
      display: flex;
      justify-content: space-between; /* Distribute items evenly */
      gap: 10px; /* Spacing between buttons */
    }
  }
`;

function CheckoutPage() {
  const selectedPlan = useRecoilValue(selectedPlanState);
  const price = useRecoilValue(priceState);

  const [payment, setPayment] = useState<PaymentInstance | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const paymentInstance = tossPayments.payment({
          customerKey: generateRandomString(),
        });
        setPayment(paymentInstance);
      } catch (error) {
        console.error("결제 정보를 가져오는 중 오류 발생:", error);
        // 오류 처리
      }
    }

    fetchPayment();
  }, []);

  async function requestPayment() {
    if (!payment) {
      console.error("결제 인스턴스가 준비되지 않았습니다.");
      return;
    }

    if (!selectedPlan || !price || price <= 0) {
      console.error("선택한 요금제나 가격이 올바르지 않습니다.");
      return;
    }

    let paymentOptions: any = {
      orderId: generateRandomString(),
      orderName: selectedPlan,
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      customerMobilePhone: "01012341234",
    };

    // Calculate payment amount based on currency and value
    if (selectedPaymentMethod === "FOREIGN_EASY_PAY") {
      // Convert KRW to USD based on the exchange rate (1 USD = 1500 KRW)
      const amountInUSD = (price / 1500).toFixed(2); // Format to 2 decimal places
      paymentOptions.amount = {
        currency: "USD",
        value: Number(amountInUSD), // Convert string to number
      };
    } else {
      // For other methods, use KRW
      paymentOptions.amount = {
        currency: "KRW",
        value: price,
      };
    }

    try {
      switch (selectedPaymentMethod) {
        case "CARD":
          await payment.requestPayment({
            method: "CARD",
            ...paymentOptions,
            card: {
              useEscrow: false,
              flowMode: "DEFAULT",
              useCardPoint: false,
              useAppCardOnly: false,
            },
          });
          break;
        case "TRANSFER":
          await payment.requestPayment({
            method: "TRANSFER",
            ...paymentOptions,
            transfer: {
              cashReceipt: {
                type: "소득공제",
              },
              useEscrow: false,
            },
          });
          break;
        case "VIRTUAL_ACCOUNT":
          await payment.requestPayment({
            method: "VIRTUAL_ACCOUNT",
            ...paymentOptions,
            virtualAccount: {
              cashReceipt: {
                type: "소득공제",
              },
              useEscrow: false,
              validHours: 24,
            },
          });
          break;
        case "MOBILE_PHONE":
        case "CULTURE_GIFT_CERTIFICATE":
          await payment.requestPayment({
            method: selectedPaymentMethod,
            ...paymentOptions,
          });
          break;
        case "FOREIGN_EASY_PAY":
          await payment.requestPayment({
            method: "FOREIGN_EASY_PAY",
            ...paymentOptions,
            foreignEasyPay: {
              provider: "PAYPAL",
              country: "KR",
            },
          });
          break;
        default:
          console.error("지원하지 않는 결제 방식입니다.");
          break;
      }
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
      // Handle the error as needed
    }
  }

  async function requestBillingAuth() {
    if (!payment) {
      console.error("결제 인스턴스가 준비되지 않았습니다.");
      return;
    }

    try {
      await payment.requestBillingAuth({
        method: "CARD", // Example method, adjust as necessary
        successUrl: `${window.location.origin}/payment/billing`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
      });
    } catch (error) {
      console.error("빌링키 발급 중 오류 발생:", error);
      // 오류 처리
    }
  }

  function generateRandomString(): string {
    return window.btoa(Math.random().toString()).slice(0, 20);
  }

  function selectPaymentMethod(method: string) {
    setSelectedPaymentMethod(method);
  }

  return (
    <Wrapper>
      <div className="box_section">
        <h1>일반 결제</h1>
        <div id="payment-method" style={{ display: "flex" }}>
          <button
            id="CARD"
            className={`button2 ${
              selectedPaymentMethod === "CARD" ? "active" : ""
            }`}
            onClick={() => selectPaymentMethod("CARD")}
          >
            카드
          </button>
          <button
            id="TRANSFER"
            className={`button2 ${
              selectedPaymentMethod === "TRANSFER" ? "active" : ""
            }`}
            onClick={() => selectPaymentMethod("TRANSFER")}
          >
            계좌이체
          </button>
          <button
            id="VIRTUAL_ACCOUNT"
            className={`button2 ${
              selectedPaymentMethod === "VIRTUAL_ACCOUNT" ? "active" : ""
            }`}
            onClick={() => selectPaymentMethod("VIRTUAL_ACCOUNT")}
          >
            가상계좌
          </button>
          <button
            id="MOBILE_PHONE"
            className={`button2 ${
              selectedPaymentMethod === "MOBILE_PHONE" ? "active" : ""
            }`}
            onClick={() => selectPaymentMethod("MOBILE_PHONE")}
          >
            휴대폰
          </button>
          <button
            id="CULTURE_GIFT_CERTIFICATE"
            className={`button2 ${
              selectedPaymentMethod === "CULTURE_GIFT_CERTIFICATE"
                ? "active"
                : ""
            }`}
            onClick={() => selectPaymentMethod("CULTURE_GIFT_CERTIFICATE")}
          >
            문화상품권
          </button>
          <button
            id="FOREIGN_EASY_PAY"
            className={`button2 ${
              selectedPaymentMethod === "FOREIGN_EASY_PAY" ? "active" : ""
            }`}
            onClick={() => selectPaymentMethod("FOREIGN_EASY_PAY")}
          >
            해외간편결제
          </button>
        </div>
        <button className="button" onClick={() => requestPayment()}>
          결제하기
        </button>
      </div>
      <div className="box_section">
        <h1>정기 결제</h1>
        <button className="button" onClick={() => requestBillingAuth()}>
          빌링키 발급하기
        </button>
      </div>
    </Wrapper>
  );
}

export default CheckoutPage;
