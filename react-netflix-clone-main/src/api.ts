import axios from "axios";
const API_KEY = "fbd49aa9d34009a5e0c065c0174f2a70";
const BASE_PATH = "https://api.themoviedb.org/3";
// https://image.tmdb.org/t/p/w500//fqv8v6AycXKsivp1T5yKtLbGXce.jpg

//비디오 인터페이스 정의
export interface TMDBVideoResult {
  key: string;
  site: string;
  type: string;
}

interface IAll {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface IAllResult {
  page: number;
  results: IAll[];
  total_pages: number;
  total_results: number;
}

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  popularity: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface ITvshow {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
}

export interface IGetTvshowsResult {
  page: number;
  results: ITvshow[];
  total_pages: number;
  total_results: number;
}

// 영화 결과 인터페이스
export interface TMDBMovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  media_type: "movie"; // 타입 추가: 영화
}

// TV 쇼 결과 인터페이스
export interface TMDBTVResult {
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  media_type: "tv"; // 타입 추가: TV 쇼
}
// 사람 결과 인터페이스
export interface TMDBPersonResult {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for: (TMDBMovieResult | TMDBTVResult)[]; // 영화 또는 TV 쇼의 배열
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string | null;
  media_type: "person"; // 타입 추가: 사람
}
// 멀티서치 API 전체 응답 인터페이스
export interface TMDBMultiSearchResult {
  page: number;
  total_results: number;
  total_pages: number;
  results: (TMDBMovieResult | TMDBTVResult | TMDBPersonResult)[]; // 결과는 영화, TV 쇼, 사람 중 하나일 수 있음
}
//멀티서치
export function searchMulti(
  keyword: string,
  page: number = 1
): Promise<TMDBMultiSearchResult> {
  return fetch(
    `${BASE_PATH}/search/multi?language=ko-KR&query=${keyword}&api_key=${API_KEY}`
  ).then((response) => response.json());
}
//유투브 끌고오기
// 영화 비디오 가져오기
export const getMovieVideos = async (
  movieId: number
): Promise<TMDBVideoResult[]> => {
  const response = await axios.get(`${BASE_PATH}/movie/${movieId}/videos`, {
    params: {
      api_key: API_KEY,
      language: "ko-KR",
    },
  });
  return response.data.results;
};

// TV 비디오 가져오기
export const getTVVideos = async (tvId: number): Promise<TMDBVideoResult[]> => {
  const response = await axios.get(`${BASE_PATH}/tv/${tvId}/videos`, {
    params: {
      api_key: API_KEY,
      language: "ko-KR",
    },
  });
  return response.data.results;
};

//등장인물
export interface ICast {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: string | null;
}

//등장인물 배열안에 넣기
export interface IGetCastResult {
  id: number;
  cast: ICast[];
  crew: ICast[];
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getUpcomingMv() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getTopMv() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getTvshows() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getTvshows_onAir() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getTvshows_popular() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getAll() {
  return fetch(
    `${BASE_PATH}/trending/all/day?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

//----------------------Detail api--------------------------

interface Igenres {
  id: number;
  name: string;
}

export interface IGetMovieDetail {
  backdrop_path: string;
  poster_path: string;
  genres: Igenres[];
  homepage: string;
  id: string;
  overview: string;
  release_date: string;
  runtime: number;
  title: string;
  vote_average: number;
}

export function getMovieDetails(movieId?: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?language=ko-KR&api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getMovieDetails2(id: number): Promise<TMDBTVResult> {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=ko-KR`).then(
    (response) => response.json()
  );
}

export function getTVDetails(id: number): Promise<TMDBTVResult> {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=ko-KR`).then(
    (response) => response.json()
  );
}

export function getPersonDetails(id: number): Promise<TMDBPersonResult> {
  return fetch(
    `${BASE_PATH}/person/${id}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

//등장인물 async
export const getCast = async (
  id: number,
  mediaType: "movie" | "tv"
): Promise<ICast[]> => {
  const response = await axios.get<IGetCastResult>(
    `${BASE_PATH}/${mediaType}/${id}/credits`,
    {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
      },
    }
  );
  return response.data.cast;
};
