package com.example.device_maintenance_backend.exception;

import com.example.device_maintenance_backend.response.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalHandler extends ResponseEntityExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalHandler.class);

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(WebRequest request) {
        return error(HttpStatus.UNAUTHORIZED, "Invalid identifier or password", request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(WebRequest request) {
        return error(HttpStatus.FORBIDDEN, "Forbidden", request);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<Object> handleMissingOrInvalidToken(WebRequest request) {
        return error(HttpStatus.UNAUTHORIZED, "Valid access token required", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnexpected(Exception exception, WebRequest request) {
        log.error("Unexpected API error", exception);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception, Object body, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String message = switch (status.value()) {
            case 400 -> "Invalid request";
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Resource not found";
            case 405 -> "Method not allowed";
            case 415 -> "Unsupported media type";
            default -> status.is5xxServerError() ? "Internal Server Error" : "Request failed";
        };
        if (exception instanceof MethodArgumentNotValidException validationException) {
            message = validationException.getBindingResult().getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .distinct()
                    .sorted()
                    .collect(Collectors.joining(", "));
        } else if (status.is4xxClientError() && exception instanceof ResponseStatusException responseException
                && responseException.getReason() != null) {
            message = responseException.getReason();
        }
        if (status.is5xxServerError()) {
            log.error("API request failed", exception);
        }
        return super.handleExceptionInternal(exception, errorBody(status, message, request), headers, status, request);
    }

    private ResponseEntity<Object> error(HttpStatusCode status, String message, WebRequest request) {
        return ResponseEntity.status(status).body(errorBody(status, message, request));
    }

    private ErrorResponse errorBody(HttpStatusCode status, String message, WebRequest request) {
        String path = ((ServletWebRequest) request).getRequest().getRequestURI();
        return new ErrorResponse(status.value(), message, path, Instant.now());
    }
}
