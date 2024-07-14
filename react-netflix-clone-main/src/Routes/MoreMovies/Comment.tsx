import React, { FormEvent, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetails, IGetMovieDetail } from "../../api";
import { makeImagePath } from "../../utils";
import ToTopScroll from "../../components/ToTopScroll";

const Wrapper = styled.div`
  width: 70vw;
  margin: 0 auto;
`;

const CommentHeader = styled.div<{ bgImg: string }>`
  text-align: center;
  margin-top: 80px;
  font-size: 30px;
  padding: 70px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgImg});
  background-size: cover;
`;

const Hr = styled.hr`
  border: 2px solid ${(props) => props.theme.black.lighter};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding-top: 30px;
`;

const InputBox = styled.div`
  width: 550px;
  height: 620px;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 20px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 300px;
  height: 30px;
  padding: 5px;
  margin-top: 15px;
  border: none;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.veryDark};
  text-align: center;
  color: white;
  font-size: 16px;
`;
const Lable = styled.label`
  margin-top: 15px;
  font-size: 16px;
  font-weight: bolder;
`;

const Ta = styled.textarea`
  width: 300px;
  padding: 5px;
  margin-top: 15px;
  border: none;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.veryDark};
  resize: none;
  color: white;
  font-size: 16px;
`;

const Button = styled.button`
  cursor: pointer;
  width: 300px;
  height: 30px;
  padding: 5px;
  margin-top: 30px;
  border: none;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.veryDark};
  text-align: center;
  color: #757575;
  font-size: 16px;
  &:hover {
    color: white;
  }
`;

const BackButton = styled.button`
  cursor: pointer;
  width: 300px;
  height: 30px;
  padding: 5px;
  margin-top: 30px;
  border: none;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.veryDark};
  text-align: center;
  color: #757575;
  font-size: 16px;

  &:hover {
    color: white;
  }
`;

const ContentBox = styled.div`
  width: 650px;
  max-height: 620px;
  overflow-y: auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 20px;

  /* Webkit 기반 브라우저용 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 10px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 스크롤바 트랙 배경색 */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888; /* 스크롤바 색상 */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.red}; /* 스크롤바 색상 (호버 시) */
  }
`;

const Content = styled.div`
  padding: 20px;
  width: 550px;
  margin: 0 auto;
`;

const Pbox = styled.div`
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 20px;
`;

const P = styled.p`
  color: white;
  padding: 15px;
  margin-left: 10px;
  font-weight: bolder;
  font-size: 16px;
`;

const DelBtn = styled.button`
  cursor: pointer;
  border: none;
  color: white;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 7px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-left: 20px;
  font-size: 14px;
  &:hover {
    color: black;
    background-color: white;
  }
`;

const ModifyBtn = styled.button`
  cursor: pointer;
  border: none;
  color: white;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 7px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-left: 20px;
  font-size: 14px;
  &:hover {
    color: black;
    background-color: white;
  }
`;

const SaveBtn = styled.button`
  cursor: pointer;
  border: none;
  color: white;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 7px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-left: 20px;
  font-size: 14px;
  &:hover {
    color: black;
    background-color: white;
  }
`;

interface IComment {
  idx: number;
  nickname: string;
  id: string;
  pwd: string;
  content: string;
  movieId: string;
  regdate: string;
  inputPwd?: string;
  isEditing?: boolean;
  originalContent?: string;
}

