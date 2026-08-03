package com.studystack.service;

import com.studystack.model.Note;

import java.util.List;
import java.util.Optional;

public interface NoteService {
    Note save(Note note);
    List<Note> findAll();
    Optional<Note> findById(Long id);
    long getNotesCount();
}
