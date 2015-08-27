<?php

namespace App\Http\Controllers;


use Illuminate\Routing\Controller;

class PageController extends Controller
{
    public function index()
    {
        return view('pages.welcome');
    }

    public function about()
    {
        $info = [];
        $info['firstName'] = 'eloi';
        $info['lastName'] = 'bertin';
        $address = ['123 Main St', 'Montreal Quebec', 'A1A 1A1'];
        $position = 'Software Developer';
        $company = 'Stag';
        return view('pages.about', ['info' => $info, 'address' => $address])
            ->with('position', $position)
            ->withCompany($company);
    }
    public function demo()
    {
        return view('pages.demo');
    }
}
