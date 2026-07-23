package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByUsername(String username);
}
