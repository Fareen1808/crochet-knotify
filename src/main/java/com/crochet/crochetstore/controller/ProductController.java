package com.crochet.crochetstore.controller;

import com.crochet.crochetstore.model.Product;
import com.crochet.crochetstore.service.ProductService;
import com.crochet.crochetstore.dto.ProductResponse;
import com.crochet.crochetstore.dto.ApiResponse;
import com.crochet.crochetstore.dto.ProductRequest;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    // Constructor Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET WITH DTO + PAGINATION (USER + ADMIN)
    @GetMapping
    public ProductResponse getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable
    ) {
        return productService.getProducts(category, minPrice, maxPrice, pageable);
    }

    @GetMapping("/search")
    public ProductResponse searchProducts(
            @RequestParam String keyword,
            @PageableDefault(page = 0, size = 10, sort = "id") Pageable pageable
    ) {
        return productService.searchProducts(keyword, pageable);
    }

    // GET BY ID (USER + ADMIN)
    @GetMapping("/{id}")
    public ApiResponse<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return new ApiResponse<>("Product fetched successfully", product);
    }

    // ADD PRODUCT (ADMIN ONLY)
    @PostMapping("/admin")
    public ApiResponse<Product> addProduct(@Valid @RequestBody ProductRequest request) {

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }

        Product saved = productService.addProduct(product);

        return new ApiResponse<>("Product created successfully", saved);
    }

    // UPDATE PRODUCT (ADMIN ONLY)
    @PutMapping("/admin/{id}")
    public ApiResponse<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }

        Product updated = productService.updateProduct(id, product, request.getStock());

        return new ApiResponse<>("Product updated successfully", updated);
    }

    // DELETE PRODUCT (ADMIN ONLY)
    @DeleteMapping("/admin/{id}")
    public String deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
    }
    @GetMapping("/debug")
    public String debug() {
        return "Total Products = " + productService.getAllProductsCount();
    }
}
