package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.*;
import com.crochet.crochetstore.repository.CartRepository;
import com.crochet.crochetstore.repository.OrderRepository;
import com.crochet.crochetstore.repository.ProductRepository;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(
            CartRepository cartRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository
    ) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // CHECKOUT
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

        // CONVERT CART ITEMS -> ORDER ITEMS
        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            // CHECK STOCK
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException(
                        product.getName() +
                        " has only " +
                        product.getStock() +
                        " item(s) left in stock."
                );
            }

            // REDUCE STOCK
            product.setStock(
                    product.getStock() - cartItem.getQuantity()
            );

            productRepository.save(product);

            // CREATE ORDER ITEM
            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());

            // SAVE CURRENT PRICE
            orderItem.setPrice(product.getPrice());

            orderItem.setOrder(order);

            order.getItems().add(orderItem);

            total += product.getPrice() * cartItem.getQuantity();
        }

        order.setTotalAmount(total);

        // Payment will be updated after Razorpay verification
        order.setPaymentStatus("PENDING");

        // SAVE ORDER
        Order savedOrder = orderRepository.save(order);

        // CLEAR CART
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }
}