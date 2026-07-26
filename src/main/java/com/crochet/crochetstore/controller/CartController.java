package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.model.Cart;
import com.crochet.crochetstore.service.CartService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ADD TO CART
    @PostMapping("/add")
    public Cart addToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {

        String username = authentication.getName();

        return cartService.addToCart(
                username,
                productId,
                quantity
        );
    }

    // VIEW CART
    @GetMapping
    public Cart getCart(Authentication authentication) {

        String username = authentication.getName();

        return cartService.getCart(username);
    }

    // REMOVE ITEM
    @DeleteMapping("/remove/{cartItemId}")
public String removeItem(
        @PathVariable Long cartItemId,
        Authentication authentication
) {

    String username = authentication.getName();

    return cartService.removeItem(cartItemId, username);
}

    // CART TOTAL
    @GetMapping("/total")
    public double calculateTotal(Authentication authentication) {

        String username = authentication.getName();

        return cartService.calculateTotal(username);
    }
}