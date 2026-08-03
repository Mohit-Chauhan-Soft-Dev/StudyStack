package com.studystack.service;

import com.studystack.dto.ContactMessageRequest;

public interface ContactService {

    void sendContactMessage(ContactMessageRequest request);
}
