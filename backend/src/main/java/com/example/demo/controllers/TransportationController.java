package com.example.demo.controllers;

import com.example.demo.dtos.TransportationCreateDTO;
import com.example.demo.dtos.TransportationDTO;
import com.example.demo.mappers.TransportationMapper;
import com.example.demo.models.Location;
import com.example.demo.models.Transportation;
import com.example.demo.repositories.LocationRepository;
import com.example.demo.repositories.TransportationRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.demo.utils.PaginationUtils.getPageable;

@RestController
@RequestMapping("/api/transportations")
@PreAuthorize("hasRole('ADMIN')")
public class TransportationController {

    private final TransportationRepository transportationRepository;
    private final LocationRepository locationRepository;

    public TransportationController(TransportationRepository transportationRepository,
                                    LocationRepository locationRepository) {
        this.transportationRepository = transportationRepository;
        this.locationRepository = locationRepository;
    }

    // Get all transportations
    @GetMapping
    public ResponseEntity<Page<TransportationDTO>> getAllTransportations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "true") boolean ascending
    ) {
        Pageable pageable = getPageable(page, size, sortBy, ascending);
        Page<Transportation> transportations = transportationRepository.findAll(pageable);
        return ResponseEntity.ok(transportations.map(TransportationMapper::toDto));
    }

    // Get a single transportation by ID
    @GetMapping("/{id}")
    public ResponseEntity<TransportationDTO> getTransportationById(@PathVariable Long id) {
        return transportationRepository.findById(id)
                .map(TransportationMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new transportation
    @PostMapping
    public ResponseEntity<TransportationDTO> createTransportation(@Valid @RequestBody TransportationCreateDTO transportationCreateDTO) {
        Location originLocation = locationRepository.findById(transportationCreateDTO.getOriginLocationId())
                .orElseThrow(() -> new IllegalArgumentException("Origin location not found for ID: " + transportationCreateDTO.getOriginLocationId()));
        Location destinationLocation = locationRepository.findById(transportationCreateDTO.getDestinationLocationId())
                .orElseThrow(() -> new IllegalArgumentException("Destination location not found for ID: " + transportationCreateDTO.getDestinationLocationId()));

        Transportation transportation = TransportationMapper.toEntity(
                transportationCreateDTO,
                locationRepository);
        Transportation savedTransportation = transportationRepository.save(transportation);
        return ResponseEntity.status(201).body(TransportationMapper.toDto(savedTransportation));
    }

    // Update an existing transportation
    @PatchMapping("/{id}")
    public ResponseEntity<TransportationDTO> updateTransportation(
            @PathVariable Long id,
            @RequestBody TransportationCreateDTO updatedTransportation) {
        return transportationRepository.findById(id)
                .map(existingTransportation -> {
                    if (updatedTransportation.getOriginLocationId() != null) {
                        Location originLocation = locationRepository.findById(updatedTransportation.getOriginLocationId())
                                .orElseThrow(() -> new IllegalArgumentException("Origin location not found for ID: " + updatedTransportation.getOriginLocationId()));
                        existingTransportation.setOriginLocation(originLocation);
                    }
                    if (updatedTransportation.getDestinationLocationId() != null) {
                        Location destinationLocation = locationRepository.findById(updatedTransportation.getDestinationLocationId())
                                .orElseThrow(() -> new IllegalArgumentException("Destination location not found for ID: " + updatedTransportation.getDestinationLocationId()));
                        existingTransportation.setDestinationLocation(destinationLocation);
                    }
                    if (updatedTransportation.getTransportationType() != null) {
                        existingTransportation.setTransportationType(updatedTransportation.getTransportationType());
                    }
                    if (updatedTransportation.getOperatingDays() != null) {
                        existingTransportation.setOperatingDays(updatedTransportation.getOperatingDays());
                    }
                    Transportation savedTransportation = transportationRepository.save(existingTransportation);
                    return ResponseEntity.ok(TransportationMapper.toDto(savedTransportation));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a transportation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransportation(@PathVariable Long id) {
        if (transportationRepository.existsById(id)) {
            transportationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<TransportationDTO>> createTransportations(
            @Valid @RequestBody List<TransportationCreateDTO> transportationCreateDTOs) {
        List<Transportation> transportations = transportationCreateDTOs.stream().map(dto -> {
            Location originLocation = locationRepository.findById(dto.getOriginLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Origin location not found for ID: " + dto.getOriginLocationId()));
            Location destinationLocation = locationRepository.findById(dto.getDestinationLocationId())
                    .orElseThrow(() -> new IllegalArgumentException("Destination location not found for ID: " + dto.getDestinationLocationId()));

            return new Transportation(
                    originLocation,
                    destinationLocation,
                    dto.getTransportationType(),
                    dto.getOperatingDays()
            );
        }).collect(Collectors.toList());

        List<Transportation> savedTransportations = transportationRepository.saveAll(transportations);
        List<TransportationDTO> response = savedTransportations.stream()
                .map(TransportationMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.status(201).body(response);
    }

}
