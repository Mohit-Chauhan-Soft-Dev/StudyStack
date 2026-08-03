package com.studystack.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studystack.model.User;
import com.studystack.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(PublicAPIController.class);

	private final UserService userService;
	
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	@GetMapping("")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
    	
     	logger.info("Count notes API is called from note controller !!");
     	
     	User user = userService.getUserByEmail(email);
     	return ResponseEntity
                .status(HttpStatus.OK)
                .body(user);
     	
    }
}
