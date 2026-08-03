package com.studystack.service.serviceimpl;

import java.time.LocalDateTime;
import java.util.Optional;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.studystack.model.Purchase;
import com.studystack.model.Order;
import com.studystack.repository.PurchaseRepository;
import com.studystack.repository.OrderRepository;
import com.studystack.service.PurchaseService;

@Service
@Transactional
public class PurchaseServiceImpl implements PurchaseService {

    private static final Logger logger =
            LoggerFactory.getLogger(PurchaseServiceImpl.class);

    private final PurchaseRepository purchaseRepository;
    private final OrderRepository orderRepository;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository,
                               OrderRepository orderRepository) {
        this.purchaseRepository = purchaseRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public Purchase savePurchase(String paymentId, String orderId) {

        Purchase purchase = new Purchase();

        purchase.setPaymentId(paymentId);
        purchase.setOrderId(orderId);
        // try to associate Purchase with existing Order entity (optional)
        Order order = orderRepository.findByOrderId(orderId).orElse(null);
        purchase.setOrder(order);
        purchase.setPurchaseDate(LocalDateTime.now());

        Purchase savedPurchase = purchaseRepository.save(purchase);

        logger.info("Purchase saved successfully with payment ID : {}", paymentId);

        return savedPurchase;
    }

    @Override
    public Optional<Purchase> getPurchaseByPaymentId(String paymentId) {

        return purchaseRepository.findByPaymentId(paymentId);

    }

}