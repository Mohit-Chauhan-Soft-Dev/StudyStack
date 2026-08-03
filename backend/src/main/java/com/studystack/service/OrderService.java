package com.studystack.service;

import org.json.JSONObject;

import com.studystack.model.Order;

public interface OrderService {

    String createOrder(Double amount);

    void saveOrder(JSONObject orderResponse);

    void updateOrderStatus(String orderId);

    String checkOrderStatus(Long userId, Long noteId);

    Order getOrderByUserIdAndNoteId(Long userId, Long noteId);

    String returnExistingOrder(JSONObject orderJson);

    boolean isPurchased(Long userId, Long noteId);

}