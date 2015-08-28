@extends('master')

@section('content')
    <div class="content">
        <div class="title">Songs List</div>

        <ul>
        @foreach($songs as $song)
            <li><a href="/songs/{{ $song->slug  }}">{{ $song->artist }} - {{ $song->title }}</a></li>
        @endforeach
        </ul>
    </div>
@stop
