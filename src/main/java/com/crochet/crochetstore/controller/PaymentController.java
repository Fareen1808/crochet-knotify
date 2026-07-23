package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.service.PaymentService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public String createOrder(@RequestParam double amount) throws Exception {
        return paymentService.createOrder(amount);
    }
    @PostMapping("/verify")
    public String verifyPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature
    ) throws Exception {

        return paymentService.verifyPayment(
                orderId,
                paymentId,
                signature
        );
    }
}