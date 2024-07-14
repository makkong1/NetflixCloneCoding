import styled from "styled-components";
import { motion } from "framer-motion";

export const SearchContainer = styled.div`
background-color: black;
width: 100%;
min-height: calc(100vh - 10rem);
text-align: center;
padding: 5rem 0;
`;

//담을거
export const Box = styled(motion.div) <{ bgPhoto?: string }>`
display: flex;
flex-wrap: wrap;
gap: 2rem;
margin-top: 20px;
`;

//아무것도 안나올떄
export const NoResults = styled.div`
display: flex;
justify-content: center;
align-items: center;
color: #c5c5c5;
height: calc(100vh - 16rem);
padding: 8rem;
`;

//포스터 스타일
export const Poster = styled.img`
width: 100%;
height: 100%;
border-radius: 5px;
cursor: pointer;
`;
//구역 나누기
export const Section = styled.div`
margin-top: 4rem;
`;
export const Item = styled.div`
width: 300px;
margin-bottom: 2rem;
`;
//이름
export const Name = styled.div`
color: white;
margin-top: 0.5rem;
text-align: center;
`;



export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
export const CheckDiv = styled(motion.div)`
position: relative;
top: -90px;
padding-left: 30px;
`;
export const CheckBox = styled(motion.span)`
position: relative;
top: 10px;
margin-right: 10px;
span {
  display: none;
  top: -5px;
}
`;