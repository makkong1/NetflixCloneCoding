import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetMoviesResult, getMovies } from "../../api";
import { makeImagePath } from "../../utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ToTopScroll from "../../components/ToTopScroll";
import { useLocation, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 60vw;
  margin: 100px auto 0; // 상, 좌우, 아래
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Col = styled.div`
  span {
    font-size: 40px;
  }
  select {
    cursor: pointer;
    width: 130px;
    padding: 5px;
    background-color: ${(props) => props.theme.black.lighter};
    color: white;
    border: none;
  }
`;

const MovieBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  height: 400px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  border-radius: 15px;
  cursor: pointer;
`;

const PageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const Svg = styled.svg<{ disabled: boolean }>`
  fill: rgba(45, 52, 54, 1);
  width: 40px;
  margin: 0 30px;
  cursor: ${(props) => (props.disabled ? "not - allowed" : "pointer")};
  transition: fill 0.4s ease;

  &:hover {
    fill: ${(props) =>
      props.disabled ? "rgba(45, 52, 54,1.0)" : "rgba(164, 176, 190,1.0)"};
  }
`;

const BoxVariants = {
  hover: {
    y: -10,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 500, // 강성 설정
      damping: 30, // 감쇠 설정
    },
  },
};

/*
  useEffect와 nextHandle 및 prevHandle에서 각각 setPage를 사용하는 이유
  - useEffect는 URL에서 페이지 정보를 읽어와 상태를 초기화하는 역할
  - nextHandle 및 prevHandle은 사용자가 버튼을 클릭할 때 페이지 상태를 업데이트하는 역할
  -> 서로 다른 상황을 처리하기 때문에 각각의 위치에서 setPage를 사용하는 것이 필요하다
*/

function MoreMovies_nowPlaying() {
  //영화 데이터를 가져오기 위한 React Query 사용
  const { data } = useQuery<IGetMoviesResult>(["movies", "nowPlay"], getMovies);
  //페이지 상태와 정렬 기준 상태를 정의
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<string>("popularity");
  //useNavigate();, useLocation(); -> URL과 상태관리
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 페이지 정보와 정렬 기준 가져오기
  //useEffect를 사용하여 컴포넌트가 마운트될 때 URL의 쿼리 문자열에서 페이지 번호를 가져와 상태를 업데이트한다
  useEffect(() => {
    //URLSearchParams는 현재 URL의 쿼리 문자열을 다루는 데 사용된다
    //location.search는 현재 페이지의 URL에서 쿼리 문자열
    const urlParams = new URLSearchParams(location.search);
    //urlParams.get("page") : URL에서 "page"라는 이름의 쿼리 파라미터 값을 가져옴(값은 문자열 형태)
    const pageParam = urlParams.get("page");
    if (pageParam) {
      //pageParam을 10진수 정수형으로 변환하여 setting
      setPage(parseInt(pageParam, 10));
    }
    //location.state 객체가 존재하고 그 안에 orderBy라는 속성이 있는지를 검사
    if (location.state && location.state.orderBy) {
      setOrderBy(location.state.orderBy);
    }
  }, [location]);

  //select태그 onchange 이벤트시 호출되어 value값을 변경
  const changeValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(e.target.value);
    navigate(`/nowPlaying?page=${page}`, {
      state: { orderBy: e.target.value }, //orderBy: e.target.value : orderBy 속성에 사용자가 select 태그에서 선택한 값을 할당 -> 선택된 값을 state로 전달
    });
  };

  // 인기순과 평점순으로 정렬하여 배열을 반환하는 함수
  const orderByMovies = (
    movies: IGetMoviesResult["results"],
    orderBy: string
  ) => {
    switch (orderBy) {
      case "popularity":
        //[]타입의 result 객체를 가져와서 복사한 후 내림차순으로 정렬
        return movies.slice().sort((a, b) => b.popularity - a.popularity);
      case "voteAverage":
        return movies.slice().sort((a, b) => b.vote_average - a.vote_average);
      default:
        return movies;
    }
  };

  //정렬된 배열가져오기
  const orderBiedMovies = orderByMovies(data?.results || [], orderBy);

  //4 * 2(page당 박스의 갯수)
  const boxPerPage = 8;
  //최대 페이지 계산
  const maxPage = data ? Math.ceil(data.results.length / boxPerPage) : 1;

  //page에따라 8개의 인덱스씩 배열을 자르기
  //slice(a, b) -> a번인덱스부터 ~ b의 전 인덱스까지 자른다
  const currentMovies = data
    ? orderBiedMovies.slice((page - 1) * boxPerPage, page * boxPerPage)
    : [];

  //next page버튼
  const nextHandle = () => {
    if (page < maxPage) {
      navigate(`/nowPlaying?page=${page + 1}`);
      setPage(page + 1);
    }
  };
  //prev page버튼
  const prevHandle = () => {
    if (page > 1) {
      navigate(`/nowPlaying?page=${page - 1}`);
      setPage(page - 1);
    }
  };

  // 영화 박스를 클릭했을 때 상세 페이지로 이동하는 함수
  const onBoxClicked = (movieId: number) => {
    //navigate훅을 사용하면서 2번째인자로 현재 url의 page와 orderby상태를 같이 보낸다
    navigate(`/detail/${movieId}`, { state: { page, orderBy } });
    // 클릭 시 페이지 최상단으로 스크롤 이동
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Wrapper>
        <Nav>
          <Col>
            <span>Now Playing</span>
          </Col>

          <Col>
            <select onChange={changeValue} value={orderBy}>
              <option value="popularity">인기순</option>
              <option value="voteAverage">평점 높은 순</option>
            </select>
          </Col>
        </Nav>
        <MovieBox>
          {currentMovies.map((movie) => (
            <Box
              onClick={() => onBoxClicked(movie.id)}
              key={movie.id}
              bgPhoto={makeImagePath(movie.poster_path)}
              variants={BoxVariants}
              whileHover="hover"
            />
          ))}
        </MovieBox>

        {/* paging */}
        <PageBox>
          <Svg
            onClick={prevHandle}
            //disabled: boolean 값을 prop으로 넘겨서 조건이 참이될때 작동X
            disabled={page === 1}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </Svg>
          <span style={{ fontWeight: "bold", color: "#4e5253" }}>
            {page} / {maxPage}
          </span>
          <Svg
            onClick={nextHandle}
            disabled={page === maxPage}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
          </Svg>
        </PageBox>
      </Wrapper>
      <ToTopScroll />
    </>
  );
}
export default MoreMovies_nowPlaying;
