@extends('master')

@section('content')
    <div class="content">
        <div class="title">About</div>
        <div>
            <div style="float:left"><img data-src="holder.js/128x128" class="img-thumbnail" alt="Stag"></div>
            <div style="float:left; margin-left:10px;">
                <b>{{ ucwords($info['firstName'] . ' ' . $info['lastName']) }}</b>
                <br />
                <i>{{ $position }}</i> @ {{ $company }}
                <div>
                    @foreach($address as $addressInfo)
                        <p>{{ $addressInfo }}</p>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
@stop

@section('footer')
    <div class="footer">Stag Prod.</div>
@stop