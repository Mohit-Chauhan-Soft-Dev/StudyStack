package com.studystack.dto.mapper;

import com.studystack.dto.NoteResponse;
import com.studystack.model.Note;

public class NoteMapper {
	
	public static NoteResponse noteToNoteResponse(Note note) {
		return new NoteResponse(
				note.getId(),
				note.getTitle(),
				note.getDescription(),
				note.getPrice()
		);
	}
	
}
