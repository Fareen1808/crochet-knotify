package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.*;
import com.crochet.crochetstore.repository.*;

import org.springframework.stereotype.Service;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            ProductRepository productRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
    }

    public Wishlist getWishlist(String username) {

        return wishlistRepository.findByUsername(username)
                .orElseGet(() -> {
                    Wishlist wishlist = new Wishlist();
                    wishlist.setUsername(username);
                    return wishlistRepository.save(wishlist);
                });
    }

    public Wishlist addToWishlist(
            String username,
            Long productId
    ) {

        Wishlist wishlist = getWishlist(username);

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (wishlistItemRepository
                .findByWishlistAndProduct(wishlist, product)
                .isPresent()) {

            return wishlist;
        }

        WishlistItem item = new WishlistItem();

        item.setWishlist(wishlist);
        item.setProduct(product);

        wishlist.getItems().add(item);

        wishlistItemRepository.save(item);

        return wishlistRepository.save(wishlist);
    }

    public String removeItem(
            String username,
            Long wishlistItemId
    ) {

        Wishlist wishlist = getWishlist(username);

        WishlistItem item = wishlistItemRepository
                .findById(wishlistItemId)
                .orElseThrow(() ->
                        new RuntimeException("Item not found"));

        if (!item.getWishlist().getId().equals(wishlist.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        wishlistItemRepository.delete(item);

        return "Removed from wishlist";
    }
}