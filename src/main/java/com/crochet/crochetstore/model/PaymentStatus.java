package com.crochet.crochetstore.model;

/**
 * Lifecycle states for a Payment attempt.
 *
 * CREATED - Razorpay order created on Razorpay's side, no money has moved yet
 * SUCCESS - signature verified, payment genuinely completed
 * FAILED  - signature verification failed, or Razorpay reported failure
 */
public enum PaymentStatus {
    CREATED,
    SUCCESS,
    FAILED
}