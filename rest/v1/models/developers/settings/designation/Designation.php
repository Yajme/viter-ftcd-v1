<?php
namespace App\Models\Dev\Settings\Designation;
use App\Models\Dev\Base\BaseModel;
use App\V1\Core\Exceptions\DatabaseException;
use PDO;



class Designation extends BaseModel
{
    private $tableName_rel;
    public function __construct(PDO $db)
    {
        $this->connection = $db;
        $this->tableName = "settings_designation";
        $this->tableName_rel = "settings_category";
        $this->id = array(
            "columnName" => "designation_aid",
            "value" => 0
        );

    }

    public function readAll()
    {
        try {
            $sql = "SELECT * FROM {$this->tableName} as d, {$this->tableName_rel} as cat WHERE d.designation_category_id = cat.category_aid ";
            $params = [];

            $isActive = $this->columnNames["designation_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

            if ($isActive !== "") {
                $sql .= " AND d.designation_is_active = :designation_is_active ";
                $params["designation_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                  AND  d.designation_name LIKE :search_designation_name
                     ";
                $params["search_designation_name"] = "%{$search}%";
            }

            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (\PDOException $ex) {
            throw new DatabaseException("failed to read all from {$this->tableName} {$ex->getMessage()}", previous: $ex);
        }

        return $query;
    }

    public function readLimit()
    {
        try {
            $sql = "SELECT * FROM {$this->tableName} as d, {$this->tableName_rel} as cat WHERE d.designation_category_id = cat.category_aid ";
            $params = [];

            $isActive = $this->columnNames["designation_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

            if ($isActive !== "") {
                $sql .= " AND d.designation_is_active = :designation_is_active ";
                $params["designation_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                  AND  d.designation_name LIKE :search_designation_name
                     ";
                $params["search_designation_name"] = "%{$search}%";
            }

            $sql .= " LIMIT :start, :total";
            $query = $this->connection->prepare($sql);

            foreach ($params as $name => $value) {
                $query->bindValue(":{$name}", $value);
            }
            $query->bindValue(":start", (int) $this->filters["start"] - 1, PDO::PARAM_INT);
            $query->bindValue(":total", (int) $this->filters["total"], PDO::PARAM_INT);
            $query->execute();
        } catch (\PDOException $ex) {
            throw new DatabaseException("failed to read all from {$this->tableName}", previous: $ex);
        }

        return $query;
    }
}
