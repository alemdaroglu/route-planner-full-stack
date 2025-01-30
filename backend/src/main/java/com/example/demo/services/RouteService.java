package com.example.demo.services;

import com.example.demo.dtos.RouteDTO;

import java.time.LocalDate;
import java.util.List;

public interface RouteService {
    List<RouteDTO> findMatchingRoutes(
            String originLocationCode,
            String destinationLocationCode,
            LocalDate travelDate);
}
