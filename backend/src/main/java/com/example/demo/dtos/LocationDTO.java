package com.example.demo.dtos;

import com.example.demo.models.Location;
import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;
import java.time.LocalDateTime;

public class LocationDTO implements Serializable {
    private Long id;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Country is required")
    private String country;
    @NotBlank(message = "City is required")
    private String city;
    @NotBlank(message = "Location Code is required")
    private String locationCode;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LocationDTO() {
    }

    public LocationDTO(Long id, String name, String country, String city, String locationCode, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.city = city;
        this.locationCode = locationCode;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public void setLocationCode(String locationCode) {
        this.locationCode = locationCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
