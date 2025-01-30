package com.example.demo.mappers;

import com.example.demo.dtos.LocationCreateDTO;
import com.example.demo.dtos.LocationDTO;
import com.example.demo.models.Location;

public class LocationMapper {

    // Convert Location entity to LocationDTO
    public static LocationDTO toDto(Location location) {
        if (location == null) {
            return null;
        }
        return new LocationDTO(
                location.getId(),
                location.getName(),
                location.getCountry(),
                location.getCity(),
                location.getLocationCode(),
                location.getCreatedAt(),
                location.getUpdatedAt()
        );
    }


    public static Location toEntity(LocationDTO locationDTO) {
        if (locationDTO == null) {
            return null;
        }
        return new Location(
                locationDTO.getName(),
                locationDTO.getCountry(),
                locationDTO.getCity(),
                locationDTO.getLocationCode()
        );
    }

    // Convert LocationDTO to Location entity (for creation, without ID)
    public static Location toEntity(LocationCreateDTO locationCreateDTO) {
        Location location = new Location();
        location.setName(locationCreateDTO.getName());
        location.setCountry(locationCreateDTO.getCountry());
        location.setCity(locationCreateDTO.getCity());
        location.setLocationCode(locationCreateDTO.getLocationCode());
        return location;
    }

    // Convert LocationDTO to Location entity (for update, with ID)
    public static Location toEntityWithId(LocationDTO locationDTO) {
        if (locationDTO == null) {
            return null;
        }
        Location location = toEntity(locationDTO);
        location.setId(locationDTO.getId()); // Set ID explicitly for updates
        return location;
    }
}