function Comment() {
  const navigate = useNavigate();
  const { title, movieId } = useParams();
  //formData는 닉네임, 아이디, 비밀번호, 내용 및 영화 아이디를 저장
  const [formData, setFormData] = useState<Omit<IComment, "regdate" | "idx">>({
    nickname: "",
    id: "",
    pwd: "",
    content: "",
    movieId: movieId || "",
  });

  const [comments, setComments] = useState<IComment[]>([]);

  //영화 이미지를 가져오기위함
  const { data } = useQuery<IGetMovieDetail>(["movies", "detail_comm"], () =>
    getMovieDetails(movieId)
  );

  //컴포넌트가 로드될 때 서버에서 댓글 목록을 가져오고, 가져온 댓글 목록을 상태에 저장
  const fetchComments = async () => {
    try {
      //서버에 GET요청을 보냄
      //fetch 함수는 기본적으로 GET 요청을 사용
      const response = await fetch(
        `http://localhost:9090/api/comments?movieId=${movieId}`
      );
      // response.ok : HTTP 요청이 성공했는지 여부를 확인
      if (response.ok) {
        //응답이 성공적일 경우 JSON 데이터를 파싱하여 상태에 저장
        const data: IComment[] = await response.json();
        //console.log("Fetched comments:", data);
        const dataWithEditing = data.map((comment: IComment) => ({
          ...comment,
          isEditing: false,
        }));
        setComments(dataWithEditing);
      } else {
        console.error("Failed to fetch comments");
      }
      //catch 구문은 비동기 작업 중 발생한 모든 종류의 예외를 처리
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  //입력 필드에서 발생하는 onChange 이벤트를 처리, 사용자가 입력한 값을 상태에 저장
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //폼 제출 이벤트를 처리
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //formData에서 저장된 정보들을 추출하여 모든 필드가 채워졌는지 검사
    const { nickname, id, pwd, content } = formData;
    if (!nickname || !id || !pwd || !content) {
      alert("모든 텍스트를 입력해주세요.");
      return;
    }

    try {
      //서버에 post요청을 보낸다
      const response = await fetch("http://localhost:9090/api/comment", {
        method: "POST", //http 메소드 설정
        headers: {
          "Content-Type": "application/json", //요청 본문이 json 형식임을 명시
        },
        body: JSON.stringify({
          ...formData, //formData 객체를 JSON 문자열로 변환
          regdate: new Date().toISOString(), //현재 날짜와 시간을 ISO 형식으로 추가
        }),
      });

      if (response.ok) {
        alert("등록성공");

        const newComment: IComment = await response.json();

        //서버에서 최신 댓글 목록을 다시 가져옴
        fetchComments();

        //새 댓글을 comments 상태에 추가하여 가장 위에 표시되게 함
        setComments((prevComments) => [newComment, ...prevComments]);

        //폼 초기화
        setFormData({
          nickname: "",
          id: "",
          pwd: "",
          content: "",
          movieId: movieId || "",
        });
      } else {
        alert("등록실패");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("등록실패");
    }
  };

  const handleCommentPwdChange = (idx: number, value: string) => {
    setComments((prevcomments) =>
      prevcomments.map(
        (
          comment // 각 comment 객체를 순회하면서 comment.idx가 함수에 전달된 idx와 일치하는지 확인, 일치하는 경우 : inputPwd 속성만 업데이트
        ) => (comment.idx === idx ? { ...comment, inputPwd: value } : comment)
      )
    );
  };

  const handleDelete = async (commentIdx: number) => {
    //comments 배열에서 idx가 commentIdx와 일치하는 댓글을 찾는다
    const comment = comments.find((c) => c.idx === commentIdx);

    if (comment) {
      if (!comment.inputPwd) {
        alert("비밀번호를 입력하세요");
        return;
      }

      if (comment.pwd !== comment.inputPwd) {
        alert("비밀번호가 일치하지 않습니다");
        handleCommentPwdChange(comment.idx, "");
        return;
      }
    }

    const response = await fetch(
      `http://localhost:9090/api/comment/${commentIdx}`,
      { method: "delete" }
    );

    if (response.ok) {
      alert("삭제성공");
      fetchComments(); //삭제성공 후 최신 댓글 목록을 다시 가져옴
    } else {
      alert("삭제실패");
    }
  };

  //id 일부 마스킹화 함수
  const maskId = (id: string) => {
    if (id.length <= 3) {
      return "*".repeat(id.length);
    }
    return id.slice(0, -3) + "***";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString.replace("T", " ").substring(0, 19);
  };

  //취소 or 수정 버튼 누를때 호출 되는 함수
  const toggleEditMode = (
    commentIdx: number,
    inputPwd?: string,
    isEditing?: boolean
  ) => {
    //commentIdx와 일치하는 댓글을 찾기
    const comment = comments.find((c) => c.idx === commentIdx);
    //수정 모드로 진입할 때(isEditing이 false일 경우) 비밀번호 입력, 일치 여부 확인
    if (!isEditing && !inputPwd) {
      alert("비밀번호를 입력하세요");
      return;
    }
    if (!isEditing && comment?.pwd !== inputPwd) {
      alert("비밀번호가 일치하지 않습니다");
      handleCommentPwdChange(commentIdx, "");
      return;
    }
    //버튼을 눌렀을 때 isEditing이 true상태면 수정모드에서 취소모드로 , false상태면 수정모드로 진입하는 경우
    if (isEditing) {
      handleCancleEdit(commentIdx);
    } else {
      setComments((prev) =>
        prev.map((comment) =>
          comment.idx === commentIdx
            ? {
                ...comment,
                isEditing: true,
                //수정모드로 진입할 때 기존의 content의 내용을 저장한다.(취소했을때 기존의 값으로 복원하기 위해)
                originalContent: comment.content,
              }
            : comment
        )
      );
    }
    handleCommentPwdChange(commentIdx, "");
  };

  //댓글 수정 취소시에 호출되는 함수
  const handleCancleEdit = (commentIdx: number) => {
    setComments((prevComment) =>
      prevComment.map((comment) =>
        //comments 배열을 순회하며 전달받은 idx와 일치하는 댓글의 idx를 찾는다
        commentIdx === comment.idx
          ? {
              ...comment,
              //content의 값을 저장해놓은 오리지널 내용으로 다시 셋팅
              content: comment.originalContent || "",
              //취소상태로 돌아가니까 Editing 상태 false로 변경
              isEditing: false,
            }
          : comment
      )
    );
  };

  //댓글 수정 textarea의 onChange 이벤트 함수
  const handleContentChange = (commentIdx: number, newContent: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.idx === commentIdx
          ? { ...comment, content: newContent }
          : comment
      )
    );
  };

  //댓글 수정 완료 후 서버로 전송하는 함수
  const handleUpdate = async (commentIdx: number, content: string) => {
    const response = await fetch(
      `http://localhost:9090/api/comment/${commentIdx}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );
    if (response.ok) {
      alert("수정성공");
      fetchComments();
    } else {
      alert("수정실패");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Wrapper>
      <CommentHeader bgImg={makeImagePath(data?.backdrop_path || "")}>
        <span style={{ fontWeight: "bold", fontSize: 40 }}>{title}</span> 관람평
      </CommentHeader>
      <Hr />
      <Container>
        <InputBox>
          <Form onSubmit={handleSubmit}>
            <Lable>닉네임</Lable>
            <Input
              onChange={handleChange}
              type="text"
              name="nickname"
              placeholder="NickName"
              value={formData.nickname}
            />
            <Lable>아이디</Lable>
            <Input
              onChange={handleChange}
              type="text"
              name="id"
              placeholder="ID"
              value={formData.id}
            />
            <Lable>비밀번호</Lable>
            <Input
              onChange={handleChange}
              type="password"
              name="pwd"
              placeholder="PassWord"
              value={formData.pwd}
            />
            <Lable>감상평</Lable>
            <Ta
              onChange={handleChange}
              rows={10}
              name="content"
              value={formData.content}
            ></Ta>
            <Button type="submit">등록하기</Button>
          </Form>
          <BackButton onClick={handleBack}>뒤로가기</BackButton>
        </InputBox>
        <ContentBox>
          {comments.map((comment, index) => (
            <Content key={index}>
              <Pbox>
                <P>
                  닉네임 : {comment.nickname} / 아이디 : {maskId(comment.id)} /
                  <span style={{ color: "gray", fontSize: 15, marginLeft: 5 }}>
                    {formatDate(comment.regdate)}
                  </span>
                </P>

                {comment.isEditing ? (
                  <Ta
                    style={{
                      display: "block",
                      backgroundColor: "whitesmoke",
                      marginBottom: 15,
                      marginLeft: 10,
                      color: "black",
                    }}
                    onChange={(e) =>
                      handleContentChange(comment.idx, e.target.value)
                    }
                  />
                ) : (
                  <P>{comment.content}</P>
                )}
                <input
                  type="password"
                  style={{
                    border: "none",
                    width: 100,
                    marginLeft: 20,
                    padding: 5,
                  }}
                  placeholder="password..."
                  value={comment.inputPwd}
                  onChange={(e) =>
                    handleCommentPwdChange(comment.idx, e.target.value)
                  }
                />
                <DelBtn onClick={() => handleDelete(comment.idx)}>삭제</DelBtn>
                <ModifyBtn
                  onClick={() =>
                    toggleEditMode(
                      comment.idx,
                      comment.inputPwd,
                      comment.isEditing
                    )
                  }
                >
                  {comment.isEditing ? "취소" : "수정"}
                </ModifyBtn>
                {comment.isEditing && (
                  <SaveBtn
                    onClick={() => handleUpdate(comment.idx, comment.content)}
                  >
                    저장
                  </SaveBtn>
                )}
              </Pbox>
            </Content>
          ))}
        </ContentBox>
      </Container>
      <ToTopScroll />
    </Wrapper>
  );
}

export default Comment;
