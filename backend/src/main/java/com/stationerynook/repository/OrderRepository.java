package com.stationerynook.repository;

import com.stationerynook.model.Order;
import com.stationerynook.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomer(User customer);
}
