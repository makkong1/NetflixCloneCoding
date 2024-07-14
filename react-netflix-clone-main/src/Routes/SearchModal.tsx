// DetailModal.tsx
import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  TMDBMovieResult,
  TMDBTVResult,
  TMDBPersonResult,
  TMDBVideoResult,
  ICast,
} from "../api";

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
//누르면 커지는 상자
export const ModalBox = styled(motion.div)`
  background: #0e0a0a;
  border-radius: 10px;
  width: 80%;
  max-width: 1000px;
  padding: 20px;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
//닫기
export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
`;
//포스터 사진
export const DetailImage = styled.img`
  width: 50%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  max-height: 400px;
`;
// 줄거리
export const DetailContent = styled.div`
  margin-top: 20px;
  width: 100%;
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 20px;
`;
//평점
const Rating = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
  display: flex;
  & > .star {
    color: red;
    margin-right: 5px;
  }
`;
//유투브 크기
const VideoFrame = styled.iframe`
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
`;

const CastList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
`;

const CastItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
`;

const CastImage = styled.img`
  width: 100px;
  height: 150px;
  border-radius: 5px;
  object-fit: cover;
`;

const CastName = styled.div`
  margin-top: 5px;
  font-size: 0.9rem;
  color: #ffffff;
  text-align: center;
`;

const CastCharacter = styled.div`
  font-size: 0.8rem;
  color: #bbbbbb;
  text-align: center;
`;

export const Description = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DetailModal: React.FC<{
  item: TMDBMovieResult | TMDBTVResult | TMDBPersonResult;
  videos: TMDBVideoResult[];
  cast: ICast[];
  onClose: () => void;
}> = ({ item, videos, cast, onClose }) => {
  const getTitle = () => {
    if ("title" in item) return item.title;
    if ("name" in item) return item.name;
    return "";
  };

  const getImageUrl = () => {
    if ("poster_path" in item)
      return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    if ("profile_path" in item)
      return `https://image.tmdb.org/t/p/w500${item.profile_path}`;
    return "";
  };

  const getBackdropUrl = () => {
    if ("backdrop_path" in item)
      return `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
    return "";
  };

  const renderDetails = () => {
    if ("overview" in item) {
      return <Description>{item.overview}</Description>;
    }
    if ("biography" in item) {
      return <Description>{item.biography}</Description>;
    }
    return null;
  };

  const renderReleaseDate = () => {
    if ("release_date" in item) {
      return (
        <Rating>
          <p>개봉일: {item.release_date}</p>
        </Rating>
      );
    }
    if ("first_air_date" in item) {
      return <p> 방영일: {item.first_air_date}</p>;
    }
    return null;
  };

  const renderRating = () => {
    if ("vote_average" in item) {
      return (
        <Rating>
          평점: <span className="star">★</span>
          {item.vote_average}
        </Rating>
      );
    }
    return null;
  };
  //유튜브 예고편/ 썸네일
  const renderVideos = () => {
    if (videos.length > 0) {
      const videoKey = videos.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      )?.key;
      if (videoKey) {
        return (
          <VideoFrame
            src={`https://www.youtube.com/embed/${videoKey}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></VideoFrame>
        );
      }
    }

    const backdropUrl = getBackdropUrl();
    if (backdropUrl) {
      return <DetailImage src={backdropUrl} alt={getTitle()} />;
    }
    return <p>트레일러와 배경 이미지가 없습니다</p>;
  };

  //영화 배우 넣기
  const renderCast = () => {
    const limitedCast = cast.slice(0, 7); //7 명까지만 나오게
    return (
      <CastList>
        {limitedCast.map((actor) => (
          <CastItem key={actor.id}>
            <CastImage
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/100x150"
              }
              alt={actor.name}
            />
            <CastName>{actor.name}</CastName>
            <CastCharacter>{actor.character}</CastCharacter>
          </CastItem>
        ))}
      </CastList>
    );
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalBox
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <DetailContent>
          {renderVideos()}
          {renderDetails()}
          {renderReleaseDate()}
          {renderRating()}
          {renderCast()}
        </DetailContent>
      </ModalBox>
    </Overlay>
  );
};
