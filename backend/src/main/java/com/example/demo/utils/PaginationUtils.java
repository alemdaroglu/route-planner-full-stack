package com.example.demo.utils;

import org.springframework.data.domain.*;

public class PaginationUtils {

  public static Pageable getPageable(int page, int size, String sortBy, boolean ascending) {
    Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
    return PageRequest.of(page, size, sort);
  }
}
