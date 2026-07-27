package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.dto.AdminStats;
import com.crochet.crochetstore.model.Order;
import com.crochet.crochetstore.repository.OrderRepository;
import com.crochet.crochetstore.repository.ProductRepository;
import com.crochet.crochetstore.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminController(
            ProductRepository productRepository,
            OrderRepository orderRepository,
            UserRepository userRepository
    ) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public AdminStats getStats() {

        long products = productRepository.count();

        List<Order> orders = orderRepository.findAll();

        long totalOrders = orders.size();

        double revenue = orders.stream()
                .filter(o -> "PAID".equalsIgnoreCase(o.getPaymentStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        long customers = userRepository.count();

        return new AdminStats(
                products,
                totalOrders,
                revenue,
                customers
        );
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/orders/{username}")
    public List<Order> getOrdersByUsername(
            @PathVariable String username
    ) {
        return orderRepository.findByUsername(username);
    }
}