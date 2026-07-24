package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.Product;
import com.crochet.crochetstore.repository.ProductRepository;
import com.crochet.crochetstore.dto.ProductResponse;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;
import java.util.List;

@Service
public class ProductService {

    private static final Set<String> ALLOWED_SORT_PROPERTIES = Set.of("id", "name", "price");

    private static final Logger logger =
            LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ADD
    @CacheEvict(value = {"products", "productById", "productSearch"}, allEntries = true)
    public Product addProduct(Product product) {
        logger.info("Adding product: {}", product.getName());
        return productRepository.save(product);
    }

    // GET BY ID
    @Cacheable(value = "productById", key = "#id")
    public Product getProductById(Long id) {
        logger.info("Fetching product with id: {}", id);

        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // UPDATE
    @CacheEvict(value = {"products", "productById", "productSearch"}, allEntries = true)
    public Product updateProduct(Long id, Product newProduct, Integer stock) {
        logger.info("Updating product with id: {}", id);

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existingProduct.setName(newProduct.getName());
        existingProduct.setDescription(newProduct.getDescription());
        existingProduct.setPrice(newProduct.getPrice());
        existingProduct.setCategory(newProduct.getCategory());
        if (newProduct.getImageUrl() != null) {
            existingProduct.setImageUrl(newProduct.getImageUrl());
        }
        if (stock != null) {
            existingProduct.setStock(stock);
        }

        logger.info("Product updated successfully with id: {}", id);

        return productRepository.save(existingProduct);
    }

    // DELETE
    @CacheEvict(value = {"products", "productById", "productSearch"}, allEntries = true)
    public String deleteProduct(Long id) {

        logger.info("Request to delete product with id: {}", id);

        if (!productRepository.existsById(id)) {
            logger.warn("Product not found with id: {}", id);
            throw new RuntimeException("Product not found with id: " + id);
        }

        productRepository.deleteById(id);

        logger.info("Product deleted successfully with id: {}", id);

        return "Product deleted successfully";
    }

    // FILTERS
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getProductsByMaxPrice(double price) {
        return productRepository.findByPriceLessThanEqual(price);
    }

    public List<Product> getProductsByCategoryAndPrice(String category, double price) {
        return productRepository.findByCategoryAndPriceLessThanEqual(category, price);
    }

    // PAGINATION + FILTER + DTO
    @Cacheable(value = "products", key = "#category + ':' + #minPrice + ':' + #maxPrice + ':' + #pageable")
public ProductResponse getProducts(
        String category,
        Double minPrice,
        Double maxPrice,
        Pageable pageable
) {

    validateFilters(minPrice, maxPrice, pageable);

    Page<Product> page;

    if (category != null && !category.isBlank()) {

        if (maxPrice != null) {
            page = productRepository.findByCategoryAndPriceLessThanEqual(
                    category.trim(),
                    maxPrice,
                    pageable
            );
        } else {
            page = productRepository.findByCategory(
                    category.trim(),
                    pageable
            );
        }

    } else if (maxPrice != null) {

        page = productRepository.findByPriceLessThanEqual(
                maxPrice,
                pageable
        );

    } else {

        page = productRepository.findAll(pageable);

    }

    return new ProductResponse(
            page.getContent(),
            page.getNumber(),
            page.getTotalPages(),
            page.getTotalElements()
    );
}

    @Cacheable(value = "productSearch", key = "#keyword + ':' + #pageable")
    public ProductResponse searchProducts(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException("Keyword is required");
        }
        validateSort(pageable);
        Page<Product> page = productRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword.trim(), keyword.trim(), pageable);

        return new ProductResponse(page.getContent(), page.getNumber(), page.getTotalPages(), page.getTotalElements());
    }

    private void validateFilters(Double minPrice, Double maxPrice, Pageable pageable) {
        if (minPrice != null && minPrice < 0) {
            throw new IllegalArgumentException("Minimum price cannot be negative");
        }
        if (maxPrice != null && maxPrice < 0) {
            throw new IllegalArgumentException("Maximum price cannot be negative");
        }
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new IllegalArgumentException("Minimum price cannot exceed maximum price");
        }
        validateSort(pageable);
    }

    private void validateSort(Pageable pageable) {
        pageable.getSort().forEach(order -> {
            if (!ALLOWED_SORT_PROPERTIES.contains(order.getProperty())) {
                throw new IllegalArgumentException("Sorting is supported only by id, name, or price");
            }
        });
    }

    public String getAllProductsCount() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllProductsCount'");
    }

    @PostConstruct
public void debugDatabase() {

    System.out.println("======================================");

    System.out.println("Product Count = " + productRepository.count());

    productRepository.findAll().forEach(product ->
            System.out.println(product.getId() + " -> " + product.getName())
    );

    Object database = entityManager
            .createNativeQuery("SELECT current_database()")
            .getSingleResult();

    System.out.println("Connected Database = " + database);

    System.out.println("======================================");
}
}
