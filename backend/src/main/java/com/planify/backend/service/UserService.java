package com.planify.backend.service;

import com.planify.backend.model.User;
import com.planify.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class UserService {
    UserRepository userRepository;

    public void saveUser(User user){
        userRepository.save(user);
    }

    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    public void removeUserById(Integer userId){
        userRepository.deleteById(userId);
    }
}
