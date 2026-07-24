package com.crochet.crochetstore.repository;

import com.crochet.crochetstore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // WITHOUT pagination
    List<Product> findByCategory(String category);
    List<Product> findByPriceLessThanEqual(double price);
    List<Product> findByCategoryAndPriceLessThanEqual(String category, double price);

    // WITH pagination
    Page<Product> findByCategory(String category, Pageable pageable);
    Page<Product> findByPriceLessThanEqual(double price, Pageable pageable);
    Page<Product> findByCategoryAndPriceLessThanEqual(String category, double price, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name,
            String description,
            Pageable pageable
    );
}
