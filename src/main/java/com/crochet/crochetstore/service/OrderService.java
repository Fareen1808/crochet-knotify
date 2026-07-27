package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.*;
import com.crochet.crochetstore.repository.CartRepository;
import com.crochet.crochetstore.repository.OrderRepository;
import com.crochet.crochetstore.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * OrderService owns the Order/OrderItem/Cart/Product domain ONLY.
 * It has no knowledge of Razorpay, Payment, or signatures - on purpose.
 * That separation is what lets PaymentService and OrderService both exist
 * without depending on each other (see CheckoutService for the orchestration).
 */
@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(CartRepository cartRepository,
                         OrderRepository orderRepository,
                         ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    /**
     * Step 1 of checkout. Creates an Order in PENDING status.
     *
     * Deliberately does NOT touch stock and does NOT touch the cart.
     * Those are consequences of a SUCCESSFUL payment, not of merely
     * intending to pay - that's the core fix for the "checkout without
     * payment" and "stock deducted before payment" problems.
     *
     * Stock is only VALIDATED here (fail fast, good UX), not deducted.
     * The authoritative deduction happens again in markOrderPaid(),
     * inside the same transaction as the payment success - that second
     * check is what protects against a race where two people "pass"
     * this validation for the last unit of stock but only one actually pays first.
     */
    @Transactional
    public Order createPendingOrder(String username) {

        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for user: " + username));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout - cart is empty");
        }

        Order order = new Order();
        order.setUsername(username);
        order.setPaymentStatus(OrderStatus.PENDING);

        double total = 0.0;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new IllegalStateException(
                        product.getName() + " has only " + product.getStock() + " item(s) available in stock.");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            // Price is snapshotted from the DB at this exact moment - never trust
            // any price the client might have sent.
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);

            order.getItems().add(orderItem);

            total += product.getPrice() * cartItem.getQuantity();
        }

        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        logger.info("Created PENDING order {} for user {} with total {}", saved.getId(), username, total);
        return saved;
    }

    /**
     * Step 2 of checkout - called ONLY after PaymentService has confirmed a
     * verified, signature-checked, amount-matched successful payment.
     *
     * This is the single place stock is actually deducted and the cart is
     * actually cleared. It is deliberately idempotent (safe to call twice)
     * because payment gateway callbacks/webhooks can occasionally fire more
     * than once for the same event.
     */
    @Transactional
    public Order markOrderPaid(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        if (order.getPaymentStatus() == OrderStatus.PAID) {
            logger.info("Order {} already marked PAID - skipping duplicate processing", orderId);
            return order;
        }

        // Final, authoritative stock check + deduction, inside the same
        // transaction that marks the order paid.
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();

            if (product.getStock() < item.getQuantity()) {
                // This is a genuinely exceptional case: the user paid, but stock
                // ran out between checkout and payment confirmation. In a full
                // production system this triggers an automatic refund via the
                // Razorpay Refunds API; that call is intentionally left as a
                // follow-up integration point rather than guessed at here.
                throw new IllegalStateException(
                        "Insufficient stock for " + product.getName() + " at payment confirmation time");
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        order.setPaymentStatus(OrderStatus.PAID);
        Order saved = orderRepository.save(order);

        cartRepository.findByUsername(order.getUsername()).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });

        logger.info("Order {} marked PAID, stock deducted, cart cleared", orderId);
        return saved;
    }

    /**
     * Called when payment verification fails. Explicitly does NOT touch
     * stock or the cart, since neither was ever touched for a PENDING order.
     */
    @Transactional
    public Order markOrderFailed(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        order.setPaymentStatus(OrderStatus.FAILED);
        Order saved = orderRepository.save(order);
        logger.warn("Order {} marked FAILED", orderId);
        return saved;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    }

    public List<Order> getOrdersForUser(String username) {
        return orderRepository.findByUsername(username);
    }
}