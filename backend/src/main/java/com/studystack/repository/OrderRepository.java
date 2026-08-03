package com.studystack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studystack.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderId(String orderId);
    Optional<Order> findByUser_IdAndNote_Id(Long userId, Long noteId);

}
