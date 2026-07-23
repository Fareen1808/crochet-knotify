package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.*;
import com.crochet.crochetstore.repository.*;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    public OrderService(CartRepository cartRepository,
                        OrderRepository orderRepository) {

        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    // ✅ CHECKOUT
    public Order checkout(String username) {

        // FIND USER CART
        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        // EMPTY CART CHECK
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // CREATE ORDER
        Order order = new Order();

        order.setUsername(username);

        double total = 0;

        // CONVERT CART ITEMS → ORDER ITEMS
        for (CartItem cartItem : cart.getItems()) {

            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(cartItem.getProduct());

            orderItem.setQuantity(cartItem.getQuantity());

            // STORE CURRENT PRODUCT PRICE
            orderItem.setPrice(
                    cartItem.getProduct().getPrice()
            );

            orderItem.setOrder(order);

            order.getItems().add(orderItem);

            // CALCULATE TOTAL
            total += cartItem.getQuantity()
                    * cartItem.getProduct().getPrice();
        }

        order.setTotalAmount(total);

        // TEMPORARY PAYMENT STATUS
        order.setPaymentStatus("PENDING");

        // SAVE ORDER
        Order savedOrder = orderRepository.save(order);

        // CLEAR CART
        cart.getItems().clear();

        cartRepository.save(cart);

        return savedOrder;
    }
}