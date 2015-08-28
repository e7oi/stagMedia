@extends('master')

@section('content')
    <div class="content">
        <div class="title">Edit "{{ $song->title  }}"</div>
        <div class="sub-title"><img data-src="holder.js/32x32" class="img-thumbnail" alt="{{ $song->artist }}"> {{ $song->artist }}</div>
        <div style="border: 1px solid grey;">
            {{ $song->lyrics }}
        </div>
    </div>
@stop
