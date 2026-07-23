package com.crochet.crochetstore.service;

import com.crochet.crochetstore.model.Payment;
import com.crochet.crochetstore.repository.PaymentRepository;

import com.razorpay.*;
import com.razorpay.Utils;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String key;

    @Value("${razorpay.key.secret}")
    private String secret;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // ✅ CREATE ORDER
    public String createOrder(double amount) throws Exception {

        RazorpayClient client = new RazorpayClient(key, secret);

        JSONObject options = new JSONObject();

        options.put("amount", amount * 100); // paise
        options.put("currency", "INR");

        Order order = client.orders.create(options);

        // SAVE IN DB
        Payment payment = new Payment();

        payment.setOrderId(order.get("id"));
        payment.setAmount(amount);
        payment.setStatus("CREATED");

        paymentRepository.save(payment);

        return order.toString();
    }

    // ✅ VERIFY PAYMENT
    public String verifyPayment(String orderId,
                                String paymentId,
                                String razorpaySignature) throws Exception {

        JSONObject options = new JSONObject();

        options.put("razorpay_order_id", orderId);
        options.put("razorpay_payment_id", paymentId);
        options.put("razorpay_signature", razorpaySignature);

        // VERIFY SIGNATURE
        boolean isValid =
                Utils.verifyPaymentSignature(options, secret);

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (isValid) {

            payment.setPaymentId(paymentId);
            payment.setStatus("SUCCESS");

            paymentRepository.save(payment);

            return "Payment verified successfully";
        }

        payment.setStatus("FAILED");

        paymentRepository.save(payment);

        throw new RuntimeException("Invalid payment signature");
    }
}
