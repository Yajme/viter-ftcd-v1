<?php
namespace App\Models\Dev\Settings\Users\System;
use App\Models\Dev\Base\BaseModel;
use App\V1\Core\Exceptions\DatabaseException;
use PDO;



class System extends BaseModel
{
    private $tableName_rel;
    public function __construct(PDO $db)
    {
        $this->connection = $db;
        $this->tableName = "settings_users_system";
        $this->tableName_rel = "settings_users_roles";
        $this->id = array(
            "columnName" => "user_aid",
            "value" => 0
        );

    }

    public function readAll()
    {
        try {
            $sql = "SELECT * FROM {$this->tableName} as system_users, {$this->tableName_rel} as roles_users WHERE system_users.user_role_id = roles_users.role_aid ";
            $params = [];

            $isActive = $this->columnNames["user_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

             if ($isActive !== "") {
                $sql .= " AND system_users.user_is_active = :user_is_active ";
                $params["user_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                AND (
                    system_users.user_name LIKE :search_user_name OR
                    system_users.user_email LIKE :search_user_email
                ) ";
                $params["search_user_name"] = "%{$search}%";
                $params["search_user_email"] = "%{$search}%";
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
            $sql = "SELECT * FROM {$this->tableName} as system_users, {$this->tableName_rel} as roles_users WHERE system_users.user_role_id = roles_users.role_aid ";
            $params = [];

            $isActive = $this->columnNames["user_is_active"] ?? "";
            $search = trim((string) ($this->filters["search"] ?? ""));

            if ($isActive !== "") {
                $sql .= " AND system_users.user_is_active = :user_is_active ";
                $params["user_is_active"] = $isActive;
            }

            if ($search !== "") {
                $sql .= "
                AND (
                    system_users.user_name LIKE :search_user_name OR
                    system_users.user_email LIKE :search_user_email
                ) ";
                $params["search_user_name"] = "%{$search}%";
                $params["search_user_email"] = "%{$search}%";
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
