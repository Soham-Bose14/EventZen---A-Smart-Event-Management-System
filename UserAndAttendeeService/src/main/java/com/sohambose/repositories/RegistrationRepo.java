package com.sohambose.repositories;

import com.sohambose.models.Registration;
import com.sohambose.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistrationRepo extends JpaRepository<Registration, Integer> {
    // Custom query to find all registrations for a specific user
    List<Registration> findByUser(User user);
}