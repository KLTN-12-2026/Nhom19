package com.example.device_maintenance_backend.response;

import java.time.Instant;

public record ErrorResponse(int status, String message, String path, Instant timestamp) {
}
