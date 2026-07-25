package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Cart;
import com.crochet.crochetstore.model.CartItem;
import com.crochet.crochetstore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

}