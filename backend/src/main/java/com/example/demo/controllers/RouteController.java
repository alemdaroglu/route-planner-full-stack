package com.example.demo.controllers;

import com.example.demo.dtos.RouteDTO;
import com.example.demo.services.RouteService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/routes")
@PreAuthorize("hasAnyRole('ADMIN', 'AGENCY')")
public class RouteController {
    private final RouteService routeService;

    RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    // Get all locations
    @GetMapping
    public ResponseEntity<List<RouteDTO>> getMatchingRoutes(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date) {
        return ResponseEntity.ok(routeService.findMatchingRoutes(origin, destination, date));
    }

}
