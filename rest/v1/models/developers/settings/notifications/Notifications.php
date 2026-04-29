<?php
namespace App\Models\Dev\Settings\Notifications;
use App\Models\Dev\Base\BaseModel;
use App\V1\Core\Exceptions\DatabaseException;
use PDO;



class Notifications extends BaseModel
{
    public function __construct(PDO $db)
    {
        $this->connection = $db;
        $this->tableName = "settings_notifications";
        $this->id = array(
            "columnName" => "notification_aid",
            "value" => 0
        );

    }

    public function readAll()
    {
        try {
            $sql = "SELECT * FROM {$this->tableName} as d WHERE TRUE";
            $params = [];

            $isActive = $this->columnNames["notification_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

            if ($isActive !== "") {
                $sql .= " AND d.notification_is_active = :notification_is_active ";
                $params["notification_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                  AND  d.notification_name LIKE :search_notification_name
                     ";
                $params["search_notification_name"] = "%{$search}%";
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
            $sql = "SELECT * FROM {$this->tableName} as d WHERE TRUE";
            $params = [];

            $isActive = $this->columnNames["notification_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

            if ($isActive !== "") {
                $sql .= " AND d.notification_is_active = :notification_is_active ";
                $params["notification_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                  AND  d.notification_name LIKE :search_notification_name
                     ";
                $params["search_notification_name"] = "%{$search}%";
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
