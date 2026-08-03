package com.studystack.service.serviceimpl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.studystack.model.User;
import com.studystack.repository.UserRepository;

import com.studystack.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;

	UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Override
	public User getUserByEmail(String email) {
		Optional<User> user = userRepository.findByEmail(email);
		
		if(user.isPresent()) {
			return user.get();
		}
		
		return null;
	}

	@Override
	public long getUsersCount() {
		
		return userRepository.count();
		
	}
	
	
}
