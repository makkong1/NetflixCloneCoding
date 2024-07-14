package com.kh.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.project.dto.CommentDTO;
import com.kh.project.entity.CommentEntity;
import com.kh.project.service.CommentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;

//RESTful 웹 서비스의 컨트롤러임을 Spring에 알린다
//@Controller와 @ResponseBody를 결합한 것으로, JSON 또는 XML 형식의 데이터를 반환
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    // CommentService 필드를 자동으로 주입
    @Autowired
    private CommentService commentService;

    @PostMapping("/comment") // HTTP POST 요청을 처리하는 메소드를 지정
    public CommentEntity createComment(@RequestBody CommentDTO commentDTO) {
        return commentService.saveComment(commentDTO);
    }

    @GetMapping("/comments")
    public List<CommentEntity> getComments(@RequestParam String movieId) {
        return commentService.getCommentsByMovieId(movieId);
    }

    @DeleteMapping("/comment/{idx}")
    // @PathVariable : /comment/{idx}와 같은 URL 패턴에서 {idx} 부분을 메서드의 매개변수로 전달받아 사용할 수
    // 있다
    public void deleteComment(@PathVariable Long idx) {
        commentService.deleteComment(idx);
    }

    @PutMapping("/comment/{idx}")
    public CommentEntity updateComment(@PathVariable Long idx, @RequestBody CommentDTO commentDTO) {

        return commentService.updateComment(idx, commentDTO);
    }

}
