package com.crochet.crochetstore.dto;

import com.crochet.crochetstore.model.Product;
import java.util.List;

public class ProductResponse {

    private List<Product> products;
    private int page;
    private int totalPages;
    private long totalElements;

    public ProductResponse(List<Product> products,
                           int page,
                           int totalPages,
                           long totalElements) {
        this.products = products;
        this.page = page;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }

    public List<Product> getProducts() {
        return products;
    }

    public int getPage() {
        return page;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }
}