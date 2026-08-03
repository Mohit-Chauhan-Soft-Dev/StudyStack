
package com.studystack.service.serviceimpl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.studystack.model.Note;
import com.studystack.model.OrderStatus;
import com.studystack.model.User;
import com.studystack.repository.NoteRepository;
import com.studystack.repository.OrderRepository;
import com.studystack.repository.UserRepository;
import com.studystack.service.OrderService;

import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Value("${razorpay.environment:sandbox}")
    private String environment;

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NoteRepository noteRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            UserRepository userRepository,
                            NoteRepository noteRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.noteRepository = noteRepository;
    }

    @Override
    public String createOrder(Double amount) {
        try {

            RazorpayClient client =
                    new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", Math.round(amount * 100));
            orderRequest.put("currency", "INR");

            Order order = client.orders.create(orderRequest);

            JSONObject response = new JSONObject();
            response.put("orderId", order.get("id").toString());
            response.put("amount", amount);
            response.put("currency", "INR");
            response.put("keyId", keyId);
            response.put("environment", environment);

            return response.toString();

        } catch (Exception e) {

            logger.error("Error creating Razorpay order", e);

            throw new RuntimeException("Unable to create order.");
        }
    }

    @Override
    public void saveOrder(JSONObject orderResponse) {

        com.studystack.model.Order order = new com.studystack.model.Order();

        User user = userRepository.getReferenceById(orderResponse.getLong("userId"));
        Note note = noteRepository.getReferenceById(orderResponse.getLong("noteId"));

        order.setUser(user);
        order.setNote(note);
        order.setOrderId(orderResponse.getString("orderId"));
        order.setStatus(OrderStatus.CREATED);

        orderRepository.save(order);

        logger.info("Order saved successfully !!");
    }

    @Override
    public void updateOrderStatus(String orderId) {

        com.studystack.model.Order order =
                orderRepository.findByOrderId(orderId)
                        .orElseThrow(() ->
                                new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.PAID);

        orderRepository.save(order);

        logger.info("Order marked as PAID !!}");
    }

    @Override
    public String checkOrderStatus(Long userId,
                                   Long noteId) {

        return orderRepository
                .findByUser_IdAndNote_Id(userId, noteId)
                .map(order -> order.getStatus().name())
                .orElse("NOT_PURCHASED");
    }

    @Override
    public com.studystack.model.Order getOrderByUserIdAndNoteId(
            Long userId,
            Long noteId) {

        return orderRepository
                .findByUser_IdAndNote_Id(userId, noteId)
                .orElse(null);
    }

    @Override
    public String returnExistingOrder(JSONObject orderJson) {

        orderJson.put("currency", "INR");
        orderJson.put("keyId", keyId);
        orderJson.put("environment", environment);

        return orderJson.toString();
    }

    @Override
    public boolean isPurchased(Long userId,
                               Long noteId) {

        return orderRepository
                .findByUser_IdAndNote_Id(userId, noteId)
                .map(order -> order.getStatus() == OrderStatus.PAID)
                .orElse(false);
    }

}