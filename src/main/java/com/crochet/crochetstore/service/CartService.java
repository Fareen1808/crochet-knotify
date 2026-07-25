package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.*;
import com.crochet.crochetstore.repository.*;

import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepository,
                       ProductRepository productRepository,
                       CartItemRepository cartItemRepository) {

        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
    }

    // ✅ ADD PRODUCT TO CART
    public Cart addToCart(String username,
                          Long productId,
                          int quantity) {

        // FIND OR CREATE CART
        Cart cart = cartRepository.findByUsername(username)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUsername(username);
                    return cartRepository.save(newCart);
                });

        // FIND PRODUCT
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));
                        if (quantity <= 0) {
    throw new RuntimeException("Quantity must be greater than zero");
}

if (product.getStock() < quantity) {
    throw new RuntimeException(
            "Only " + product.getStock() + " item(s) available in stock."
    );
}
        // CHECK IF PRODUCT ALREADY EXISTS IN CART
CartItem item = cartItemRepository
        .findByCartAndProduct(cart, product)
        .orElse(null);

if (item != null) {

    item.setQuantity(item.getQuantity() + quantity);

    cartItemRepository.save(item);

} else {

    item = new CartItem();

    item.setProduct(product);
    item.setQuantity(quantity);
    item.setCart(cart);

    cart.getItems().add(item);

    cartItemRepository.save(item);
}

return cartRepository.save(cart);
    }

    // ✅ VIEW CART
    public Cart getCart(String username) {

        return cartRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));
    }

    // ✅ REMOVE ITEM
    public String removeItem(Long cartItemId) {

        cartItemRepository.deleteById(cartItemId);

        return "Item removed from cart";
    }

    // ✅ CALCULATE TOTAL
    public double calculateTotal(String username) {

        Cart cart = getCart(username);

        return cart.getItems()
                .stream()
                .mapToDouble(item ->
                        item.getProduct().getPrice()
                                * item.getQuantity())
                .sum();
    }
}