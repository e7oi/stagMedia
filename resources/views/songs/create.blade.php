@extends('master')

@section('content')
    <div class="content">
        <div class="title">Add a new song</div>

        {!! Form::open(['route' => 'song.store', 'method' => 'POST']) !!}

            @include('songs._form')

        {!! Form::close() !!}

    </div>
@stop
