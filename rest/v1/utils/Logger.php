<?php
namespace App\Utils;

use InvalidArgumentException;
use RuntimeException;

/**
 * Log Levels (PSR-3 inspired)
 */
enum LogLevel: string {
    case DEBUG     = 'DEBUG';
    case INFO      = 'INFO';
    case WARNING   = 'WARNING';
    case ERROR     = 'ERROR';
    case CRITICAL  = 'CRITICAL';

    public function priority(): int {
        return match($this) {
            self::DEBUG    => 0,
            self::INFO     => 1,
            self::WARNING  => 2,
            self::ERROR    => 3,
            self::CRITICAL => 4,
        };
    }
}

/**
 * Logger Interface — depend on abstraction, not implementation
 */
interface ILogger {
    public function debug(string $message, array $context = []): void;
    public function info(string $message, array $context = []): void;
    public function warning(string $message, array $context = []): void;
    public function error(string $message, array $context = []): void;
    public function critical(string $message, array $context = []): void;
    public function log(LogLevel $level, string $message, array $context = []): void;
}

/**
 * Logger Handler Interface
 * Each handler decides where the log goes (file, DB, stdout, etc.)
 */
interface ILogHandler {
    public function handle(LogLevel $level, string $formatted): void;
    public function setMinLevel(LogLevel $level): void;
    public function canHandle(LogLevel $level): bool;
}

/**
 * Base Handler — shared filtering logic
 */
abstract class BaseHandler implements ILogHandler {
    protected LogLevel $minLevel;

    public function __construct(LogLevel $minLevel = LogLevel::DEBUG) {
        $this->minLevel = $minLevel;
    }

    public function setMinLevel(LogLevel $level): void {
        $this->minLevel = $level;
    }

    public function canHandle(LogLevel $level): bool {
        return $level->priority() >= $this->minLevel->priority();
    }
}

/**
 * FileHandler — writes logs to a file
 */
class FileHandler extends BaseHandler {
    private string $filePath;

    public function __construct(string $filePath, LogLevel $minLevel = LogLevel::DEBUG) {
        parent::__construct($minLevel);

        $dir = dirname($filePath);
        if (!is_dir($dir) && !mkdir($dir, 0755, recursive: true)) {
            throw new RuntimeException("Failed to create log directory: {$dir}");
        }

        $this->filePath = $filePath;
    }

    public function handle(LogLevel $level, string $formatted): void {
        if (!$this->canHandle($level)) return;

        $result = file_put_contents($this->filePath, $formatted . PHP_EOL, FILE_APPEND | LOCK_EX);
        if ($result === false) {
            throw new RuntimeException("Failed to write to log file: {$this->filePath}");
        }
    }
}

/**
 * StdoutHandler — writes logs to console (useful for CLI / Docker)
 */
class StdoutHandler extends BaseHandler {
    public function handle(LogLevel $level, string $formatted): void {
        if (!$this->canHandle($level)) return;
        echo $formatted . PHP_EOL;
    }
}

/**
 * Logger — core class, supports multiple handlers
 *
 * Usage:
 *   $logger = new Logger('App');
 *   $logger->addHandler(new FileHandler('/logs/app.log'));
 *   $logger->addHandler(new StdoutHandler(LogLevel::ERROR));
 *
 *   $logger->info('User logged in', ['user_id' => 42]);
 *   $logger->error('DB failed', ['exception' => $e]);
 */
class Logger implements ILogger {
    /** @var ILogHandler[] */
    private array $handlers = [];
    private string $channel;

    public function __construct(string $channel = 'App') {
        $this->channel = $channel;
    }

    public function addHandler(ILogHandler $handler): static {
        $this->handlers[] = $handler;
        return $this; // fluent interface
    }

    public function debug(string $message, array $context = []): void {
        $this->log(LogLevel::DEBUG, $message, $context);
    }

    public function info(string $message, array $context = []): void {
        $this->log(LogLevel::INFO, $message, $context);
    }

    public function warning(string $message, array $context = []): void {
        $this->log(LogLevel::WARNING, $message, $context);
    }

    public function error(string $message, array $context = []): void {
        $this->log(LogLevel::ERROR, $message, $context);
    }

    public function critical(string $message, array $context = []): void {
        $this->log(LogLevel::CRITICAL, $message, $context);
    }

    public function log(LogLevel $level, string $message, array $context = []): void {
        if (empty($this->handlers)) {
            throw new RuntimeException("Logger has no handlers. Add one via addHandler().");
        }

        $formatted = $this->format($level, $message, $context);

        foreach ($this->handlers as $handler) {
            $handler->handle($level, $formatted);
        }
    }

    /**
     * Formats the log entry.
     * Output: [2025-01-01 12:00:00] App.ERROR: Something failed {"key":"value"}
     */
    private function format(LogLevel $level, string $message, array $context): string {
        $timestamp = date('Y-m-d H:i:s');
        $ctx = empty($context) ? '' : ' ' . $this->serializeContext($context);

        return "[{$timestamp}] {$this->channel}.{$level->value}: {$message}{$ctx}";
    }

    /**
     * Safely serializes context — handles Throwable objects specially
     */
    private function serializeContext(array $context): string {
        $normalized = [];

        foreach ($context as $key => $value) {
            $normalized[$key] = match(true) {
                $value instanceof \Throwable => [
                    'class'   => get_class($value),
                    'message' => $value->getMessage(),
                    'code'    => $value->getCode(),
                    'file'    => $value->getFile(),
                    'line'    => $value->getLine(),
                    'trace'   => $value->getTraceAsString(),
                    'previous'=> $value->getPrevious()?->getMessage(),
                ],
                is_object($value) => method_exists($value, '__toString')
                    ? (string) $value
                    : get_class($value),
                default => $value,
            };
        }

        return json_encode($normalized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}