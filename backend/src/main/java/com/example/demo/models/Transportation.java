package com.example.demo.models;

import com.example.demo.dtos.TransportationDTO;
import com.example.demo.enums.TransportationType;
import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.util.Objects;
import java.util.Set;


@Entity
public class Transportation extends BaseEntity {

    @Column(name = "transportation_type", nullable = false)
    @Enumerated(EnumType.STRING) // This ensures the enum is stored as a string in the database
    private TransportationType transportationType;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "transportation_operating_days", joinColumns = @JoinColumn(name = "transportation_id"))
    @Column(name = "day_of_week")
    private Set<Integer> operatingDays;

    @ManyToOne
    @JoinColumn(name = "origin_location_id", referencedColumnName = "id")
    private Location originLocation;

    @ManyToOne
    @JoinColumn(name = "destination_location_id", referencedColumnName = "id")
    private Location destinationLocation;

    public Transportation() {

    }

    public Transportation(
            Location originLocation,
            Location destinationLocation,
            TransportationType transportationType,
            Set<Integer> operatingDays) {
        this.transportationType = transportationType;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.operatingDays = operatingDays;
    }


    public Location getOriginLocation() {
        return this.originLocation;
    }

    public Location getDestinationLocation() {
        return this.destinationLocation;
    }

    public TransportationType getTransportationType() {
        return transportationType;
    }

    public void setOriginLocation(Location originLocation) {
        this.originLocation = originLocation;
    }

    public void setDestinationLocation(Location destinationLocation) {
        this.destinationLocation = destinationLocation;
    }


    public void setTransportationType(TransportationType transportationType) {
        this.transportationType = transportationType;
    }

    public Set<Integer> getOperatingDays() {
        return operatingDays;
    }

    public void setOperatingDays(Set<Integer> operatingDays) {
        this.operatingDays = operatingDays;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Transportation transportation))
            return false;
        return Objects.equals(super.getId(), transportation.getId())
                && Objects.equals(this.transportationType, transportation.transportationType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
                super.getId(),
                this.transportationType);
    }

    @Override
    public String toString() {
        return "Transportation{" + "id=" + super.getId() + '}';
    }
}