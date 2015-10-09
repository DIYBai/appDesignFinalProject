function onPageLoad()
{
    window.setTimeout( sendUpdateReq, 1000 );
}

function sendUpdateReq()
{
    // alert( "SENDUPDATE" );
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", onResponse );
    xhr.open( "get", "get_number", true );
    xhr.send();
}

function gogogo()
{
    var radios = document.getElementsByName( 'team' );
    var color = 'blue';
    for( var i = 0; i < radios.length; i++ )
    {
        if( radios[i].checked && ( radios[i].value === 'red' ) )
            color = 'red';
    }

    // alert( color );
    var xhr = new XMLHttpRequest();
    xhr.addEventListener( "load", onResponse );
    xhr.open( "get", "gogogo?color="+color, true );
    xhr.send();
}

function onResponse( evt )
{
    var xhr = evt.target;
    console.log( "Response text: ", xhr.responseText );
    var element = document.getElementById( 'the_number' );
    element.innerHTML = xhr.responseText;
    window.setTimeout( sendUpdateReq, 1000 );
}
