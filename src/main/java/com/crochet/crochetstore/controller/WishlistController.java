package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.model.Wishlist;
import com.crochet.crochetstore.service.WishlistService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(
            WishlistService wishlistService
    ) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public Wishlist getWishlist(
            Authentication authentication
    ) {

        return wishlistService.getWishlist(
                authentication.getName()
        );
    }

    @PostMapping("/add")
    public Wishlist addToWishlist(
            Authentication authentication,
            @RequestParam Long productId
    ) {

        return wishlistService.addToWishlist(
                authentication.getName(),
                productId
        );
    }

    @DeleteMapping("/remove/{id}")
    public String removeItem(
            Authentication authentication,
            @PathVariable Long id
    ) {

        return wishlistService.removeItem(
                authentication.getName(),
                id
        );
    }
}