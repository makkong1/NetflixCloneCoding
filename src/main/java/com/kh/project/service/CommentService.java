package com.kh.project.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kh.project.dto.CommentDTO;
import com.kh.project.entity.CommentEntity;
import com.kh.project.repository.CommentRepository;

@Service // Spring이 이 클래스를 빈으로 등록하여 DI(Dependency Injection)를 통해 사용할 수 있다
public class CommentService {

    // CommentRepository 필드를 자동으로 주입받고, CommentRepository를 통해 데이터베이스 작업을 수행한다
    @Autowired
    private CommentRepository commentRepository;

    // 생성
    // CommentDTO를 받아서 CommentEntity로 변환한 후, 데이터베이스에 저장하는 메소드
    public CommentEntity saveComment(CommentDTO commentDTO) {
        // CommentEntity 객체를 생성하고, CommentDTO에서 전달받은 값을 설정한다
        CommentEntity comment = new CommentEntity();
        comment.setNickname(commentDTO.getNickname());
        comment.setId(commentDTO.getId());
        comment.setPwd(commentDTO.getPwd());
        comment.setContent(commentDTO.getContent());
        comment.setRegdate(new Date());
        comment.setMovieId(commentDTO.getMovieId());
        return commentRepository.save(comment);
    }

    // 조회
    // 특정 movieId에 해당하는 모든 댓글을 가져오기 위해 사용
    public List<CommentEntity> getCommentsByMovieId(String movieId) {
        // 주어진 movieId와 일치하는 모든 CommentEntity 객체들을 데이터베이스에서 조회하여 리스트로 반환
        return commentRepository.findByMovieId(movieId);
    }

    // delete
    public void deleteComment(Long idx) {
        commentRepository.deleteById(idx);
    }

    // update
    public CommentEntity updateComment(Long idx, CommentDTO commentDTO) {
        // 주어진 idx로 댓글을 찾고, 찾지못하면 에러를 던짐
        CommentEntity comment = commentRepository.findById(idx)
                .orElseThrow(() -> new RuntimeException("comment not found"));
        // 댓글의 내용을 수정
        comment.setContent(commentDTO.getContent());
        // 변경된 내용을 DB에 저장하고, 업데이트된 댓글 엔티티를 반환
        return commentRepository.save(comment);
    }

}
