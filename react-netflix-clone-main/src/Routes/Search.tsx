import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  searchMulti,
  TMDBMultiSearchResult,
  TMDBPersonResult,
  TMDBTVResult,
  TMDBMovieResult,
  getMovieVideos,
  getTVVideos,
  TMDBVideoResult,
  ICast,
  IGetCastResult,
  getCast,
} from "../api";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
//기본 프로필 사진
import defaultPeople from "../image/cat.jpg";
// TV,영화중 POSTER 사진이 없을때
import defaultposter from "../image/poster.png";
//스타일을 따로
import {
  SearchContainer,
  Box,
  NoResults,
  Poster,
  Section,
  Item,
  Name,
  CheckDiv,
  CheckBox,
} from "../Routes/SearchStyles";
import { DetailModal } from "../Routes/SearchModal";

const Search: React.FC = () => {
  const location = useLocation();
  const [orderBy, setOrderBy] = useState<string>("popularity");
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [searchResults, setSearchResults] = useState<
    TMDBMultiSearchResult["results"]
  >([]);
  const [movies, setMovies] = useState<TMDBMovieResult[]>([]);
  const [tvSeries, setTvSeries] = useState<TMDBTVResult[]>([]);
  const [persons, setPersons] = useState<TMDBPersonResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<
    TMDBMovieResult | TMDBTVResult | TMDBPersonResult | null
  >(null);
  const [videos, setVideos] = useState<TMDBVideoResult[]>([]);
  const [cast, setCast] = useState<ICast[]>([]);

  console.log("Location:", location);
  console.log("Keyword:", keyword);
  console.log("Search Results:", searchResults);

  useEffect(() => {
    if (keyword) {
      searchMulti(keyword).then((data) => {
        setSearchResults(data.results);

        // 검색 결과 분류
        const movieResults: TMDBMovieResult[] = [];
        const tvResults: TMDBTVResult[] = [];
        const personResults: TMDBPersonResult[] = [];

        data.results.forEach((result) => {
          if (result.media_type === "movie") {
            movieResults.push(result as TMDBMovieResult);
          } else if (result.media_type === "tv") {
            tvResults.push(result as TMDBTVResult);
          } else if (result.media_type === "person") {
            personResults.push(result as TMDBPersonResult);
          }
        });

        setMovies(movieResults);
        setTvSeries(tvResults);
        setPersons(personResults);
      });
    }
  }, [keyword]);

  // 영화 박스를 클릭했을 때 누른영화의 팝업이 뜨게
  const onBoxClicked = async (
    item: TMDBMovieResult | TMDBTVResult | TMDBPersonResult
  ) => {
    setSelectedItem(item);
    if ("id" in item) {
      let videoResults: TMDBVideoResult[] = [];
      let castResults: ICast[] = []; // Initialize cast results
      if (item.media_type === "movie") {
        videoResults = await getMovieVideos(item.id);
        castResults = await getCast(item.id, "movie");
      } else if (item.media_type === "tv") {
        videoResults = await getTVVideos(item.id);
        castResults = await getCast(item.id, "tv");
      }
      setVideos(videoResults);
      setCast(castResults);
    }
  };
  const closeModal = () => {
    setSelectedItem(null);
    setVideos([]);
  };

  return (
    <SearchContainer>
      <h4 style={{ color: "white" }}>검색 결과 "{keyword}"</h4>
      {searchResults.length > 0 ? (
        <>
          <AnimatePresence>
            {movies.length > 0 && (
              <Section>
                <h3 style={{ color: "white" }}>영화</h3>
                <Box>
                  {movies.map((movie) => (
                    <Item key={movie.id} onClick={() => onBoxClicked(movie)}>
                      <Poster
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : defaultposter
                        }
                      />
                      <Name>{movie.title}</Name>
                    </Item>
                  ))}
                </Box>
              </Section>
            )}

            {tvSeries.length > 0 && (
              <Section>
                <h3 style={{ color: "white" }}>TV 시리즈</h3>
                <Box>
                  {tvSeries.map((tv) => (
                    <Item key={tv.id} onClick={() => onBoxClicked(tv)}>
                      <Poster
                        src={
                          tv.poster_path
                            ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
                            : defaultposter
                        }
                      />
                      <Name>{tv.name}</Name>
                    </Item>
                  ))}
                </Box>
              </Section>
            )}

            {persons.length > 0 && (
              <Section>
                <h1 style={{ color: "white" }}>인물</h1>
                <Box>
                  {persons.map((person) => (
                    <Item key={person.id} onClick={() => onBoxClicked(person)}>
                      <Poster
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                            : defaultPeople
                        }
                        alt={person.name}
                      />
                      <Name>{person.name}</Name>
                    </Item>
                  ))}
                </Box>
              </Section>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedItem && (
              <DetailModal
                videos={videos}
                item={selectedItem}
                onClose={closeModal}
                cast={cast}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <NoResults>결과가 없습니다.</NoResults>
      )}
    </SearchContainer>
  );
};
export default Search;
