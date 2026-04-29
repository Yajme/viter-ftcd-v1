<?php
namespace App\Models\Dev\Base;

use App\V1\Core\Exceptions\DatabaseException;
use InvalidArgumentException;
use PDOException;
use PDO;
abstract class BaseModel implements IModels
{

    protected $connection;
    protected $tableName;
    protected $searchColumns = [];

    public $columnNames;
    public $filters;
    public $lastInsertedId;
    public $id;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->filters = array(
            "search" => "",
            "total" => 0,
            "start" => 0
        );
    }
    private function validateColumnNames()
    {
        if (
            !is_array($this->columnNames) || array_is_list($this->columnNames) ||
            empty($this->columnNames)
        ) {
            throw new InvalidArgumentException('columnNames must be a non-empty associative
  array.');
        }
        return true;
    }
    private function filterArray($keyword)
    {
        $activeKeys = array_filter(
            $this->columnNames,
            fn($key) => str_contains($key, $keyword),
            ARRAY_FILTER_USE_KEY
        );

        return $activeKeys;
    }
    protected function getSearchableColumns()
    {
        if (is_array($this->searchColumns) && !empty($this->searchColumns)) {
            return array_values($this->searchColumns);
        }

        try {
            $query = $this->connection->query("SHOW COLUMNS FROM {$this->tableName}");
            $columns = $query->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $ex) {
            throw new DatabaseException(
                "failed to resolve searchable columns from {$this->tableName} {$ex->getMessage()}",
                previous: $ex
            );
        }

        $searchableColumns = [];
        foreach ($columns as $column) {
            $columnName = $column["Field"] ?? "";
            $columnType = strtolower((string) ($column["Type"] ?? ""));
            $isTextType = str_contains($columnType, "char") ||
                str_contains($columnType, "text") ||
                str_contains($columnType, "enum") ||
                str_contains($columnType, "set");

            if ($columnName !== "" && $isTextType && !str_contains($columnName, "_is_active")) {
                $searchableColumns[] = $columnName;
            }
        }

        return $searchableColumns;
    }
    public function getId()
    {
        return $this->id["value"];
    }
    public function setId($value)
    {
        $this->id["value"] = $value;
    }
    public function create()
    {
        try {
            $this->validateColumnNames();
            $sql = "INSERT INTO {$this->tableName} (";
            if (is_array($this->columnNames)) {
                $lastKey = array_key_last($this->columnNames);
                foreach ($this->columnNames as $column => $value) {
                    $sql .= $column == $lastKey ? "{$column}" : "{$column},";
                }
                $sql .= " ) VALUES (";
                foreach ($this->columnNames as $column => $value) {
                    $sql .= $column == $lastKey ? ":{$column}" : ":{$column},";
                }
                $sql .= ");";
            }

            $query = $this->connection->prepare($sql);
            $params = $this->columnNames;
            $query->execute($params);
            $this->lastInsertedId = $this->connection->lastInsertId();

        } catch (PDOException $ex) {
            throw new DatabaseException(
                "Failed to create from {$this->tableName} {$ex->getMessage()}",
                previous: $ex
            );
        }
        return $query;
    }
    public function readAll()
    {

        try{
            //Validate the Column Names
            $this->validateColumnNames();
            //Get the is_active column
            $isActiveColumn = $this->filterArray("_is_active");
            //Get the key
            $activeKey = array_key_first($isActiveColumn);
            $activeValue = $activeKey !== null ? ($isActiveColumn[$activeKey] ?? "") : "";
            $sql = " SELECT * FROM {$this->tableName} WHERE TRUE ";
            $params = [];
            if($activeKey !== null && $activeValue !== ""){
                $sql .= " AND {$activeKey} = :{$activeKey} ";
                $params[$activeKey] = $activeValue;
            }
            $search = trim((string) ($this->filters['search'] ?? ""));
            $searchableColumns = $this->getSearchableColumns();
            if($search !== "" && !empty($searchableColumns)){
                $conditions = [];
                foreach($searchableColumns as $column){
                    $searchParam = "search_{$column}";
                    $conditions[] = " {$column} LIKE :{$searchParam} ";
                    $params[$searchParam] = "%{$search}%";
                }
                $sql .= " AND (" . implode(" OR ", $conditions) . ")";
            }
            $query = $this->connection->prepare($sql);
            foreach ($params as $name => $value) {
                $query->bindValue(":{$name}", $value);
            }
            $query->execute();
            return $query;
        }catch(PDOException $ex){
            throw new DatabaseException("failed to read all from {$this->tableName} {$ex->getMessage()}", previous: $ex);
        }

    }
    public function readLimit()
    {
         try{
            $this->validateColumnNames();
            $isActiveColumn = $this->filterArray("_is_active");
            $activeKey = array_key_first($isActiveColumn);
            $activeValue = $activeKey !== null ? ($isActiveColumn[$activeKey] ?? "") : "";
            $sql = " SELECT * FROM {$this->tableName} WHERE TRUE ";
            $params = [];
            if($activeKey !== null && $activeValue !== ""){
                $sql .= " AND {$activeKey} = :{$activeKey} ";
                $params[$activeKey] = $activeValue;
            }
            $search = trim((string) ($this->filters['search'] ?? ""));
            $searchableColumns = $this->getSearchableColumns();
            if($search !== "" && !empty($searchableColumns)){
                $conditions = [];
                foreach($searchableColumns as $column){
                    $searchParam = "search_{$column}";
                    $conditions[] = " {$column} LIKE :{$searchParam} ";
                    $params[$searchParam] = "%{$search}%";
                }
                $sql .= " AND (" . implode(" OR ", $conditions) . ")";
            }

            $sql .= " LIMIT :start, :total";
            $query = $this->connection->prepare($sql);
            foreach ($params as $name => $value) {
                $query->bindValue(":{$name}", $value);
            }
            $query->bindValue(":start", (int) $this->filters["start"] - 1, PDO::PARAM_INT);
            $query->bindValue(":total", (int) $this->filters["total"], PDO::PARAM_INT);
            $query->execute();
            return $query;
        }catch(PDOException $ex){
            throw new DatabaseException("failed to read all from {$this->tableName} {$ex->getMessage()}", previous: $ex);
        }
    }

    public function checkName()
    {
        throw new \BadMethodCallException('Method not implemented');
    }

    public function update()
    {
        try {
            $this->validateColumnNames();
            $sql = "UPDATE {$this->tableName} SET ";
            $lastKey = array_key_last($this->columnNames);
            foreach ($this->columnNames as $column => $value) {
                $sql .= $column === $lastKey ? " {$column} = :{$column} " : " {$column} = :{$column}, ";
            }
            $sql .= "   WHERE {$this->id['columnName']} = :{$this->id['columnName']}";
            $query = $this->connection->prepare($sql);
            $query->execute([...$this->columnNames, $this->id["columnName"] => $this->id["value"]]);
        } catch (PDOException $ex) {
            throw new DatabaseException(
                "Failed to updated from {$this->tableName}",
                previous: $ex
            );
        }

        return $query;
    }
    public function delete()
    {
        try {
            $sql = "DELETE FROM {$this->tableName} WHERE {$this->id['columnName']} = :{$this->id['columnName']}";
            $query = $this->connection->prepare($sql);
            $query->execute([
                $this->id['columnName'] => $this->id['value'],
            ]);
        } catch (PDOException $ex) {
            throw new DatabaseException(
                "Failed to delete from {$this->tableName}",
                previous: $ex
            );
        }

        return $query;
    }
    public function active()
    {
        try {
            $isActiveColumn = $this->filterArray("_is_active");
            if (empty($isActiveColumn)) {
                throw new \RuntimeException("No _is_active column defined on {$this->tableName}");
            }
            $activeKey = array_key_first($isActiveColumn);
            $sql = "UPDATE {$this->tableName} SET {$activeKey} = :isActive  WHERE {$this->id['columnName']} = :id";

            $query = $this->connection->prepare($sql);
            $query->execute([
                "isActive" => $isActiveColumn[$activeKey],
                "id" => $this->id['value'],
            ]);
        } catch (PDOException $ex) {
            throw new DatabaseException(
                "Failed to update from {$this->tableName} {$ex->getMessage()}",
                previous: $ex
            );
        }

        return $query;
    }
}
