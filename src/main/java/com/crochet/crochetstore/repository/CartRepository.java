package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;

public interface CartRepository
        extends JpaRepository<Cart, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Cart> findByUsername(String username);
}
