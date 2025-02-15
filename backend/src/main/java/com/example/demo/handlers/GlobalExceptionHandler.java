package com.example.demo.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // Logger instance
  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
    BindingResult bindingResult = ex.getBindingResult();
    StringBuilder errorMessage = new StringBuilder("Validation failed: ");

    for (FieldError fieldError : bindingResult.getFieldErrors()) {
      errorMessage
          .append(fieldError.getField())
          .append(" - ")
          .append(fieldError.getDefaultMessage())
          .append("; ");
    }

    // Log the exception and error details
    logger.error("Validation error: {}", errorMessage.toString(), ex);

    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
    // Log the exception message
    logger.error("Illegal argument error: {}", ex.getMessage(), ex);

    return ResponseEntity.badRequest().body(ex.getMessage());
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<String> handleBadCredentialsException(BadCredentialsException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bad credentials");
  }

  @ExceptionHandler(AuthorizationDeniedException.class)
  public ResponseEntity<String> handleAuthorizationDeniedException(
      AuthorizationDeniedException ex) {

    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body("You are not authorized to access this resource.");
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleGenericException(Exception ex) {
    // Log the exception message
    logger.error("Unexpected error occurred", ex);

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("An unexpected error occurred.");
  }
}
