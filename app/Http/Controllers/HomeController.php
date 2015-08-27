<?php
/**
 * Created by PhpStorm.
 * User: spidb
 * Date: 8/26/2015
 * Time: 11:44 PM
 */

namespace App\Http\Controllers;


use Illuminate\Routing\Controller;

class HomeController extends Controller
{
    public function index() {
        return view('pages.welcome');
        //return 'Hello!!';
        //return view('welcome');
    }
}