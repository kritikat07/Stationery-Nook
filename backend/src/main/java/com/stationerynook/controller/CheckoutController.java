package com.stationerynook.controller;

import com.stationerynook.model.Order;
import com.stationerynook.model.OrderItem;
import com.stationerynook.model.Product;
import com.stationerynook.model.User;
import com.stationerynook.repository.OrderRepository;
import com.stationerynook.repository.ProductRepository;
import com.stationerynook.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public CheckoutController(UserRepository userRepository, ProductRepository productRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        if (request.getCart() == null || request.getCart().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Your cart is empty. Add items before payment."));
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User customer = userRepository.findByEmail(email).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized user."));
        }

        PaymentInfo payment = request.getPayment();
        if (payment == null || payment.getMethod() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment method is required."));
        }

        String paymentDetails = "";
        if ("card".equalsIgnoreCase(payment.getMethod())) {
            String cardNo = payment.getCardNumber() != null ? payment.getCardNumber().replaceAll("\\s+", "") : "";
            if (!cardNo.matches("^[0-9]{12,19}$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid card number."));
            }
            if (payment.getExpiry() == null || payment.getCvv() == null || !payment.getCvv().matches("^[0-9]{3,4}$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please enter valid card expiry and CVV."));
            }
            paymentDetails = cardNo.substring(cardNo.length() - 4);
        } else if ("upi".equalsIgnoreCase(payment.getMethod())) {
            String upiId = payment.getUpiId() != null ? payment.getUpiId().trim() : "";
            if (upiId.isEmpty() || !upiId.matches("^[^\\s@]+@[A-Za-z0-9.-]+$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid UPI ID."));
            }
            paymentDetails = upiId;
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Unsupported payment method."));
        }

        double amount = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        String orderId = "SN-" + System.currentTimeMillis();

        Order order = new Order(
                orderId,
                customer,
                0.0,
                payment.getMethod(),
                paymentDetails,
                "paid",
                LocalDateTime.now(),
                null
        );

        for (CartItem item : request.getCart()) {
            Product product = productRepository.findById(item.getId()).orElse(null);
            if (product == null) {
                if (item.getId() != null && item.getId().startsWith("print-order-")) {
                    product = new Product(
                            item.getId(),
                            item.getName() != null ? item.getName() : "Print Service",
                            "Custom document printing",
                            item.getPrice() != null ? item.getPrice() : 50.0
                    );
                    productRepository.save(product);
                } else {
                    return ResponseEntity.badRequest().body(Map.of("error", "Product not found: " + item.getId()));
                }
            }
            amount += product.getPrice() * item.getQuantity();

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    item.getQuantity(),
                    product.getPrice()
            );
            orderItems.add(orderItem);
        }

        order.setTotal(amount);
        order.setItems(orderItems);

        orderRepository.save(order);

        return ResponseEntity.ok(Map.of(
                "orderId", orderId,
                "amount", amount,
                "message", "Payment successful. Your order is ready for pickup."
        ));
    }

    public static class CheckoutRequest {
        private List<CartItem> cart;
        private PaymentInfo payment;

        public List<CartItem> getCart() {
            return cart;
        }

        public void setCart(List<CartItem> cart) {
            this.cart = cart;
        }

        public PaymentInfo getPayment() {
            return payment;
        }

        public void setPayment(PaymentInfo payment) {
            this.payment = payment;
        }
    }

    public static class CartItem {
        private String id;
        private int quantity;
        private Double price;
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class PaymentInfo {
        private String method;
        private String cardNumber;
        private String expiry;
        private String cvv;
        private String upiId;

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }

        public String getCardNumber() {
            return cardNumber;
        }

        public void setCardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
        }

        public String getExpiry() {
            return expiry;
        }

        public void setExpiry(String expiry) {
            this.expiry = expiry;
        }

        public String getCvv() {
            return cvv;
        }

        public void setCvv(String cvv) {
            this.cvv = cvv;
        }

        public String getUpiId() {
            return upiId;
        }

        public void setUpiId(String upiId) {
            this.upiId = upiId;
        }
    }
}
