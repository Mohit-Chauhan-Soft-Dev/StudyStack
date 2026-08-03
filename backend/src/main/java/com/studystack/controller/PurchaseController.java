package com.studystack.controller;

import com.razorpay.RazorpayException;
import com.studystack.dto.RazorpayResponse;
import com.studystack.service.OrderService;
import com.studystack.service.PurchaseService;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Hex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
public class PurchaseController {
	
	private Logger logger =
	        LoggerFactory.getLogger(PurchaseController.class);

    @Value("${razorpay.key.secret}")
    private String keySecret;
    
    private final PurchaseService purchaseService;
    
    private final OrderService orderService;

    PurchaseController(PurchaseService purchaseService, OrderService orderService) {
        this.purchaseService = purchaseService;
        this.orderService = orderService;
    }
    
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/purchase/callback")
    public ResponseEntity<String> paymentCallback(@RequestBody RazorpayResponse response) throws RazorpayException {
        try {
        	
        	logger.info("Razopay Response Received !!");
			
			String razorpayPaymentId = response.getRazorpayPaymentId();
			String razorpayOrderId = response.getRazorpayOrderId();
			String razorpaySignature = response.getRazorpaySignature();
			
            // Verify the payment signature here
            String signature = razorpayOrderId + "|" + razorpayPaymentId;
            boolean isValid = verifySignature(signature, razorpaySignature, keySecret);
            

            if (isValid) {
              	logger.info("Signature is valid !!");
				purchaseService.savePurchase(razorpayPaymentId, razorpayOrderId);
				orderService.updateOrderStatus(razorpayOrderId);
            } else {
              	logger.info("Signature is invalid !!");
            }
            
            return new ResponseEntity<>("Payment callback processed successfully", org.springframework.http.HttpStatus.OK);
        } catch (RazorpayException e) {
            System.err.println("Razorpay Exception during callback: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("General Exception during callback: " + e.getMessage());
            throw new RazorpayException("General exception during callback");
        }
    }
    
    private static boolean verifySignature(String payload, String expectedSignature, String secret)
    	      throws RazorpayException {
    	    String actualSignature = getHash(payload, secret);
    	    return isEqual(actualSignature.getBytes(), expectedSignature.getBytes());
    }
    
    private static String getHash(String payload, String secret) throws RazorpayException {
        Mac sha256_HMAC;
        try {
          sha256_HMAC = Mac.getInstance("HmacSHA256");
          SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256");
          sha256_HMAC.init(secret_key);
          byte[] hash = sha256_HMAC.doFinal(payload.getBytes());
          return new String(Hex.encodeHex(hash));
        } catch (Exception e) {
          throw new RazorpayException(e.getMessage());
        }
    }
    
    private static boolean isEqual(byte[] a, byte[] b) {
        if (a.length != b.length) {
          return false;
        }
        int result = 0;
        for (int i = 0; i < a.length; i++) {
          result |= a[i] ^ b[i];
        }
        return result == 0;
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testAPI() {
    	
     	logger.info("Test API is called from purchase controller !!");
     	
     	return ResponseEntity
                .status(HttpStatus.OK)
                .body("Test API is called from auth controller !!");
     	
    }
    
    
}
