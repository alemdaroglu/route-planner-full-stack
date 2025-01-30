package com.example.demo.dtos;

import com.example.demo.enums.TransportationType;

import java.io.Serializable;

public class StopDTO implements Serializable {
    private int stopNumber;
    private LocationDTO location;
    private TransportationType transportationTypeToNext;

    public LocationDTO getLocation() {
        return location;
    }
    public void setLocation(LocationDTO location) {
        this.location = location;
    }
    public TransportationType getTransportationTypeToNext() {
        return transportationTypeToNext;
    }
    public void setTransportationTypeToNext(TransportationType transportationTypeToNext) {
        this.transportationTypeToNext = transportationTypeToNext;
    }
    public int getStopNumber() {
        return stopNumber;
    }
    public void setStopNumber(int stopNumber) {
        this.stopNumber = stopNumber;
    }
}
