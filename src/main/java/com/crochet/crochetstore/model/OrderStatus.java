package com.crochet.crochetstore.model;

/**
 * Lifecycle states for an Order.
 *
 * PENDING   - order row created, cart/stock NOT yet touched, waiting for payment
 * PAID      - payment verified successfully, stock deducted, cart cleared
 * FAILED    - payment verification failed or signature was invalid
 * CANCELLED - reserved for future use (e.g. user abandons checkout, admin cancels)
 */
public enum OrderStatus {
    PENDING,
    PAID,
    FAILED,
    CANCELLED
}