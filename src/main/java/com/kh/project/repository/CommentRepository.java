package com.kh.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.project.entity.CommentEntity;

//Spring Data JPA를 사용하여 데이터베이스와 상호작용하는 레포지토리 인터페이스
//JpaRepository를 상속받아 기본적인 CRUD (Create, Read, Update, Delete) 작업을 자동으로 제공하며, 추가적인 데이터베이스 쿼리를 정의할 수 있음
//JpaRepository<T, ID>에서 T는 엔티티 클래스 타입, ID는 엔티티의 ID 타입
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    /*
     * Spring Data JPA 네이밍 규칙
     * Spring Data JPA는 리포지토리 인터페이스에 있는 메소드 이름을 기반으로 쿼리를 자동으로 생성할 수 있다.
     * findBy<PropertyName>
     * findBy는 검색 메소드임을 나타내고, <PropertyName>은 엔티티의 속성 이름을 나타냅니다. 이 경우, movieId은
     * CommentEntity 클래스의 movieId 속성을 나타낸다.
     * 
     * 이 메소드 이름은 JPA에게 CommentEntity 엔티티에서 movieTitle 속성이 주어진 값과 일치하는 모든 레코드를 검색하라는
     * 의미를 전달
     */
    List<CommentEntity> findByMovieId(String movieId);
}
