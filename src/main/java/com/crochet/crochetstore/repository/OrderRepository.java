package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByUsername(String username);

    @EntityGraph(attributePaths = {"items", "items.product"})
    java.util.Optional<Order> findById(Long id);
}