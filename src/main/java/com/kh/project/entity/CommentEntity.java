package com.kh.project.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity//클래스가 JPA 엔티티임을 명시, 데이터베이스 테이블과 매핑된다
@Table(name = "comment_table")//comment_table 라는 이름의 테이블과 매핑
public class CommentEntity {
    @Id//해당 필드가 엔티티의 기본 키임을 나타냄
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_comment_idx")//기본 키의 생성 전략을 지정/ 시퀀스로 생성, 사용할 시퀀스 생성기의 이름을 지정
    @SequenceGenerator(name = "seq_comment_idx", sequenceName = "seq_comment_idx", allocationSize = 1)//시퀀스 생성기를 정의하는 어노테이션, (시퀀스생성기 이름, 실제 DB 시퀀스의 이름, 시퀀스가 1씩증가)
    private Long idx;

    //필드를 데이터베이스 테이블의 컬럼에 매핑하는 어노테이션
    //필드 이름과 컬럼 이름이 동일한 경우 생략가능
    @Column(name = "nickname")
    private String nickname;

    @Column(name = "id")
    private String id;

    @Column(name = "pwd")
    private String pwd;

    @Column(name = "content")
    private String content;

    //날짜/시간 타입을 매핑할 때 사용하는 어노테이션
    //TemporalType.TIMESTAMP : 날짜와 시간을 모두 저장
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "regdate")
    private Date regdate;

    @Column(name = "movieid")
    private String movieId;

    public String getMovieId() {
        return this.movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public long getIdx() {
        return this.idx;
    }

    public void setIdx(long idx) {
        this.idx = idx;
    }

    public String getNickname() {
        return this.nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPwd() {
        return this.pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getRegdate() {
        return this.regdate;
    }

    public void setRegdate(Date regdate) {
        this.regdate = regdate;
    }


}
