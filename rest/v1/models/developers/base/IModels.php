<?php
namespace App\Models\Dev\Base;

interface IModels {
  public function create();
  public function readAll();
  public function readLimit();
  public function checkName();
  public function update();
  public function delete();
  public function active();
}
