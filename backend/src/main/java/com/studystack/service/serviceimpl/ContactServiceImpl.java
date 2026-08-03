package com.studystack.service.serviceimpl;

import com.studystack.dto.ContactMessageRequest;
import com.studystack.service.ContactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactServiceImpl implements ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${mail.from:no-reply@studystack.com}")
    private String mailFrom;

    // Inbox that receives contact-form submissions. Defaults to mail.from
    // if a dedicated support address isn't configured.
    @Value("${contact.receiver-email:${mail.from:no-reply@studystack.com}}")
    private String receiverEmail;

    public ContactServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendContactMessage(ContactMessageRequest request) {

        String safeName = stripLineBreaks(request.getName());
        String safeSubject = stripLineBreaks(request.getSubject());
        String safeSenderEmail = stripLineBreaks(request.getEmail());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(receiverEmail);
        message.setReplyTo(safeSenderEmail);
        message.setSubject("[StudyStack Contact] " + safeSubject);
        message.setText(
                "New contact form submission\n\n" +
                        "Name: " + safeName + "\n" +
                        "Email: " + safeSenderEmail + "\n" +
                        "Subject: " + safeSubject + "\n\n" +
                        "Message:\n" + request.getMessage());

        try {
            mailSender.send(message);
            logger.info("Contact message sent from {}", safeSenderEmail);
        } catch (MailException e) {
            logger.error("Failed to send contact message from {}: {}", safeSenderEmail, e.getMessage());
            // Surface a failure to the caller so the frontend can show an
            // error toast instead of falsely reporting success.
            throw e;
        }
    }

    private String stripLineBreaks(String value) {
        return value == null ? "" : value.replaceAll("[\\r\\n]", " ").trim();
    }
}
