package com.sohambose.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sohambose.models.User;
import com.sohambose.repositories.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    // Register
    public User registerUser(User user){
        return userRepo.save(user);
    }

    // Login
    public User loginUser(String email, String password){

        Optional<User> user = userRepo.findByEmailAndPassword(email,password);

        return user.orElse(null);
    }

    // Get all users
    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    // Get user by ID
    public User getUserById(Integer id){
        return userRepo.findById(id).orElse(null);
    }

    // Update user
    public User updateUser(Integer id, User updatedUser){

        User user = userRepo.findById(id).orElse(null);

        if(user!=null){
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setContact_number(updatedUser.getContact_number());

            return userRepo.save(user);
        }

        return null;
    }

    // Delete user
    public void deleteUser(Integer id){
        userRepo.deleteById(id);
    }
}