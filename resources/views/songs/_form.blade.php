<div class="form-group {{$errors->has('title') ? 'has-error' : ''}}">
    {!! Form::label('title', 'Title:') !!}
    {!! Form::text('title', null, ['class' => 'form-control']) !!}
    {!! $errors->first('title', '<span class="help-block">:message</span>') !!}
</div>

<div class="form-group {{$errors->has('slug') ? 'has-error' : ''}}">
    {!! Form::label('slug', 'Song Key:') !!}
    {!! Form::text('slug', null, ['class' => 'form-control']) !!}
    {!! $errors->first('slug', '<span class="help-block">:message</span>') !!}
</div>

<div class="form-group">
    {!! Form::label('artist', 'Artist:') !!}
    {!! Form::text('artist', null, ['class' => 'form-control']) !!}
</div>

<div class="form-group">
    {!! Form::label('lyrics', 'Lyrics:') !!}
    {!! Form::textarea('lyrics', null, ['class' => 'form-control']) !!}
</div>

<div class="form-group">
    {!! Form::submit('Update Song', ['class' => 'btn btn-primary']) !!}
</div>