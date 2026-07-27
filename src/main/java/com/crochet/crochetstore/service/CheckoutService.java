package com.crochet.crochetstore.service;

import com.crochet.crochetstore.dto.CheckoutResponse;
import com.crochet.crochetstore.dto.PaymentVerificationRequest;
import com.crochet.crochetstore.model.Order;
import com.crochet.crochetstore.model.Payment;

import com.razorpay.RazorpayException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The ONLY class in the application that is allowed to know about both
 * OrderService and PaymentService. It orchestrates the two independent
 * domains into the single checkout/payment workflow, without either domain
 * service depending on the other. This is the fix for requirement #7
 * (no circular dependency): dependencies only ever point downward,
 * CheckoutService -> {OrderService, PaymentService}, never sideways.
 */
@Service
public class CheckoutService {

    private static final Logger logger = LoggerFactory.getLogger(CheckoutService.class);

    private final OrderService orderService;
    private final PaymentService paymentService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public CheckoutService(OrderService orderService, PaymentService paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    /**
     * POST /orders/checkout
     *
     * NOTE ON TRANSACTION BOUNDARIES: this method is intentionally NOT wrapped
     * in a single @Transactional spanning the Razorpay network call, because
     * holding a DB transaction open across an external HTTP call is a known
     * anti-pattern (it holds DB connections/locks for the duration of network
     * latency, and a slow/hanging Razorpay call would starve the connection
     * pool). Each inner service method commits its own unit of work instead:
     * OrderService.createPendingOrder() commits the Order first, and
     * PaymentService.createRazorpayPaymentForOrder() commits the Payment
     * second. If the Razorpay call fails after the Order was created, the
     * Order is simply left PENDING with no linked Payment yet - harmless,
     * and easily swept up by a scheduled job that expires stale PENDING
     * orders. This is the standard tradeoff production systems make instead
     * of pretending a distributed operation can be one local transaction.
     */
    public CheckoutResponse initiateCheckout(String username) throws RazorpayException {

        Order order = orderService.createPendingOrder(username);
        Payment payment = paymentService.createRazorpayPaymentForOrder(order);

        logger.info("Checkout initiated for user {}: order={}, razorpayOrder={}",
                username, order.getId(), payment.getRazorpayOrderId());

        return new CheckoutResponse(
                order.getId(),
                payment.getRazorpayOrderId(),
                order.getTotalAmount(),
                "INR",
                razorpayKeyId
        );
    }

    /**
     * POST /payment/verify
     *
     * This method IS wrapped in a single transaction, because everything it
     * does (mark payment success/failure, deduct stock, clear cart) is pure
     * local DB work with no further external calls after signature
     * verification - exactly the case @Transactional is meant for.
     */
    @Transactional
    public String verifyPayment(PaymentVerificationRequest request, String username) throws RazorpayException {

        Payment payment = paymentService.findByRazorpayOrderId(request.getRazorpayOrderId());
        Order order = payment.getOrder();

        // Ownership check: without this, User A could verify a payment/order
        // that actually belongs to User B, simply by knowing or guessing
        // B's razorpayOrderId.
        if (!order.getUsername().equals(username)) {
            throw new AccessDeniedException("This payment does not belong to the authenticated user");
        }

        boolean signatureValid = paymentService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!signatureValid) {
            paymentService.markFailed(payment, request.getRazorpayPaymentId());
            orderService.markOrderFailed(order.getId());
            throw new IllegalStateException("Invalid payment signature");
        }

        paymentService.markSuccess(payment, request.getRazorpayPaymentId());
        orderService.markOrderPaid(order.getId());

        return "Payment verified and order confirmed successfully";
    }
}