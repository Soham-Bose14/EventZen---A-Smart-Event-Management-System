package com.sohambose.controllers;

import com.sohambose.models.*;
import com.sohambose.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventDetailsRepository eventRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RegistrationRepo registrationRepo;

    /**
     * Fetch all events including their nested VenueDetails.
     * JPA will handle the JOIN based on the @OneToOne mapping.
     */
    @GetMapping
    public List<EventDetails> getAllEvents() {
        return eventRepo.findByStatus("Approved");
    }

    /**
     * Requirement: getEventsByCity
     * Uses the JPQL join query in the repository to filter by the associated Venue city.
     * URL: GET http://localhost:8080/events/city?name=Ghaziabad
     */
    @GetMapping("/city")
    public ResponseEntity<List<EventDetails>> getEventsByCity(@RequestParam("name") String city) {
        List<EventDetails> events = eventRepo.findApprovedByCity(city);
        return ResponseEntity.ok(events);
    }

    /**
     * Requirement: getEventsByEventType
     * Filters directly on the event_details table.
     * URL: GET http://localhost:8080/events/type?type=Music
     */
    @GetMapping("/type")
    public ResponseEntity<List<EventDetails>> getEventsByEventType(@RequestParam("type") String type) {
        List<EventDetails> events = eventRepo.findByEventTypeAndStatus(type, "Approved");
        return ResponseEntity.ok(events);
    }

    /**
     * Register a user for an event.
     * Saves a record in the registrations table linking User ID and Event ID.
     */
    @PostMapping("/{eventId}/register")
    public ResponseEntity<String> registerForEvent(
            @PathVariable Integer eventId, 
            @RequestParam Integer userId,
            @RequestParam(defaultValue = "1") Integer quantity) {

        User user = userRepo.findById(userId).orElse(null);
        EventDetails event = eventRepo.findById(eventId).orElse(null);

        // 1. Basic Existence Check
        if (user == null || event == null) {
            return ResponseEntity.badRequest().body("User or Event not found");
        }

        // 2. NEW CONSTRAINT: Maximum 10 tickets per transaction
        if (quantity > 10) {
            return ResponseEntity.badRequest().body("Maximum booking limit exceeded. You can only book up to 10 tickets at a time.");
        }

        // 3. NEW CONSTRAINT: Prevent zero or negative quantities if passed from frontend
        if (quantity < 1) {
            return ResponseEntity.badRequest().body("Invalid ticket quantity. Please book at least 1 ticket.");
        }

        // 4. Ticket Availability Check
        if (event.getAvailableTickets() < quantity) {
            return ResponseEntity.badRequest().body("Not enough tickets available. Remaining: " + event.getAvailableTickets());
        }

        try {
            // 5. Create and Save Registration
            Registration reg = new Registration();
            reg.setUser(user);
            reg.setEvent(event);
            reg.setQuantity(quantity); 
            registrationRepo.save(reg);

            // 6. Update Event Ticket Count
            int updatedTickets = event.getAvailableTickets() - quantity;
            event.setAvailableTickets(updatedTickets);
            
            // Save the updated event details back to MySQL
            eventRepo.save(event);

            return ResponseEntity.ok("Successfully registered " + quantity + " ticket(s) for " + event.getTitle());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Registration failed: " + ex.getMessage());
        }
    }

    /**
     * Get events applied for by a specific user.
     * Fetches registration records and maps them back to EventDetails objects.
     */
    @GetMapping("/applied/{userId}")
    public ResponseEntity<List<Registration>> getAppliedEvents(@PathVariable Integer userId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        // Fetch the full registration objects from the database
        List<Registration> registrations = registrationRepo.findByUser(user);
        
        // Return them directly so React gets { id, event, quantity, user }
        return ResponseEntity.ok(registrations);
    }

    /**
     * Cancel a registration for an event.
     * Deletes the registration record and adds the tickets back to Event availability.
     * URL: DELETE http://localhost:8080/events/registration/{regId}
     */
    @DeleteMapping("/registration/{regId}")
    public ResponseEntity<String> cancelRegistration(@PathVariable Integer regId) {
        // 1. Find the registration
        Registration registration = registrationRepo.findById(regId).orElse(null);

        if (registration == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            // 2. Get the associated event and the quantity to be returned
            EventDetails event = registration.getEvent();
            int ticketsToReturn = registration.getQuantity();

            // 3. Delete the registration record
            registrationRepo.delete(registration);

            // 4. Update the Event Ticket Count (Add tickets back)
            if (event != null) {
                int updatedTickets = event.getAvailableTickets() + ticketsToReturn;
                event.setAvailableTickets(updatedTickets);
                
                // Save the updated event details back to MySQL
                eventRepo.save(event);
            }

            return ResponseEntity.ok("Registration cancelled successfully. " + ticketsToReturn + " tickets returned to inventory.");
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Cancellation failed: " + ex.getMessage());
        }
    }
}