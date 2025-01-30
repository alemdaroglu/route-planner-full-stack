package com.example.demo.repositories;

import com.example.demo.models.Transportation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransportationRepository extends JpaRepository<Transportation, Long> {

    @Query("SELECT t FROM Transportation t " +
            "JOIN t.operatingDays od " +
            "WHERE t.originLocation.id = :originLocationId " +
            "AND LENGTH(t.destinationLocation.locationCode) = 3" +
            "AND t.transportationType != 'FLIGHT'" +
            "AND od = :dayOfWeek")
    List<Transportation> findUsableAirportsByOriginLocationIdAndOperatingDay(Long originLocationId,
                                                                                  int dayOfWeek);
    @Query("SELECT t FROM Transportation t " +
            "JOIN t.operatingDays od " +
            "WHERE t.destinationLocation.id = :destinationLocationId " +
            "AND LENGTH(t.originLocation.locationCode) = 3" +
            "AND t.transportationType != 'FLIGHT'" +
            "AND od = :dayOfWeek")
    List<Transportation> findUsableAirportsByDestinationLocationIdAndOperatingDay(Long destinationLocationId,
                                                                              int dayOfWeek);

    @Query("SELECT t FROM Transportation t " +
            "JOIN t.operatingDays od " +
            "WHERE t.destinationLocation.id in :destinationLocationIds " +
            "AND t.originLocation.id in :originLocationIds " +
            "AND t.transportationType = 'FLIGHT'" +
            "AND od = :dayOfWeek")
    List<Transportation> findUsableFlightsByOperatingDay(
            List<Long> originLocationIds, List<Long> destinationLocationIds, int dayOfWeek);
}