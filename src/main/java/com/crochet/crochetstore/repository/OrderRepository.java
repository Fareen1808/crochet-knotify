package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Override
    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findAll();

    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByUsername(String username);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findTopByUsernameAndPaymentStatusOrderByIdDesc(
            String username,
            String paymentStatus
    );
}