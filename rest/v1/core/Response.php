<?php 
// namespace V1\Core;

class Response
{
    private $_success;
    private $_data;
    private $_toCache = false;
    private $_responseData = [];
    private $_statusCode;

    public function setSuccess($success)
    {
        return $this->_success = $success;
    }

    public function setData($data)
    {
        return $this->_data = $data;
    }

    public function setStatusCode($status)
    {
        return $this->_statusCode = $status;
    }

    public function send()
    {
        header("Content-type: application/json;charset=utf-8");
        if ($this->_statusCode !== null) {
            http_response_code($this->_statusCode);
        }
        if ($this->_toCache) {
            header("Cache-Control: max-age=60");
        } else {
            header("Cache-Control: no-cache no-store");
        }
        $this->_responseData = $this->_data;

        echo json_encode($this->_responseData);
    }
}
