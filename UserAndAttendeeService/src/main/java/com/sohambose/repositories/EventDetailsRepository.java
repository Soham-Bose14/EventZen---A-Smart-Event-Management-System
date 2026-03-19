package com.sohambose.repositories;

import com.sohambose.models.EventDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventDetailsRepository extends JpaRepository<EventDetails, Integer> {

    // 1. Direct filter on EventDetails table
    // Spring generates: SELECT * FROM event_details WHERE EventType = ?
    List<EventDetails> findByEventType(String eventType);

    // 2. Filter via the Joined VenueDetails table
    // We use a JPQL query to reach into the venueDetails object
    @Query("SELECT e FROM EventDetails e JOIN e.venueDetails v WHERE v.city = :city")
    List<EventDetails> findByCity(@Param("city") String city);
}