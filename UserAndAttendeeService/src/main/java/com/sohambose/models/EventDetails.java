package com.sohambose.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_details")
public class EventDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Title", length = 200)
    private String title;

    @Column(name = "Description", columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "EventType", columnDefinition = "LONGTEXT")
    private String eventType;

    @Column(name = "DateTime")
    private LocalDateTime dateTime;

    @Column(name = "Price")
    private BigDecimal price;

    @Column(name = "ImagePath", columnDefinition = "LONGTEXT")
    private String imagePath;

    @Column(name = "AvailableTickets")
    private Integer availableTickets;

    @Column(name = "OrganizerId")
    private Integer organizerId;

    @OneToOne(mappedBy = "event", cascade = CascadeType.ALL)
    private VenueDetails venueDetails;

    // Standard Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public Integer getAvailableTickets() { return availableTickets; }
    public void setAvailableTickets(Integer availableTickets) { this.availableTickets = availableTickets; }

    public Integer getOrganizerId() { return organizerId; }
    public void setOrganizerId(Integer organizerId) { this.organizerId = organizerId; }

    public VenueDetails getVenueDetails() { return venueDetails; }
    public void setVenueDetails(VenueDetails venueDetails) { this.venueDetails = venueDetails; }
}