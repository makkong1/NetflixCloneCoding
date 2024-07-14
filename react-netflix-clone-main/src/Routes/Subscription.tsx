import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div``;

const Container = styled.div`
  max-width: 400px;
  margin: 90px auto;
  padding: 20px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${(props) => props.theme.black.lighter};
  text-align: center;
`;

const Title = styled.h2`
  margin: 10px 10px;
  font-size: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const Text = styled.div`
  margin: 10px 10px;
  color: ${(props) => props.theme.white.lighter};
`;

const Button = styled.button`
  margin: 20px 10px;
  padding: 10px 20px;
  background-color: tomato;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 100px auto;
  padding: 20px 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: ${(props) => props.theme.black.lighter};
  text-align: left;
  ul {
    font-size: 15px;
    list-style-type: disc;
    padding-bottom: 15px;
    font-weight: bold;
  }
  ul > li {
    font-size: 12px;
    padding: 3px;
  }
`;

function Subscription() {
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem("email"); // Retrieve token from localStorage
      if (!token) {
        // Handle case where token is missing
        console.error("No token found.");
        return;
      }

      const response = await axios.get("/api/subscription", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in the Authorization header
        },
      });

      setSubscribed(response.data.subscribed);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem("email"); // Retrieve token from localStorage
    if (!token) {
      // Handle case where token is missing
      console.error("No token found.");
      navigate("/login");
      return;
    }

    const newSubscribed = !subscribed;
    try {
      await axios.post(
        "/api/subscription",
        { subscribed: newSubscribed.toString() },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in the Authorization header
          },
        }
      );

      setSubscribed(newSubscribed);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }

    if (newSubscribed) {
      navigate("/payment");
    } else {
      navigate("/");
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>구독 정보</Title>
        <Text>{subscribed ? "O" : "X"}</Text>
        <Button onClick={handleSubscribe}>
          {subscribed ? "구독 취소" : "구독"}
        </Button>
      </Container>

      <Content>
        <ul>
          멤버십 및 요금
          <li>
            넷플릭스는 고객의 엔터테인먼트 요구에 맞는 다양한 멤버십을
            제공합니다.
          </li>
          <li>
            넷플릭스 회원은 매월 가입한 날짜에 요금이 청구됩니다. 넷플릭스
            계정은 한 가구 내에 함께 사는 사람들을 위한 것입니다. 넷플릭스
            공유에 대해 더 자세히 알아보세요.
          </li>
          <li>
            오늘 넷플릭스에 가입하고 다양한 결제 옵션 중에서 원하는 옵션을
            선택하세요. 언제든지 쉽게 멤버십을 변경하거나 해지할 수 있습니다.
          </li>
        </ul>
        <ul>
          광고형 스탠다드 / 월 7,000원
          <li>
            광고형, 일부 소수의 영화 및 시리즈를 제외한 모든 콘텐츠 이용 가능,
            모바일 게임 무제한 이용
          </li>
          <li>지원되는 디바이스에서 동시접속 2명까지 시청 가능</li>
          <li>풀 HD로 시청 가능</li>
          <li>한 번에 2대의 지원되는 디바이스에서 콘텐츠 저장 가능</li>
        </ul>

        <ul>
          스탠다드 / 월 12,000원
          <li>광고 없이 영화, 시리즈, 모바일 게임 무제한 이용</li>
          <li>지원되는 디바이스에서 동시접속 2명까지 시청 가능</li>
          <li>풀 HD로 시청 가능</li>
          <li>한 번에 2대의 지원되는 디바이스에서 콘텐츠 저장 가능</li>
          <li>
            함께 살지 않는 사람 1명을 추가 회원으로 등록할 수 있는 옵션 제공
          </li>
        </ul>

        <ul>
          프리미엄 / 월 17,000원
          <li>광고 없이 영화, 시리즈, 모바일 게임 무제한 이용</li>
          <li>지원되는 디바이스에서 동시접속 4명까지 시청 가능</li>
          <li>UHD로 시청 가능</li>
          <li>한 번에 6대의 지원되는 디바이스에서 콘텐츠 저장 가능</li>
          <li>
            함께 살지 않는 사람을 최대 2명 추가 회원으로 등록할 수 있는 옵션
            제공
          </li>
          <li>넷플릭스 공간 음향</li>
        </ul>
      </Content>
    </Wrapper>
  );
}

export default Subscription;
