package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {
}