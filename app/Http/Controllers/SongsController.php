<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Song;

class SongsController extends Controller
{
    public function index(Song $song)
    {
        $songs = $song->get();
        return view('songs.index', compact('songs'));
    }

    public function show($slug)
    {
        $song = Song::whereSlug($slug)->first();
        return view('songs.show', compact('song'));
    }

    public function edit($slug)
    {
        $song = Song::whereSlug($slug)->first();
        return view('songs.edit', compact('song'));
    }
}
