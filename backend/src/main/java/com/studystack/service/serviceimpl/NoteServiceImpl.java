package com.studystack.service.serviceimpl;

import com.studystack.model.Note;
import com.studystack.repository.NoteRepository;
import com.studystack.service.NoteService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteServiceImpl implements NoteService {
	
    private final NoteRepository noteRepository;
    
    public NoteServiceImpl(NoteRepository noteRepository) {
	    this.noteRepository = noteRepository;
    }

    @Override
    public Note save(Note note) {
        return noteRepository.save(note);
    }
    
    

    @Override
    public List<Note> findAll() {
        return noteRepository.findAll();
    }

    @Override
    public Optional<Note> findById(Long id) {
        return noteRepository.findById(id);
    }

	@Override
	public long getNotesCount() {
		return noteRepository.count();
	}

}

