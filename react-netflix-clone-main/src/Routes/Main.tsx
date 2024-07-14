import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IAllResult, getAll } from "../api";
import ToTopScroll from "../components/ToTopScroll";
import { makeImagePath } from "../utils";

const Wrapper = styled.div``;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  margin: 100px auto 0;
  height: 60vh;
  width: 85%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      ${(props) => props.theme.black.veryDark}
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover; /* 배경 이미지를 요소에 맞게 축소 */
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const IndicatorBox = styled.div`
  position: relative;
  top: -20px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
`;

const Indicator = styled(motion.div)<{ active: boolean }>`
  width: 70px;
  height: 5px;
  margin: 0 5px;
  background-color: ${(props) =>
    props.active ? props.theme.white.darker : props.theme.black.lighter};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.white.darker};
  }
`;

const Contents = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, max(400px));
  gap: 100px;
  justify-content: center; /* 가로 중앙 정렬 */
  margin-top: 70px;
`;

const Content = styled(motion.div)`
  cursor: pointer;
  text-align: center;
  padding: 40px;
  border-radius: 15px;
  font-size: 60px;
  font-weight: bold;
  background-color: ${(props) => props.theme.black.lighter};
  color: #c2c2c2;
`;

const ContentVariants = {
  hover: {
    color: "white",
    y: -30,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 500, // 강성 설정
      damping: 30, // 감쇠 설정
    },
  },
};

function Main() {
  const navAnimation = useAnimation();
  const navigate = useNavigate();

  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IAllResult>(["all", "trending"], getAll);
  const [bannerIndex, setBannerIndex] = useState(0);

  //배너 자동 넘김 기능
  useEffect(() => {
    if (data) {
      const timer = setInterval(() => {
        setBannerIndex((prevIndex) =>
          prevIndex === data.results.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      // 컴포넌트 언마운트 시나 data가 변경될 때 타이머 정리
      return () => clearInterval(timer);
    }
  }, [data]);

  const MovieClick = () => {
    navigate("/movies");
    window.scrollTo(0, 0); //  클릭 시 페이지 최상단으로 스크롤 이동
  };

  const SeriesClick = () => {
    navigate("/tv");
    window.scrollTo(0, 0); //  클릭 시 페이지 최상단으로 스크롤 이동
  };

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              data?.results[bannerIndex].backdrop_path || ""
            )}
          >
            <Title>
              {data?.results[bannerIndex].title ||
                data?.results[bannerIndex].name}
            </Title>
            {/* <Overview>{data?.results[bannerIndex].overview}</Overview> */}
          </Banner>
          <IndicatorBox>
            {data?.results.map((_, index) => (
              <Indicator
                key={index}
                active={bannerIndex === index}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: bannerIndex === index ? 1 : 0.5 }}
                transition={{ duration: 0.3, type: "tween" }}
                onClick={() => setBannerIndex(index)}
              />
            ))}
          </IndicatorBox>
          <Contents>
            <Content
              variants={ContentVariants}
              whileHover="hover"
              onClick={MovieClick}
            >
              Movies
            </Content>
            <Content
              variants={ContentVariants}
              whileHover="hover"
              onClick={SeriesClick}
            >
              Series
            </Content>
          </Contents>
          <ToTopScroll />
        </>
      )}
    </Wrapper>
  );
}
export default Main;
