package com.example.demo.repositories;

import com.example.demo.models.Location;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
  Optional<Location> findByLocationCode(String locationCode);
}
