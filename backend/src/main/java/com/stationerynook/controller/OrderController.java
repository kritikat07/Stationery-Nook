package com.stationerynook.controller;

import com.stationerynook.model.Order;
import com.stationerynook.model.User;
import com.stationerynook.repository.OrderRepository;
import com.stationerynook.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        if (currentUser == null || !"owner".equalsIgnoreCase(currentUser.getRole())) {
            return ResponseEntity.status(403).body("Only the owner can view all orders.");
        }
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Unauthorized user.");
        }
        List<Order> orders = orderRepository.findByCustomer(currentUser);
        return ResponseEntity.ok(orders);
    }
}
