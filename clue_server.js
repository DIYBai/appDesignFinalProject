var fs   = require( 'fs' );
var http = require( 'http' );

var the_num = 0;

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max-min))+min;
}
function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    if( parts.length === 2 )
    {
        var key_value_pairs = parts[1].split( "&" );
        for( var i = 0; i < key_value_pairs.length; i++ )
        {
            var key_value = key_value_pairs[i].split( "=" );
            kvs[ key_value[0] ] = key_value[1];
        }
    }
    return kvs
}

function serveFile( req, res )
{
    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
        return true;
    }
    catch( exp ) {
        return false;
    }
}

function serveDynamic( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    if( req.url.indexOf( "gogogo?" ) >= 0 )
    {
        if( kvs.color === "red" )
        {
            the_num++;
        }
        else
        {
            the_num--;
        }
        res.writeHead( 200 );
        res.end( ""+the_num );
    }
    if( req.url.indexOf( "get_number" ) >= 0 )
    {
        res.writeHead( 200 );
        res.end( ""+the_num );
    }
    else
    {
        res.writeHead( 404 );
        res.end( "Unknown URL: "+req.url );
    }
}
function generate(size)
{
  var map = [][];
  var items = size * 3;
  for (var t=0; t<items, t++)
  {
    x = getRandomInt(0, size)
    y = getRandomInt(0, size)
    map[x][y] = "xXx";
  }
  return map;

}
function showTable( table, res )
{
    var db = new sql.Database( 'players.sqlite' );
    db.all("SELECT * FROM " + table,
      function( err, rows ) {
        if (err != null)
        { console.log(err);
          return;
        }
        var size = 3 + rows.length;
        var map = generate(size)
        res.writeHead( 200 );
        //insert various stuff above the table
        var response_text = "<html><body><table><tbody><tr>";
        for( var i = 0; i < size; i++ )
        {
          response_text += "<tr>"
          for( var a = 0; a < size; a++)
          {
            //console.log(item + " " + rows[i][item];
            response_text += "<td>" + map[i][a] + "</td>";
          }
          response_text += "</tr>"
        }
        response_text += "</tbody></table></body>"
        //anything else at the bottom
        response_text +="</html>";
        res.end( response_text );
    } );
}

function serverFun( req, res )
{
    // console.log( req );
    console.log( "The URL: '", req.url, "'" );
    if( req.url === "/" || req.url === "/index.htm" )
    {
        req.url = "/index.html";
    }
    else if( req.url.indexOf( "play?" ) >= 0 )
    {
      showTable( "Players", res );
    }
    var file_worked = serveFile( req, res );

    if( file_worked )
        return;

    serveDynamic( req, res );
}

var server = http.createServer( serverFun );

server.listen( 8080 );