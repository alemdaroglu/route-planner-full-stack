package com.example.demo.dtos;

import com.example.demo.enums.TransportationType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.DayOfWeek;
import java.util.Set;

public class TransportationCreateDTO {
    @NotNull(message = "Origin Location ID is required")
    private Long originLocationId;
    @NotNull(message = "Destination Location ID is required")
    private Long destinationLocationId;
    @NotNull
    private TransportationType transportationType;
    private Set<Integer> operatingDays;

    public TransportationCreateDTO() {}

    public TransportationCreateDTO(Long originLocationId, Long destinationLocationId, TransportationType transportationType, Set<Integer> operatingDays) {
        this.originLocationId = originLocationId;
        this.destinationLocationId = destinationLocationId;
        this.transportationType = transportationType;
        this.operatingDays = operatingDays;
    }

    public Long getOriginLocationId() {
        return originLocationId;
    }

    public void setOriginLocationId(Long originLocationId) {
        this.originLocationId = originLocationId;
    }

    public Long getDestinationLocationId() {
        return destinationLocationId;
    }

    public void setDestinationLocationId(Long destinationLocationId) {
        this.destinationLocationId = destinationLocationId;
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
}
