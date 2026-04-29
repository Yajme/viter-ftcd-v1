<?php
namespace App\Models\Dev\Donor;
use App\Models\Dev\Base\BaseModel;
use PDO;
class Donors extends BaseModel 
{
    public function __construct(PDO $db)
    {
        $this->connection = $db;
        $this->tableName = "donors";
        $this->id = array(
            "columnName" => "donor_aid",
            "value" => 0
        );
    }
}