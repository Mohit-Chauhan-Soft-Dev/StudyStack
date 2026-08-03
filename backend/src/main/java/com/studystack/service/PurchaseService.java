package com.studystack.service;

import com.studystack.model.Purchase;

import java.util.Optional;

public interface PurchaseService {

    Purchase savePurchase(String paymentId, String orderId);

    Optional<Purchase> getPurchaseByPaymentId(String paymentId);

}