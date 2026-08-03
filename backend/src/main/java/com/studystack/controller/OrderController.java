package com.studystack.controller;

import com.studystack.model.Note;
import com.studystack.model.Order;
import com.studystack.model.User;
import com.studystack.service.AuthService;
import com.studystack.service.NoteService;
import com.studystack.service.OrderService;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {

    private static final Logger logger =
            LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final NoteService noteService;
    private final AuthService authService;

    public OrderController(OrderService orderService,
                           NoteService noteService,
                           AuthService authService) {

        this.orderService = orderService;
        this.noteService = noteService;
        this.authService = authService;
    }

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authService.findByEmail(authentication.getName());
    }

    @PostMapping("/create/{noteId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createOrder(
            @PathVariable Long noteId,
            @RequestBody(required = false) String body) {

        User user = getLoggedInUser();

        logger.info("Creating order for user {} and note {}",
                user.getId(), noteId);

        try {

            Note note = noteService.findById(noteId)
                    .orElseThrow(() ->
                            new RuntimeException("Note not found"));

            Order existingOrder =
                    orderService.getOrderByUserIdAndNoteId(
                            user.getId(),
                            noteId
                     );

            if (existingOrder != null) {

                JSONObject orderJson = new JSONObject();

                orderJson.put("amount", note.getPrice());
                orderJson.put("orderId", existingOrder.getOrderId());
                
                String response = orderService.returnExistingOrder(orderJson);
                logger.info("Order created successfully !!");
                
                return ResponseEntity.ok(response);
            }

            String orderJson = orderService.createOrder(note.getPrice());

            JSONObject response = new JSONObject(orderJson);

            response.put("userId", user.getId());
            response.put("noteId", noteId);

            orderService.saveOrder(response);
            logger.info("Order created successfully !!");

            return ResponseEntity.ok(response.toString());

        } catch (Exception e) {

            logger.error("Error while creating order", e);

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }

    }

    @GetMapping("/check/{noteId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<String> checkOrder(
            @PathVariable Long noteId) {

        try {

            User user = getLoggedInUser();

            String status =orderService.checkOrderStatus(
                               user.getId(),
                               noteId
                           );

            return ResponseEntity.ok(status);

        } catch (Exception e) {

            logger.error("Error checking order", e);

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("FAILED");
        }

    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testAPI() {
    	
     	logger.info("Test API is called from order controller !!");
     	
     	return ResponseEntity
                .status(HttpStatus.OK)
                .body("Test API is called from order controller !!");
     	
    }

}