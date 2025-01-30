package com.example.demo.utils;

import org.springframework.data.domain.*;

import java.util.ArrayList;
import java.util.List;

public class PaginationUtils {

    public static Pageable getPageable(int page, int size, String sortBy, boolean ascending) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return PageRequest.of(page, size, sort);
    }
}
