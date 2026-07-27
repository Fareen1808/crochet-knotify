package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.service.PaymentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // CREATE RAZORPAY ORDER
    @PostMapping("/create-order")
    public String createOrder(@RequestParam double amount) throws Exception {

        return paymentService.createOrder(amount);
    }

    // VERIFY PAYMENT
    @PostMapping("/verify")
    public String verifyPayment(
            Authentication authentication,
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature
    ) throws Exception {

        return paymentService.verifyPayment(
                authentication.getName(),
                orderId,
                paymentId,
                signature
        );
    }
}