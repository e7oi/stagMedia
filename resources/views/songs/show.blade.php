@extends('master')

@section('content')
    <div class="content">
        <div class="title">"{{ $song->title  }}"</div>
        <div class="sub-title"><img data-src="holder.js/32x32" class="img-thumbnail"
                                    alt="{{ $song->artist }}"> {{ $song->artist }}</div>
        <div class="actions"><a href="{{route('song.edit', [$song->slug])}}">edit</a></div>
        @if($song->lyrics)
            <article style="border: 1px solid grey; border-width: 0px 0px 0px 1px; margin-top:10px; padding:10px;">
                {!! nl2br($song->lyrics) !!}
            </article>
        @endif
    </div>
@stop
