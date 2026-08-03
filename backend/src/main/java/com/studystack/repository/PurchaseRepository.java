package com.studystack.repository;

import com.studystack.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Optional<Purchase> findByPaymentId(String paymentId);
}
