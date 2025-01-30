package com.example.demo.mappers;

import com.example.demo.dtos.TransportationCreateDTO;
import com.example.demo.dtos.TransportationDTO;
import com.example.demo.models.Location;
import com.example.demo.models.Transportation;
import com.example.demo.repositories.LocationRepository;

public class TransportationMapper {

    // Convert Transportation entity to TransportationDTO
    public static TransportationDTO toDto(Transportation transportation) {
        if (transportation == null) {
            return null;
        }
        return new TransportationDTO(
                transportation.getId(),
                LocationMapper.toDto(transportation.getOriginLocation()),
                LocationMapper.toDto(transportation.getDestinationLocation()),
                transportation.getTransportationType(),
                transportation.getOperatingDays(),
                transportation.getCreatedAt(),
                transportation.getUpdatedAt()
        );
    }

    // Convert TransportationDTO to Transportation entity
    public static Transportation toEntity(TransportationDTO transportationDTO) {
        if (transportationDTO == null) {
            return null;
        }
        return new Transportation(
                LocationMapper.toEntityWithId(transportationDTO.getOriginLocation()),
                LocationMapper.toEntityWithId(transportationDTO.getDestinationLocation()),
                transportationDTO.getTransportationType(),
                transportationDTO.getOperatingDays()
        );
    }

    // Convert TransportationDTO to Transportation entity (for update, with ID)
    public static Transportation toEntityWithId(TransportationDTO transportationDTO) {
        if (transportationDTO == null) {
            return null;
        }
        Transportation transportation = toEntity(transportationDTO);
        transportation.setId(transportationDTO.getId()); // Set ID explicitly for updates
        return transportation;
    }

    public static Transportation toEntity(TransportationCreateDTO transportationCreateDTO, LocationRepository locationRepository) {
        if (transportationCreateDTO == null) {
            return null;
        }

        // Create the Transportation entity
        Transportation transportation = new Transportation();

        // Set the origin and destination locations
        if (transportationCreateDTO.getOriginLocationId() != null) {
            Location originLocation = locationRepository.findById(transportationCreateDTO.getOriginLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Origin location not found for ID: " + transportationCreateDTO.getOriginLocationId()));
            transportation.setOriginLocation(originLocation);
        }

        if (transportationCreateDTO.getDestinationLocationId() != null) {
            Location destinationLocation = locationRepository.findById(transportationCreateDTO.getDestinationLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Destination location not found for ID: " + transportationCreateDTO.getDestinationLocationId()));
            transportation.setDestinationLocation(destinationLocation);
        }

        // Set the transportation type
        if (transportationCreateDTO.getTransportationType() != null) {
            transportation.setTransportationType(transportationCreateDTO.getTransportationType());
        }

        // Set the operating days
        if (transportationCreateDTO.getOperatingDays() != null) {
            transportation.setOperatingDays(transportationCreateDTO.getOperatingDays());
        }

        return transportation;
    }
}
