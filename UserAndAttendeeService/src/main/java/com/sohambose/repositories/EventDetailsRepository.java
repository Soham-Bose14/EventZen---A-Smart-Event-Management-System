package com.sohambose.repositories;

import com.sohambose.models.EventDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventDetailsRepository extends JpaRepository<EventDetails, Integer> {

    List<EventDetails> findByStatus(String status);

    // Approved events by city
    @Query("SELECT e FROM EventDetails e JOIN e.venueDetails v WHERE v.city = :city AND e.status = 'Approved'")
    List<EventDetails> findApprovedByCity(@Param("city") String city);

    // Approved events by type
    List<EventDetails> findByEventTypeAndStatus(String eventType, String status);
}