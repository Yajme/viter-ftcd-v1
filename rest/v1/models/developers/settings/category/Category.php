<?php
namespace App\Models\Dev\Settings\Category;
use App\Models\Dev\Base\BaseModel;
use App\V1\Core\Exceptions\DatabaseException;
use PDO;



class Category extends BaseModel
{
    private $tableName_rel;
    public function __construct(PDO $db)
    {
        $this->connection = $db;
        $this->tableName = "settings_category";
        $this->id = array(
            "columnName" => "category_aid",
            "value" => 0
        );

    }

    public function readAll()
    {
        try {
            $sql = "SELECT * FROM {$this->tableName} WHERE TRUE ";
            $params = [];

            $isActive = $this->columnNames["category_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

             if ($isActive !== "") {
                $sql .= " AND category_is_active = :category_is_active ";
                $params["category_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                AND (
                    category_name LIKE :search_category_name OR
                    category_description LIKE :search_category_description
                ) ";
                $params["search_category_name"] = "%{$search}%";
                $params["search_category_description"] = "%{$search}%";
            }

            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (\PDOException $ex) {
            throw new DatabaseException("failed to read all from {$this->tableName}", previous: $ex);
        }

        return $query;
    }

    public function readLimit()
    {
        try {
            $sql = "SELECT * FROM {$this->tableName} WHERE TRUE ";
            $params = [];

            $isActive = $this->columnNames["category_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

            if ($isActive !== "") {
                $sql .= " AND category_is_active = :category_is_active ";
                $params["category_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                AND (
                    category_name LIKE :search_category_name OR
                    category_description LIKE :search_category_description
                ) ";
                $params["search_category_name"] = "%{$search}%";
                $params["search_category_description"] = "%{$search}%";
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
