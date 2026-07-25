package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.model.Order;
import com.crochet.crochetstore.repository.OrderRepository;
import com.crochet.crochetstore.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService,
                           OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    // CHECKOUT
    @PostMapping("/checkout")
    public Order checkout(Authentication authentication) {

        String username = authentication.getName();

        return orderService.checkout(username);
    }

    // ORDER HISTORY
    @GetMapping
    public List<Order> getOrders(Authentication authentication) {

        String username = authentication.getName();

        return orderRepository.findByUsername(username);
    }
}