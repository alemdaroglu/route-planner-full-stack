package com.example.demo.dtos;

import java.io.Serializable;
import java.util.List;

public class RouteDTO implements Serializable {
    private List<StopDTO> stops;

    public RouteDTO(List<StopDTO> stops) {
        this.stops = stops;
    }

    public List<StopDTO> getStops() {
        return stops;
    }
    public void setStops(List<StopDTO> stops) {
        this.stops = stops;
    }
}
