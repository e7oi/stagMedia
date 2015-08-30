<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Routing\Controller;
use App\Song;

class SongsController extends Controller
{

    /**
     * @var Song
     */
    private $song;

    public function __construct(Song $song)
    {
        $this->song = $song;
    }

    /**
     * Show list of songs
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $songs = $this->song->get();
        return view('songs.index', compact('songs'));
    }

    /**
     * Show details of a song
     *
     * @param      $slug
     * @return \Illuminate\View\View
     */
    public function show($slug)
    {
        $song = $this->song->whereSlug($slug)->first();
        return view('songs.show', compact('song'));
    }

    /**
     * Show a form to create a new song
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return view('songs.create');
    }

    /**
     * Persist a new song
     *
     * @param Requests\CreateSongRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Requests\CreateSongRequest $request)
    {
        $this->song->create($request->all());
        return redirect()->route('song.index');
    }

    /**
     * Show a form to edit a song
     *
     * @param $slug
     * @return \Illuminate\View\View
     */
    public function edit($slug)
    {
        $song = $this->song->whereSlug($slug)->first();
        return view('songs.edit', compact('song'));
    }

    /**
     * Update a song's details
     *
     * @param                            $slug
     * @param Requests\CreateSongRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update($slug, Requests\CreateSongRequest $request)
    {
        $song = $this->song->whereSlug($slug)->first();

        $song->fill($request->input())->save();
        return redirect()->route('song.index');
    }

    /**
     * Delete a song
     *
     * @param                            $slug
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($slug)
    {
        $song = $this->song->whereSlug($slug)->first();
        $song->delete();
        return redirect()->route('song.index');
    }
}
