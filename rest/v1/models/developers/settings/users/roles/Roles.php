<?php 
namespace App\Models\Dev\Settings\Users\Roles;
use App\Models\Dev\Base\BaseModel;
use PDOException;



class Roles extends BaseModel {
    
    public function __construct($db)
    {
        parent::__construct($db);
        $this->tableName="settings_users_roles";
        $this->id = array(
        "columnName" => "role_aid",
        "value" => 0
        );
    }
    
    public function readAll(){
        try{
            $sql = "SELECT * FROM {$this->tableName}";
            $query = $this->connection->query($sql);
        }catch(PDOException $ex){
            $query = [
                "error" => true,
                "error_info" => $ex->getMessage(),
            ];
        }
        return $query;
    }
    
}