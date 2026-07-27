package com.crochet.crochetstore.dto;

public class AdminStats {

    private long totalProducts;
    private long totalOrders;
    private double revenue;
    private long totalCustomers;

    public AdminStats(long totalProducts,
                      long totalOrders,
                      double revenue,
                      long totalCustomers) {

        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.revenue = revenue;
        this.totalCustomers = totalCustomers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public double getRevenue() {
        return revenue;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }
}