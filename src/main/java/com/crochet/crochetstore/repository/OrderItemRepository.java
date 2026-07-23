package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.OrderItem;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {
}