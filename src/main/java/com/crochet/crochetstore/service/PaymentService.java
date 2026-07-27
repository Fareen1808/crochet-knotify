package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.Order;
import com.crochet.crochetstore.model.Payment;
import com.crochet.crochetstore.model.PaymentStatus;
import com.crochet.crochetstore.repository.PaymentRepository;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import jakarta.persistence.EntityNotFoundException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * PaymentService owns the Razorpay integration and the Payment entity ONLY.
 * It knows about an Order only as an object it was handed (to link and to
 * read the total from) - it never loads, mutates, or saves Order state
 * itself. That boundary is what keeps this service decoupled from OrderService.
 */
@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * Creates the Razorpay order using the AUTHORITATIVE amount already
     * computed and stored on the Order entity by OrderService. The amount
     * parameter from the old API is gone entirely - there is no code path
     * left anywhere that lets a client specify how much they're about to pay.
     */
    @Transactional
    public Payment createRazorpayPaymentForOrder(Order order) throws RazorpayException {

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        long amountInPaise = Math.round(order.getTotalAmount() * 100);
        options.put("amount", amountInPaise);
        options.put("currency", "INR");
        options.put("receipt", "order_" + order.getId());

        // Fully-qualified because com.razorpay.Order and our own model.Order
        // share the same simple class name.
        com.razorpay.Order razorpayOrder = client.orders.create(options);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setRazorpayOrderId(razorpayOrder.get("id"));
        payment.setAmount(order.getTotalAmount());
        payment.setStatus(PaymentStatus.CREATED);

        Payment saved = paymentRepository.save(payment);
        logger.info("Created Razorpay order {} for internal order {} amount {}",
                saved.getRazorpayOrderId(), order.getId(), order.getTotalAmount());
        return saved;
    }

    public Payment findByRazorpayOrderId(String razorpayOrderId) {
        return paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No payment found for razorpayOrderId: " + razorpayOrderId));
    }

    /**
     * Pure signature verification - no side effects, no DB writes.
     * Kept as its own method so it can be unit tested in isolation.
     */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature)
            throws RazorpayException {

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", razorpayOrderId);
        options.put("razorpay_payment_id", razorpayPaymentId);
        options.put("razorpay_signature", razorpaySignature);

        return Utils.verifyPaymentSignature(options, keySecret);
    }

    @Transactional
    public Payment markSuccess(Payment payment, String razorpayPaymentId) {
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        Payment saved = paymentRepository.save(payment);
        logger.info("Payment {} marked SUCCESS", saved.getId());
        return saved;
    }

    @Transactional
    public Payment markFailed(Payment payment, String razorpayPaymentId) {
        payment.setStatus(PaymentStatus.FAILED);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        Payment saved = paymentRepository.save(payment);
        logger.warn("Payment {} marked FAILED", saved.getId());
        return saved;
    }
}