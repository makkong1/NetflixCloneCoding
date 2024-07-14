import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { priceState, selectedPlanState } from "./atoms";

const clientKey = "test_ck_yZqmkKeP8g9nW5mnod2pVbQRxB9l";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 90px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};

  h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: white;
    text-align: center;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  button {
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

  p {
    margin-top: 20px;
    font-size: 1.1rem;
  }

  .Checkout {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .section {
    width: 100%;
    max-width: 400px;

    h3 {
      margin-bottom: 30px;
      font-size: 40px;
      color: white;
      text-align: center;
    }

    button {
      display: block;
      width: 100%;
      padding: 15px;
      background-color: tomato;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: tomato;
      }
    }
  }
`;

const CheckCoupon = styled.div`
  padding-bottom: 10px;
`;

const Pay = styled.div`
  display: block;
  width: 30%;
  padding: 15px;
  background-color: tomato;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
  margin: auto;
  font-weight: bold;
`;

type Plan = "광고형" | "스탠다드" | "프리미엄";

export function Payment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] =
    useRecoilState<Plan>(selectedPlanState);
  const [price, setPrice] = useRecoilState<number>(priceState);

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        if (!tossPayments) {
          throw new Error("Failed to load Toss Payments SDK.");
        }
        const widgetsInstance = tossPayments.widgets({
          customerKey: generateRandomString(),
        });
        setWidgets(widgetsInstance);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
        // 여기서 사용자에게 오류 상황을 알리는 처리를 추가할 수 있습니다.
      }
    }
    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets) {
        try {
          await widgets.setAmount({
            currency: "KRW",
            value: price,
          });
          await widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          });
          await widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          });
          setReady(true);
        } catch (error) {
          console.error("Error rendering payment widgets:", error);
          // 여기서 사용자에게 오류 상황을 알리는 처리를 추가할 수 있습니다.
        }
      }
    }

    renderPaymentWidgets();
  }, [widgets, price]);

  const getPrice = (plan: Plan): number => {
    switch (plan) {
      case "광고형":
        return 7000;
      case "스탠다드":
        return 12000;
      case "프리미엄":
      default:
        return 17000;
    }
  };
  const handlePlanChange = (plan: Plan): void => {
    setSelectedPlan(plan);
    const newPrice = getPrice(plan);
    setPrice(newPrice);

    // 쿠폰 체크 해제
    try {
      widgets.setAmount({
        currency: "KRW",
        value: newPrice,
      });
      setPrice(newPrice);

      // 쿠폰 체크 해제 로직 추가
      const applyCouponCheckbox = document.getElementById(
        "apply-coupon"
      ) as HTMLInputElement;
      if (applyCouponCheckbox.checked) {
        applyCouponCheckbox.checked = false;
        handleCouponChange({
          target: applyCouponCheckbox,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    } catch (error) {
      console.error("금액 업데이트 오류:", error);
    }
  };

  const handleCouponChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!widgets) {
      return;
    }

    try {
      if (event.target.checked) {
        // 쿠폰 적용 시 가격 할인 적용
        await widgets.setAmount({
          currency: "KRW",
          value: price - 5000,
        });
        setPrice(price - 5000);
      } else {
        // 쿠폰 해제 시 기본 가격으로 복원
        await widgets.setAmount({
          currency: "KRW",
          value: price,
        });
        setPrice(getPrice(selectedPlan));
      }
    } catch (error) {
      console.error("Error updating amount:", error);
    }
  };

  const handlePaymentRequest = async () => {
    console.log(selectedPlan, price);

    await widgets.requestPayment({
      orderId: generateRandomString(),
      orderName: selectedPlan,
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      customerMobilePhone: "01012341234",
    });

    navigate("/payment/checkout");
    console.log(selectedPlan, price);
  };

  return (
    <Wrapper>
      <div className="Checkout">
        <div className="section">
          <h3>요금제 선택</h3>
          <ul>
            <li>
              <button onClick={() => handlePlanChange("광고형")}>
                광고형 : 월 7,000원
              </button>
            </li>
            <li>
              <button onClick={() => handlePlanChange("스탠다드")}>
                스탠다드 : 월 12,000원
              </button>
            </li>
            <li>
              <button onClick={() => handlePlanChange("프리미엄")}>
                프리미엄 : 월 17,000원
              </button>
            </li>
          </ul>
          <li>선택한 요금제: {selectedPlan}</li>
          <li>선택한 요금: {price.toLocaleString()}원</li>
          <CheckCoupon>
            <input
              type="checkbox"
              onChange={handleCouponChange}
              id="apply-coupon"
            />
            <label htmlFor="apply-coupon"> 첫 달 5,000원 할인 쿠폰 적용 </label>
          </CheckCoupon>
        </div>

        <div className="section">
          <div id="payment-method" />
          <div id="agreement" />
          <Pay aria-disabled={!ready} onClick={handlePaymentRequest}>
            <Link to="/payment/checkout">결제하기</Link>
          </Pay>
        </div>
      </div>
    </Wrapper>
  );
}

function generateRandomString(): string {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
