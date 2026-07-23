package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.model.Cart;
import com.crochet.crochetstore.service.CartService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ✅ ADD TO CART
    @PostMapping("/add")
    public Cart addToCart(
            @RequestParam String username,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {

        return cartService.addToCart(
                username,
                productId,
                quantity
        );
    }

    // ✅ VIEW CART
    @GetMapping("/{username}")
    public Cart getCart(@PathVariable String username) {

        return cartService.getCart(username);
    }

    // ✅ REMOVE ITEM
    @DeleteMapping("/remove/{cartItemId}")
    public String removeItem(
            @PathVariable Long cartItemId
    ) {

        return cartService.removeItem(cartItemId);
    }

    // ✅ TOTAL PRICE
    @GetMapping("/{username}/total")
    public double calculateTotal(
            @PathVariable String username
    ) {

        return cartService.calculateTotal(username);
    }
}