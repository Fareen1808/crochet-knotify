package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // WITHOUT PAGINATION
    List<Product> findByCategory(String category);

    List<Product> findByPriceLessThanEqual(double price);

    List<Product> findByPriceGreaterThanEqual(double price);

    List<Product> findByPriceBetween(double minPrice, double maxPrice);

    List<Product> findByCategoryAndPriceLessThanEqual(String category, double price);

    List<Product> findByCategoryAndPriceGreaterThanEqual(String category, double price);

    List<Product> findByCategoryAndPriceBetween(
            String category,
            double minPrice,
            double maxPrice
    );

    // WITH PAGINATION
    Page<Product> findByCategory(String category, Pageable pageable);

    Page<Product> findByPriceLessThanEqual(double price, Pageable pageable);

    Page<Product> findByPriceGreaterThanEqual(double price, Pageable pageable);

    Page<Product> findByPriceBetween(
            double minPrice,
            double maxPrice,
            Pageable pageable
    );

    Page<Product> findByCategoryAndPriceLessThanEqual(
            String category,
            double price,
            Pageable pageable
    );

    Page<Product> findByCategoryAndPriceGreaterThanEqual(
            String category,
            double price,
            Pageable pageable
    );

    Page<Product> findByCategoryAndPriceBetween(
            String category,
            double minPrice,
            double maxPrice,
            Pageable pageable
    );

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name,
            String description,
            Pageable pageable
    );
}