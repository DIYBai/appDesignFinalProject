var fs   = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3');

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
    else if( req.url.indexOf( "play?" ) >= 0 )
    {
      addPlayer(req, res);
      showTable( "Players", res );
      console.log("players have been shown");
    }
    else if( req.url.indexOf( "get_number" ) >= 0 )
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
//we need a function to clear the database

function addPlayer( req, res )
{
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'players.sqlite' );
    var name = kvs[ 'name_input' ];
    var x = 3;
    var y = 3;
    db.run( "INSERT INTO Players(Name, xpos, ypos) VALUES ( ?, ?, ? ) ", name, x, y);
    /*db.run( "INSERT INTO Players(Name) VALUES ( ? ) ", name,
            function( err ) {
                if( err === null )
                {
                    res.writeHead( 200 );
                    res.end( "<html><body>added name</body>" );
                }
                else
                {
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "<html><body>error</body>" );
                }
            } );*/
}
function generate(size)
{
  var map = [];
  for (var i=0; i<size; i++)
  {
    map.push([]);
    for (var a=0; a<size; a++)
    {
      map[i][a]= "";
    }
  }
  var items = Math.floor(size * size/5);
  for (var t=0; t<items; t++)
  {
    x = getRandomInt(0, size)
    y = getRandomInt(0, size)
    map[x][y] = "xXx";
  }
  return map;
}
//this will draw the players from the database into the map
function drawPlayers(map)
{
  //var player_map
  var db = new sql.Database( 'players.sqlite' );
  db.all("SELECT * FROM " + table,
    function( err, rows ) {
      if (err != null)
      { console.log(err);
        return;
      }
      for( var i = 0; i < rows; i++ )
      {
        x= rows[i].xpos;
        y = rows[i].ypos
        map[x][y] += rows[i].name;
        //players are added into array from database
      }
      }
  } );

}
function addPlayers(map)
{
  var center = map.length/2

}
function showTable( table, res )
{
    //this code can probably have its seqlite stuff removed
    var db = new sql.Database( 'players.sqlite' );
    db.all("SELECT * FROM " + table,
      function( err, rows ) {
        if (err != null)
        { console.log(err);
          return;
        }
        var size = 3 + rows.length;
        var map = generate(size);
        res.writeHead( 200 );
        //insert various stuff above the table
        var response_text = "<html><body><table ><tbody><tr>";
        for( var i = 0; i < size; i++ )
        {
          response_text += "<tr>"
          for( var a = 0; a < size; a++)
          {
            //console.log(item + " " + rows[i][item];
            response_text += "<td width = '80' height = '80' style='border-style: solid; text-align:center'>" + map[i][a] + "</td>";
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
    var file_worked = serveFile( req, res );

    if( file_worked )
        return;

    serveDynamic( req, res );
}

var server = http.createServer( serverFun );

server.listen( 8080 );
