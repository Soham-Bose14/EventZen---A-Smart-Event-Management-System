package com.sohambose.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    
    // Changed to Long (Wrapper) to allow nulls during Admin/Vendor sign up
    private Long contact_number; 
    
    private String email;
    private String password;

    public User() {
    }

    public User(Integer id, String name, Long contact_number, String email, String password) {
        this.id = id;
        this.name = name;
        this.contact_number = contact_number;
        this.email = email;
        this.password = password;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getContact_number() {
        return contact_number;
    }

    public void setContact_number(Long contact_number) {
        this.contact_number = contact_number;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", contact_number=" + contact_number + ", email=" + email
                + ", password=" + password + "]";
    }
}