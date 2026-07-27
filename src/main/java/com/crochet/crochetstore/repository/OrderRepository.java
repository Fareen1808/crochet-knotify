package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Customer order history
    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByUsername(String username);

    // Admin - fetch all orders with items and products
    @Override
    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findAll();

    // Latest order of a user
    @EntityGraph(attributePaths = {"items", "items.product"})
    Order findTopByUsernameOrderByIdDesc(String username);
}