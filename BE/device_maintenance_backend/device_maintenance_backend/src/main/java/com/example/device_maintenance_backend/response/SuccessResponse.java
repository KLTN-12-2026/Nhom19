package com.example.device_maintenance_backend.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SuccessResponse<T>(
        int status,
        String message,
        T data,
        Integer page,
        Integer size,
        Long total,
        Integer totalPages
) {
    public static <T> SuccessResponse<T> of(HttpStatus status, String message, T data) {
        return new SuccessResponse<>(status.value(), message, data, null, null, null, null);
    }

    public static <T> SuccessResponse<List<T>> paged(String message, Page<T> page) {
        return new SuccessResponse<>(HttpStatus.OK.value(), message, page.getContent(),
                page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
    }
}
