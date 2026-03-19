package com.sohambose.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "registration")
@Data
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private EventDetails event;

    @Column(name = "registration_date") 
    private LocalDateTime registrationDate;

    // --- NEW FIELD ---
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1; // Default value for new objects

    public Registration() {
        this.registrationDate = LocalDateTime.now();
        this.quantity = 1; // Ensures new instances default to 1
    }

    /**
     * JPA Lifecycle Hook: 
     * Handles existing null values in the DB or nulls passed during save.
     */
    @PrePersist
    @PreUpdate
    public void validateQuantity() {
        if (this.quantity == null || this.quantity < 1) {
            this.quantity = 1;
        }
    }
}