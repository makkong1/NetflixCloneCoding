package com.kh.project.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kh.project.dto.MemberDTO;
import com.kh.project.entity.MemberEntity;
import com.kh.project.service.SubscriptionService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/subscription")
    public ResponseEntity<Boolean> getSubscriptionStatus(@RequestParam String id) {
        boolean subscribed = subscriptionService.isUserSubscribed(id);
        return ResponseEntity.ok(subscribed);
    }

    @PostMapping("/subscription")
    public ResponseEntity<Map<String, Object>> subscribeMember(@RequestBody MemberDTO memberDTO) {
        try {
            subscriptionService.updateSubscriptionStatus(memberDTO.getId(), memberDTO.getSubscribed());
            MemberEntity member = subscriptionService.getMemberById(memberDTO.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("id", member.getId());
            response.put("subscribed", member.getSubscribed());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(buildErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<Object> confirmPayment(@RequestBody PaymentConfirmationRequest request) {
        try {
            // Validate request fields
            if (request.getOrderId() == null || request.getAmount() == null || request.getPaymentKey() == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            // Simulate payment confirmation logic (replace with actual logic)
            boolean paymentConfirmed = simulatePaymentConfirmation(request);

            // Update subscription status based on payment confirmation
            if (paymentConfirmed) {
                subscriptionService.updateSubscriptionStatus(request.getOrderId(), true);
            } else {
                return ResponseEntity.badRequest().body("Payment confirmation failed");
            }

            // Fetch updated member details after subscription status update
            MemberEntity member = subscriptionService.getMemberById(request.getOrderId());

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("id", member.getId());
            response.put("subscribed", member.getSubscribed());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing payment: " + e.getMessage());
        }
    }

    private boolean simulatePaymentConfirmation(PaymentConfirmationRequest request) {
        // Simulate payment confirmation logic
        // Replace with actual payment gateway integration or business logic
        return true; // For simulation, assume payment is always confirmed
    }

    private Map<String, Object> buildErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        return errorResponse;
    }
}

class PaymentConfirmationRequest {
    private String orderId;
    private String amount;
    private String paymentKey;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getPaymentKey() {
        return paymentKey;
    }

    public void setPaymentKey(String paymentKey) {
        this.paymentKey = paymentKey;
    }

}