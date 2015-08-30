@extends('master')

@section('content')
    <div class="content">
        <div class="title">Songs List</div>
{!! link_to_route('song.create', 'Create a new song') !!}
        <ul>
        @foreach($songs as $song)
            <li>
                    {!! link_to_route('song.show', $song->artist . ' - ' . $song->title, [$song->slug]) !!}
            </li>
        @endforeach
        </ul>
    </div>
@stop
