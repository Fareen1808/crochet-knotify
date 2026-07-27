package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.dto.PaymentVerificationRequest;
import com.crochet.crochetstore.service.CheckoutService;

import com.razorpay.RazorpayException;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * NOTE: /payment/create-order has been intentionally REMOVED.
 * Creating the Razorpay order is now step 2 of POST /orders/checkout,
 * entirely server-side. There is no longer any endpoint that accepts a
 * client-supplied amount - this is what closes the price-tampering hole.
 */
@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final CheckoutService checkoutService;

    public PaymentController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    // STEP 2: verify the completed Razorpay payment and finalize the linked order
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(
            @Valid @RequestBody PaymentVerificationRequest request,
            Authentication authentication
    ) throws RazorpayException {

        String username = authentication.getName();
        String message = checkoutService.verifyPayment(request, username);

        return ResponseEntity.ok(Map.of("message", message));
    }
}