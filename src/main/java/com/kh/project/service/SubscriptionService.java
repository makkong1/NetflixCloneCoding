package com.kh.project.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.project.entity.MemberEntity;
import com.kh.project.repository.MemberRepository;

@Service
@Transactional
public class SubscriptionService {

    private final MemberRepository memberRepository;

    public SubscriptionService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public boolean isUserSubscribed(String id) {
        Optional<MemberEntity> memberOptional = memberRepository.findById(id);
        return memberOptional.map(MemberEntity::getSubscribed).orElse(false);
    }

    public void updateSubscriptionStatus(String id, boolean subscribed) {
        Optional<MemberEntity> memberOptional = memberRepository.findById(id);
        memberOptional.ifPresent(member -> {
            member.setSubscribed(subscribed);
            memberRepository.save(member);
        });
    }

    public MemberEntity getMemberById(String id) {
        Optional<MemberEntity> memberOptional = memberRepository.findById(id);
        return memberOptional.orElse(null);
    }

    public void saveMember(MemberEntity memberEntity) {
        throw new UnsupportedOperationException("Unimplemented method 'saveMember'");
    }
}