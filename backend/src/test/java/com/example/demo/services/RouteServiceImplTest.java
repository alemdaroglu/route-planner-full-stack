package com.example.demo.services;

import com.example.demo.dtos.LocationCreateDTO;
import com.example.demo.dtos.RouteDTO;
import com.example.demo.dtos.TransportationCreateDTO;
import com.example.demo.enums.TransportationType;
import com.example.demo.models.Location;
import com.example.demo.models.Transportation;
import com.example.demo.repositories.LocationRepository;
import com.example.demo.repositories.TransportationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@ExtendWith(SpringExtension.class)
@DataJpaTest
@Import(RouteServiceImpl.class) // Import the service for testing
public class RouteServiceImplTest {

    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:latest")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private TransportationRepository transportationRepository;

    @Autowired
    private RouteServiceImpl routeService;

    private static Map<String, Long> locationIdMap;

    @BeforeEach
    void setUp() {
        // Set up sample data in the test database
        List<LocationCreateDTO> locationCreateDTOs = List.of(
                new LocationCreateDTO("Taksim", "TR", "Istanbul", "TAKSIM"),
                new LocationCreateDTO("Atakule", "TR", "Ankara", "ATAKULE"),
                new LocationCreateDTO("Samsun Meydan", "TR", "Samsun", "MEYDAN"),
                new LocationCreateDTO("Antalya", "TR", "Antalya", "ANTALYA"),
                new LocationCreateDTO("Kemer", "TR", "Antalya", "KEMER"),

                new LocationCreateDTO("Bodrum", "TR", "Mugla", "BODRUM"),
                new LocationCreateDTO("Datca", "TR", "Mugla", "DATCA"),
                new LocationCreateDTO("Mugla", "TR", "Mugla", "MUGLA"),
                new LocationCreateDTO("Izmir", "TR", "Izmir", "IZMIR"),
                new LocationCreateDTO("Istanbul", "TR", "Istanbul", "ISTANBUL"),

                new LocationCreateDTO("Besiktas", "TR", "Istanbul", "BESIKTAS"),
                new LocationCreateDTO("Cadde", "TR", "Istanbul", "CADDE"),
                new LocationCreateDTO("Istanbul Airport", "TR", "Istanbul", "IST"),
                new LocationCreateDTO("Sabiha Gokcen Airport", "TR", "Istanbul", "SAW"),
                new LocationCreateDTO("Esenboga Airport", "TR", "Ankara", "ESB"),

                new LocationCreateDTO("Etimesgut Airport", "TR", "Ankara", "ANK"),
                new LocationCreateDTO("Dalaman Airport", "TR", "Mugla", "DLM"),
                new LocationCreateDTO("Antalya Airport", "TR", "Antalya", "AYT"),
                new LocationCreateDTO("Adnan Menderes Airport", "TR", "Izmir", "ADB"),
                new LocationCreateDTO("Carsamba Airport", "TR", "Samsun", "SZF")
        );
        List<Location> locations = locationCreateDTOs.stream()
                .map(dto -> new Location(dto.getName(), dto.getCountry(), dto.getCity(), dto.getLocationCode()))
                .collect(Collectors.toList());
        List<Location> savedLocations = locationRepository.saveAll(locations);

        // Map Location Codes to IDs
        locationIdMap = savedLocations.stream()
                .collect(Collectors.toMap(Location::getLocationCode, Location::getId));

        List<TransportationCreateDTO> transportationCreateDTOs = List.of(
                new TransportationCreateDTO(locationIdMap.get("IST"), locationIdMap.get("SZF"),
                        TransportationType.FLIGHT, Set.of(1,2,3,4,5,6,7)),
                new TransportationCreateDTO(locationIdMap.get("IST"), locationIdMap.get("ESB"),
                        TransportationType.FLIGHT, Set.of(1,2,3,4,5,6,7)),
                new TransportationCreateDTO(locationIdMap.get("ESB"), locationIdMap.get("IST"),
                        TransportationType.FLIGHT, Set.of(7)),
                new TransportationCreateDTO(locationIdMap.get("BESIKTAS"), locationIdMap.get("IST"),
                        TransportationType.BUS, Set.of(1,2,3,4,5,6,7)),
                new TransportationCreateDTO(locationIdMap.get("BESIKTAS"), locationIdMap.get("IST"),
                        TransportationType.UBER, Set.of(1,2,3,4,5,6,7))
        );
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
        transportationRepository.saveAll(transportations);
    }

    @Test
    void testFindMatchingRoutes_DirectRoute() {
        // Arrange
        String originLocationCode = "IST";
        String destinationLocationCode = "SZF";
        LocalDate travelDate = LocalDate.of(2025, 2, 3); // Example: Monday

        // Act
        List<RouteDTO> routes = routeService.findMatchingRoutes(originLocationCode, destinationLocationCode, travelDate);

        // Assert
        assertThat(routes).isNotEmpty();
        assertThat(routes.getFirst().getStops()).hasSize(2); // Direct route
    }

    @Test
    void testFindMatchingRoutes_NoRoute() {
        // Arrange
        String originLocationCode = "ESB";
        String destinationLocationCode = "IST";
        LocalDate travelDate = LocalDate.of(2025, 2, 3); // Example: Monday

        // Act
        List<RouteDTO> routes = routeService.findMatchingRoutes(originLocationCode, destinationLocationCode, travelDate);

        // Assert
        assertThat(routes).isEmpty();
    }

    @Test
    void testFindMatchingRoutes_RouteWithBeforeTransfer() {
        // Arrange
        String originLocationCode = "BESIKTAS";
        String destinationLocationCode = "ESB";
        LocalDate travelDate = LocalDate.of(2025, 2, 3); // Example: Monday

        // Act
        List<RouteDTO> routes = routeService.findMatchingRoutes(originLocationCode, destinationLocationCode, travelDate);

        // Assert
        assertThat(routes).hasSize(2);
    }
}
