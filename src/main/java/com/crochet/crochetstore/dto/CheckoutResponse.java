package com.crochet.crochetstore.dto;

/**
 * Returned by POST /orders/checkout.
 * Gives the frontend exactly what it needs to open the Razorpay widget -
 * nothing more. The frontend never sees or chooses the amount; it only
 * ever displays what the backend already calculated and committed to an Order.
 */
public class CheckoutResponse {

    private Long orderId;
    private String razorpayOrderId;
    private double amount;
    private String currency;
    private String key;

    public CheckoutResponse() {
    }

    public CheckoutResponse(Long orderId, String razorpayOrderId, double amount,
                             String currency, String key) {
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.key = key;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}