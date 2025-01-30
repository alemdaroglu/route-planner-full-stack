package com.example.demo.dtos;

import com.example.demo.enums.TransportationType;
import com.example.demo.models.Transportation;
import jakarta.validation.constraints.Size;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Set;

public class TransportationDTO {
    private Long id; // Optional for responses
    private LocationDTO originLocation; // Full Location for responses
    private LocationDTO destinationLocation; // Full Location for responses
    private TransportationType transportationType;
    private Set<Integer> operatingDays; // Embedded operating days

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TransportationDTO() {
    }

    public TransportationDTO(Long id, LocationDTO originLocation, LocationDTO destinationLocation,
                             TransportationType transportationType, Set<Integer> operatingDays,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.transportationType = transportationType;
        this.operatingDays = operatingDays;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocationDTO getOriginLocation() {
        return originLocation;
    }

    public void setOriginLocation(LocationDTO originLocation) {
        this.originLocation = originLocation;
    }

    public LocationDTO getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(LocationDTO destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public TransportationType getTransportationType() {
        return transportationType;
    }

    public void setTransportationType(TransportationType transportationType) {
        this.transportationType = transportationType;
    }

    public Set<Integer> getOperatingDays() {
        return operatingDays;
    }

    public void setOperatingDays(Set<Integer> operatingDays) {
        this.operatingDays = operatingDays;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
