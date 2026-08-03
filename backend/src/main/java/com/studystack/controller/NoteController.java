package com.studystack.controller;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.studystack.dto.NoteResponse;
import com.studystack.dto.mapper.NoteMapper;
import com.studystack.model.Note;
import com.studystack.model.User;
import com.studystack.service.AuthService;
import com.studystack.service.NoteService;
import com.studystack.service.OrderService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notes")
public class NoteController {

	private static final Logger logger = LoggerFactory.getLogger(NoteController.class);

    private final NoteService noteService;
    private final AuthService authService;
    private final OrderService orderService;

    public NoteController(NoteService noteService,
                          AuthService authService,
                          OrderService orderService) {

        this.noteService = noteService;
        this.authService = authService;
        this.orderService = orderService;
    }
    
    @Value("${file.upload-dir}")
    private String uploadDir;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<Note> uploadNote(@RequestParam MultipartFile file,
                                           @RequestParam String title,
                                           @RequestParam String description,
                                           @RequestParam Double price) {
        try {

            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String filePath = uploadDir + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            Note note = new Note();
            note.setTitle(title);
            note.setDescription(description);
            note.setPrice(price);
            note.setFilePath(filePath);

            // set uploader as current authenticated user when available
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                User uploader = authService.findByEmail(authentication.getName());
                note.setUser(uploader);
            }

            Note savedNote = noteService.save(note);
            logger.info("Note uploaded successfully: {}", savedNote.getId());
            return ResponseEntity.ok(savedNote);
        } catch (Exception e) {
            logger.error("Error uploading note", e);
            return ResponseEntity.status(500).build();
        }
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'BUYER')")
    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAllNotes() {
        	logger.info("Fetching all notes");
    	    List<Note> notes = noteService.findAll();
    	
     	List<NoteResponse> response =
                notes.stream()
                        .map(NoteMapper::noteToNoteResponse)
                        .collect(Collectors.toList());
     	
    	    if(response.isEmpty()) {
    		       logger.warn("No notes found");
			   return ResponseEntity.noContent().build();
    	    } else {
    		       logger.info("Found {} notes", response.size());
               return ResponseEntity.ok(response);
    	    }
     	
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getNoteById(@PathVariable Long id) {
    	    logger.info("Fetching note with id: {}", id);
    	    
    	    Note note = noteService.findById(id).get();
    	    
    	    NoteResponse response = NoteMapper.noteToNoteResponse(note);
    	    
    	    return ResponseEntity.ok(response);

    }
    
    @GetMapping("/view/{noteId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Resource> viewNote(
            @PathVariable Long noteId) throws Exception {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = authService.findByEmail(authentication.getName());

        boolean purchased =
                orderService.isPurchased(user.getId(), noteId);

        if (!purchased) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Note note = noteService.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        Path path = Paths.get(note.getFilePath());

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" + note.getTitle() + ".pdf\""
                )
                .body(resource);
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testAPI() {
    	
     	logger.info("Test API is called from note controller !!");
     	
     	return ResponseEntity
                .status(HttpStatus.OK)
                .body("Test API is called from note controller !!");
     	
    }

    
}



