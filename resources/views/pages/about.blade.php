@extends('master')

@section('content')
    <div class="container">
        <div class="content">
            <div class="title">About</div>
            <div>
                <b>{{ ucwords($info['firstName'] . ' ' . $info['lastName']) }}</b>
                <br /><i>{{ $position }}</i> @ {{ $company }}
            </div>
            <div>
                @foreach($address as $addressInfo)
                    <p>{{ $addressInfo }}</p>
                @endforeach
            </div>
        </div>
    </div>
@stop

@section('footer')
    <div class="footer">Stag Prod.</div>
@stop