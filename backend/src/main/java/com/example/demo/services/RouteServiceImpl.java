package com.example.demo.services;

import com.example.demo.dtos.RouteDTO;
import com.example.demo.dtos.StopDTO;
import com.example.demo.mappers.LocationMapper;
import com.example.demo.models.Location;
import com.example.demo.models.Transportation;
import com.example.demo.repositories.LocationRepository;
import com.example.demo.repositories.TransportationRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RouteServiceImpl implements RouteService {

    private final LocationRepository locationRepository;
    private final TransportationRepository transportationRepository;

    public RouteServiceImpl(LocationRepository locationRepository, TransportationRepository transportationRepository) {
        this.locationRepository = locationRepository;
        this.transportationRepository = transportationRepository;
    }

    @Override
    @Cacheable(value = "routes", key = "#originLocationCode + '_' + #destinationLocationCode + '_' + #travelDate.toString()")
    public List<RouteDTO> findMatchingRoutes(
            String originLocationCode, String destinationLocationCode, LocalDate travelDate) {
        Location originLocation = locationRepository.findByLocationCode(originLocationCode)
                .orElseThrow(() -> new IllegalArgumentException("Location with code " + originLocationCode + " not found"));
        Location destinationLocation = locationRepository.findByLocationCode(destinationLocationCode)
                .orElseThrow(() -> new IllegalArgumentException("Location with code " + destinationLocationCode + " " +
                        "not found"));

        int dayOfWeek = travelDate.getDayOfWeek().getValue();

        boolean beforeFlight = false;
        boolean afterFlight = false;
        // determine the minimum number of stops
        if (originLocation.getLocationCode().length() != 3) {
            beforeFlight = true;
        }
        if (destinationLocation.getLocationCode().length() != 3) {
            afterFlight = true;
        }
        // find usable flights
        // çıkış noktasına destination olarak bağlı olan tüm havaalanları
        // varış noktasına origin olarak bağlı olan tüm havaalanları
        // bu ikisinin kombinasyonları flight transportation olarak tanımlı mı bak
        List<Transportation> beforeTransfers =
                transportationRepository.findUsableAirportsByOriginLocationIdAndOperatingDay(
                        originLocation.getId(), dayOfWeek);

        List<Transportation> afterTransfers =
                transportationRepository.findUsableAirportsByDestinationLocationIdAndOperatingDay(
                        destinationLocation.getId(), dayOfWeek);

        Set<Location> beforeAirports = beforeTransfers.stream().map(Transportation::getDestinationLocation).collect(Collectors.toSet());
        Set<Location> afterAirports =
                afterTransfers.stream().map(Transportation::getOriginLocation).collect(Collectors.toSet());

        if (!beforeFlight){
            beforeAirports.add(originLocation);
        }
        if (!afterFlight){
            afterAirports.add(destinationLocation);
        }
        List<Long> originIds = beforeAirports.stream().map(Location::getId).collect(Collectors.toList());
        List<Long> destinationIds = afterAirports.stream().map(Location::getId).collect(Collectors.toList());
        List<Transportation> usableFlights =
                transportationRepository.findUsableFlightsByOperatingDay(
                        originIds, destinationIds, dayOfWeek);

        List<RouteDTO> result = new ArrayList<>();
        // 4 stops
        for (Transportation usableFlight : usableFlights) {
            for (Transportation beforeTransfer : beforeTransfers) {
                for (Transportation afterTransfer : afterTransfers) {
                    if (beforeTransfer.getDestinationLocation().getId().equals(usableFlight.getOriginLocation().getId()) &&
                    afterTransfer.getOriginLocation().getId().equals(usableFlight.getDestinationLocation().getId())) {
                        StopDTO stop1 = new StopDTO();
                        stop1.setLocation(LocationMapper.toDto(beforeTransfer.getOriginLocation()));
                        stop1.setStopNumber(1);
                        stop1.setTransportationTypeToNext(beforeTransfer.getTransportationType());
                        StopDTO stop2 = new StopDTO();
                        stop2.setLocation(LocationMapper.toDto(usableFlight.getOriginLocation()));
                        stop2.setStopNumber(2);
                        stop2.setTransportationTypeToNext(usableFlight.getTransportationType());
                        StopDTO stop3 = new StopDTO();
                        stop3.setLocation(LocationMapper.toDto(afterTransfer.getOriginLocation()));
                        stop3.setStopNumber(3);
                        stop3.setTransportationTypeToNext(afterTransfer.getTransportationType());
                        StopDTO stop4 = new StopDTO();
                        stop4.setLocation(LocationMapper.toDto(afterTransfer.getDestinationLocation()));
                        stop4.setStopNumber(4);
                        result.add(new RouteDTO(Arrays.asList(stop1, stop2, stop3, stop4)));
                    }
                }
            }
        }

        // 3 stops
        if (!beforeFlight) {
            for (Transportation usableFlight : usableFlights) {
                for (Transportation afterTransfer : afterTransfers) {
                    if (usableFlight.getDestinationLocation().getId().equals(afterTransfer.getOriginLocation().getId())){
                        StopDTO stop1 = new StopDTO();
                        stop1.setLocation(LocationMapper.toDto(usableFlight.getOriginLocation()));
                        stop1.setStopNumber(1);
                        stop1.setTransportationTypeToNext(usableFlight.getTransportationType());
                        StopDTO stop2 = new StopDTO();
                        stop2.setLocation(LocationMapper.toDto(afterTransfer.getOriginLocation()));
                        stop2.setStopNumber(2);
                        stop2.setTransportationTypeToNext(afterTransfer.getTransportationType());
                        StopDTO stop3 = new StopDTO();
                        stop3.setLocation(LocationMapper.toDto(afterTransfer.getDestinationLocation()));
                        stop3.setStopNumber(3);
                        result.add(new RouteDTO(Arrays.asList(stop1, stop2, stop3)));
                    }
                }
            }
        }
        if (!afterFlight) {
            for (Transportation usableFlight : usableFlights) {
                for (Transportation beforeTransfer : beforeTransfers) {
                    if (usableFlight.getOriginLocation().getId().equals(beforeTransfer.getDestinationLocation().getId())){
                        StopDTO stop1 = new StopDTO();
                        stop1.setLocation(LocationMapper.toDto(beforeTransfer.getOriginLocation()));
                        stop1.setStopNumber(1);
                        stop1.setTransportationTypeToNext(beforeTransfer.getTransportationType());
                        StopDTO stop2 = new StopDTO();
                        stop2.setLocation(LocationMapper.toDto(usableFlight.getOriginLocation()));
                        stop2.setStopNumber(2);
                        stop2.setTransportationTypeToNext(usableFlight.getTransportationType());
                        StopDTO stop3 = new StopDTO();
                        stop3.setLocation(LocationMapper.toDto(usableFlight.getDestinationLocation()));
                        stop3.setStopNumber(3);
                        result.add(new RouteDTO(Arrays.asList(stop1, stop2, stop3)));
                    }
                }
            }
        }

        // 2 stops
        if (!beforeFlight && !afterFlight) {
            for (Transportation usableFlight : usableFlights) {
                if (usableFlight.getOriginLocation().getId().equals(originLocation.getId()) &&
                usableFlight.getDestinationLocation().getId().equals(destinationLocation.getId())) {
                    StopDTO stop1 = new StopDTO();
                    stop1.setLocation(LocationMapper.toDto(usableFlight.getOriginLocation()));
                    stop1.setStopNumber(1);
                    stop1.setTransportationTypeToNext(usableFlight.getTransportationType());
                    StopDTO stop2 = new StopDTO();
                    stop2.setLocation(LocationMapper.toDto(usableFlight.getDestinationLocation()));
                    stop2.setStopNumber(2);
                    result.add(new RouteDTO(Arrays.asList(stop1, stop2)));
                }
            }
        }

        return result;
    }
}
