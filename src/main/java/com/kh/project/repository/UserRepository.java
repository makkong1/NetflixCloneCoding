package com.kh.project.repository;

import com.kh.project.entity.UserEntity;
import java.util.Optional;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    // @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM
    // UserEntity u WHERE u.email = :email")
    // 이 어노테이션은 UserEntity 테이블에서 주어진 이메일(:email)을 가진 사용자가 존재하는지를 확인하기 위한 쿼리를 정의합니다.
    // COUNT(u)는 UserEntity 테이블의 레코드(행) 수를 세는 함수로,
    // 이메일이 존재하면 true를 반환하고, 그렇지 않으면
    // false를
    // 반환합니다.
    // 이 쿼리어노테이션이 없으면 sql오류발생하는데 왜 그런지 모르겠음...
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserEntity u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);
}
