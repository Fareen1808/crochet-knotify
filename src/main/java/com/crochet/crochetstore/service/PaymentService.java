package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.Order;
import com.crochet.crochetstore.model.Payment;
import com.crochet.crochetstore.repository.OrderRepository;
import com.crochet.crochetstore.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String key;

    @Value("${razorpay.key.secret}")
    private String secret;

    public PaymentService(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    // CREATE RAZORPAY ORDER
    public String createOrder(double amount) throws Exception {

        RazorpayClient client = new RazorpayClient(key, secret);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");

        // IMPORTANT: Use fully-qualified Razorpay Order class
        com.razorpay.Order razorpayOrder = client.orders.create(options);

        Payment payment = new Payment();
        payment.setOrderId(razorpayOrder.get("id").toString());
        payment.setAmount(amount);
        payment.setStatus("CREATED");

        paymentRepository.save(payment);

        return razorpayOrder.toString();
    }

    // VERIFY PAYMENT
    public String verifyPayment(
            String username,
            String orderId,
            String paymentId,
            String razorpaySignature
    ) throws Exception {

        JSONObject options = new JSONObject();

        options.put("razorpay_order_id", orderId);
        options.put("razorpay_payment_id", paymentId);
        options.put("razorpay_signature", razorpaySignature);

        boolean isValid = Utils.verifyPaymentSignature(options, secret);

        Payment payment = paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        if (!isValid) {

            payment.setStatus("FAILED");
            paymentRepository.save(payment);

            throw new RuntimeException("Invalid payment signature");
        }

        // Update Payment table
        payment.setPaymentId(paymentId);
        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);

        // Update latest pending order
        Order order = orderRepository
                .findTopByUsernameAndPaymentStatusOrderByIdDesc(
                        username,
                        "PENDING"
                )
                .orElseThrow(() ->
                        new RuntimeException("Pending order not found"));

        order.setPaymentStatus("PAID");
        orderRepository.save(order);

        return "Payment verified successfully";
    }
}