import { motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

const UpBtn = styled.span<{ show: boolean }>`
  width: 60px;
  height: 60px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 40px;
  bottom: 40px;
  padding: 10px;
  background-color: rgba(116, 185, 255, 1);
  border-radius: 30px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  cursor: ${(props) => (props.show ? "pointer" : null)};
  &:hover {
    background-color: rgba(9, 132, 227, 1);
  }
`;
const Svg = styled(motion.svg)`
  width: 30px;
  fill: white;
`;

function ToTopScroll() {
  const { scrollY } = useViewportScroll();
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        setShowBtn(true);
      } else {
        setShowBtn(false);
      }
    });
  }, [scrollY]);

  //화면을 Top으로 부드럽게 이동시키는 함수
  const toTopScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <UpBtn show={showBtn} onClick={toTopScroll}>
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
      </Svg>
    </UpBtn>
  );
}
export default ToTopScroll;
