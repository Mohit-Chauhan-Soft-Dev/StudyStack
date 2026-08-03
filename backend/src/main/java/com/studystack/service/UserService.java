package com.studystack.service;

import com.studystack.model.User;

public interface UserService {
	User getUserByEmail(String email);
	long getUsersCount();
}
