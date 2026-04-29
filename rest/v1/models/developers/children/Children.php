<?php
namespace App\Models\Dev\Children;

use App\Models\Dev\Base\BaseModel;

class Children extends BaseModel {
    public function __construct($db) {
        parent::__construct($db);
        $this->tableName = "children";
        $this->id = array(
            "columnName" => "child_aid",
            "value" => 0
        );
    }
}