<?php

// Base for your whole app
class AppException extends \RuntimeException {}

// Domain-specific
class DatabaseException extends AppException {}
class ValidationException extends AppException {
    private array $errors;

    public function __construct(array $errors) {
        $this->errors = $errors;
        parent::__construct("Validation failed");
    }

    public function getErrors(): array {
        return $this->errors;
    }
}
class RecordNotFoundException extends DatabaseException {}