package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.dto.CheckoutResponse;
import com.crochet.crochetstore.model.Order;
import com.crochet.crochetstore.service.CheckoutService;
import com.crochet.crochetstore.service.OrderService;

import com.razorpay.RazorpayException;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;

    public OrderController(CheckoutService checkoutService, OrderService orderService) {
        this.checkoutService = checkoutService;
        this.orderService = orderService;
    }

    // STEP 1: create a PENDING order from the user's cart and open a Razorpay order for it
    @PostMapping("/checkout")
    public CheckoutResponse checkout(Authentication authentication) throws RazorpayException {
        String username = authentication.getName();
        return checkoutService.initiateCheckout(username);
    }

    // ORDER HISTORY
    @GetMapping
    public List<Order> getOrders(Authentication authentication) {
        String username = authentication.getName();
        return orderService.getOrdersForUser(username);
    }
}