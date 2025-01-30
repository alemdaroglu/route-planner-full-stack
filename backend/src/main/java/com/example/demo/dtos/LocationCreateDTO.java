package com.example.demo.dtos;

import jakarta.validation.constraints.NotBlank;

public class LocationCreateDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Location Code is required")
    private String locationCode;

    public LocationCreateDTO() {
    }

    public LocationCreateDTO(String name, String country, String city, String locationCode) {
        this.name = name;
        this.country = country;
        this.city = city;
        this.locationCode = locationCode;
    }

    // Getters and setters
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
}
