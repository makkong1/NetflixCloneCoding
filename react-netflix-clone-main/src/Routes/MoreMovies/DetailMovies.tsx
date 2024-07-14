import { useQuery } from "react-query";
import { IGetMovieDetail, getMovieDetails } from "../../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../../utils";
import { motion } from "framer-motion";
import ToTopScroll from "../../components/ToTopScroll";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  width: 60vw;
  height: auto;
  border-radius: 20px;
  margin: 100px auto 0; // 상, 좌우, 아래
  background-color: #080808;
`;

const MovieBox = styled(motion.div)<{
  bgPhoto: string;
  isImageLoaded: boolean;
}>`
  background-image: ${(props) =>
    props.isImageLoaded
      ? `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url(${props.bgPhoto})`
      : "none"};
  background-size: cover;
  border-radius: 20px;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled(motion.h1)`
  font-size: 56px;
  font-weight: bolder;
  margin: 100px 0 60px 15px;
`;

const Genres = styled.span`
  font-size: 24px;
  font-weight: bolder;
  margin-left: 15px;
`;

const OverView = styled.div`
  font-size: 20px;
  font-weight: bolder;
  margin-bottom: 50px;
  letter-spacing: 1px;
  line-height: 1.2;
`;

const Info = styled.div`
  margin-top: 20px;
  padding: 30px;
  display: flex;
  height: 100vh;
`;

const Poster = styled.div<{ poster: string }>`
  flex: 1.3;
  height: 100%;
  width: 100%;
  background-image: url(${(props) => props.poster});
  background-size: cover;
  border-radius: 15px;
`;
const Infos = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  margin-bottom: 100px;
`;

const Span = styled.span`
  font-size: 20px;
  font-weight: bolder;
  margin-bottom: 50px;
`;

const Btn = styled(motion.button)`
  cursor: pointer;
  margin-bottom: 20px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  border: none;
  padding: 15px;
  width: 200px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform; //변화시 GPU 가속화를 최적화하여 텍스트 흔들림방지
`;

const BtnVariants = {
  hover: { scale: 0.95, color: "black", backgroundColor: "white" },
};

const titleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2 } },
};

const movieBoxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, type: "tween" } },
};

//영화의 세부 정보를 표시하고, 영화 목록 페이지로 돌아가거나 해당 영화에 대한 관람평을 남길 수 있는 페이지로 이동하는 기능을 포함하는 컴포넌트
function DetailMovies() {
  //useParams 훅을 사용하여 URL 파라미터에서 movieId를 추출
  const { movieId } = useParams();
  const navigate = useNavigate();
  //useLocation 훅을 사용하여, 현재 위치의 상태를 가져옴
  const location = useLocation();
  //location.state에서 page, orderBy값을 추출(이전 page에서 넘어올때 state에 값을 저장함)
  const { page, orderBy } = location.state;
  //영화 detail 정보를 가져오는 쿼리
  const { data } = useQuery<IGetMovieDetail>(["movies", "details"], () =>
    getMovieDetails(movieId)
  );

  // 이미지 로드 상태를 관리하기 위한 state
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  //useEffect를 사용하여 data.backdrop_path가 변경될 때마다 새로운 이미지를 로드
  useEffect(() => {
    if (data?.backdrop_path) {
      const image = new Image();
      image.src = makeImagePath(data.backdrop_path);
      //이미지가 로드되었을 때 setIsImageLoaded(true)를 호출
      image.onload = () => {
        setIsImageLoaded(true);
      };
    }
  }, [data]);

  //목록으로 돌아가는 버튼 클릭 핸들러
  const clickedBtn = () => {
    //navigate 함수를 사용하여 nowPlaying 페이지로 이동하고 상태를 전달
    //현재 페이지로 넘어왔을 때의 page, orderBy 다시 보내서 기존의 page와 정렬상태를 유지할 수 있다
    navigate(`/nowPlaying?page=${page}`, { state: { orderBy } });
    window.scrollTo(0, 0); // 클릭 시 페이지 최상단으로 스크롤 이동
  };
  //관람평 버튼 클릭 핸들러
  const clickedCommentBtn = (title: string, movieId: string) => {
    //navigate 함수를 사용하여 comment 페이지로 이동하고 title과 movieId를 전달
    navigate(`/comment/${title}/${movieId}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Wrapper>
        <MovieBox
          variants={movieBoxVariants}
          initial="hidden"
          animate={isImageLoaded ? "visible" : "hidden"}
          bgPhoto={makeImagePath(data?.backdrop_path || "")}
          isImageLoaded={isImageLoaded}
        >
          <Title variants={titleVariants} initial="hidden" animate="visible">
            {data?.title}
          </Title>
          <Genres>
            Genres
            <br />
            <br />
            {/* 영화 장르를 슬래시로 구분하여 표시 */}
            {data?.genres.map((genres) => genres.name).join(" / ")}
          </Genres>
        </MovieBox>
        <Info>
          <Poster poster={makeImagePath(data?.poster_path || "")} />
          <Infos>
            <OverView>
              <span>소개</span>
              <br />
              <br />
              {data?.overview ? data?.overview : "-"}
            </OverView>
            <Span>
              평점 : <span style={{ color: "red" }}>★</span>
              {data?.vote_average ? data?.vote_average.toFixed(2) : "-"}
            </Span>
            <Span>러닝타임 : {data?.runtime}분</Span>
            <Span>개봉 : {data?.release_date}</Span>
            <Btn
              onClick={clickedBtn}
              variants={BtnVariants}
              whileHover="hover"
              transition={{ duration: 0.2, type: "tween" }}
            >
              Go List
            </Btn>

            <Btn
              onClick={() =>
                clickedCommentBtn(data?.title || "", data?.id || "")
              }
              variants={BtnVariants}
              whileHover="hover"
              transition={{ duration: 0.2, type: "tween" }}
            >
              관람평
            </Btn>
          </Infos>
        </Info>
      </Wrapper>
      <ToTopScroll />
    </>
  );
}
export default DetailMovies;
