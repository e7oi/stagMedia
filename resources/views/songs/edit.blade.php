@extends('master')

@section('content')
    <div class="content">
        <div class="title">Edit "{{ $song->title  }}"</div>

        {!! Form::model($song, ['route' => ['song.patch', $song->slug], 'method' => 'PATCH']) !!}

        @include('songs._form')

        {!! Form::close() !!}

        {!! delete_form(['song.destroy', $song->slug]) !!}

    </div>
@stop
