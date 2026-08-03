package com.studystack.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.studystack.dto.ContactMessageRequest;
import com.studystack.service.ContactService;
import com.studystack.service.NoteService;
import com.studystack.service.UserService;

@RestController
@RequestMapping("/public")
public class PublicAPIController {
	
	private static final Logger logger = LoggerFactory.getLogger(PublicAPIController.class);

	private final UserService userService;
    private final NoteService noteService;
    private final ContactService contactService;
	
	public PublicAPIController(UserService userService, NoteService noteService, ContactService contactService) {
		this.userService = userService;
		this.noteService = noteService;
		this.contactService = contactService;
	}

	@PostMapping("/contact")
	public ResponseEntity<String> submitContactForm(@Valid @RequestBody ContactMessageRequest request) {

		logger.info("Contact form submitted by {}", request.getEmail());

		contactService.sendContactMessage(request);

		return ResponseEntity
				.status(HttpStatus.OK)
				.body("Thanks! Your message has been sent.");
	}
	
	@GetMapping("/users/count")
	public ResponseEntity<Long> getUsersCount() {
		logger.info("Count users API is called from note controller !!");
		
		Long count = userService.getUsersCount();
		return ResponseEntity.ok(count);
	}
	
	@GetMapping("/notes/count")
    public ResponseEntity<Long> getNotesCount() {
    	
     	logger.info("Count notes API is called from note controller !!");
     	
     	Long count = noteService.getNotesCount();
     	return ResponseEntity
                .status(HttpStatus.OK)
                .body(count);
     	
    }
}
