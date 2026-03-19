package com.sohambose.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "venuedetails")
public class VenueDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "City", columnDefinition = "LONGTEXT")
    private String city;

    @Column(name = "Venue", columnDefinition = "LONGTEXT")
    private String venue;

    @Column(name = "Address", columnDefinition = "LONGTEXT")
    private String address;

    @OneToOne
    @JoinColumn(name = "EventId") 
    @JsonBackReference 
    private EventDetails event;

    // Standard Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public EventDetails getEvent() { return event; }
    public void setEvent(EventDetails event) { this.event = event; }
}