//Dominic Cerminara: dcermina
//Nikhil Joshi: nikhilj
//Sachin Hegde: shegde

//Declare globals for app
var saveSearch = [];
var counter = 0;
var currentSearch = new Object();
var defaultHeight = 100; 

var canvas = document.getElementById("dataCanvas");
var ctx = canvas.getContext("2d");

var intervalId;
var intervalId;
var timerDelay = 50;
var rectLeft = 0;
var rectLeft2 = 0;
var rectLeft3 = 0;
var rectLeft4 = 0;
var rectLeft5 = 0;
var rectLeft6 = 0;

var weight = [];
var artists = [];
var quit = false; 

//Function for responsive header (toggle visibility for credits)
$("#header").click(function() {
	if($("#credits").hasClass('visible'))
	{
		$("#credits").removeClass('visible');
		$("#credits").addClass('invisible');
		$("#arrow").removeClass('upArrow');
		$("#arrow").addClass('downArrow');
	}
	else
	{
		$("#credits").removeClass('invisible');
		$("#credits").addClass('visible');
		$("#arrow").removeClass('downArrow');
		$("#arrow").addClass('upArrow');
	}
});

//Send JSONP Request when submit is clicked
$("#artistForm").submit(function() {
    
    rectLeft = 10;
    rectLeft2 = 10;
    rectLeft3 = 10;
    rectLeft4 = 10;
    rectLeft5 = 10;
    rectLeft6 = 10;
    
    //Clear old data
    for (i = 0; i < 6; i++)
    {
      weight[i] = 0;
      artists[i] = "";
    }
    ctx.clearRect ( 0 , 0 , 650, 400 );
    $('#dataCanvas').hide();

    //reset fields                                 
    $("#error").html("");
    var searched = $('#artist').val(); 
    if (searched === ''){
    	$('#artist').css('background-color','#F5DADA');
    	return false;
    }
    $('#artist').css('background-color','white');

    currentSearch.searchString = searched;
    
    //ADDS RECENT SEARCH TO DOM
    var inner = document.createElement('a'); 
    inner.id = 'number' + counter; 
    inner.href = '#'; 
    inner.innerHTML = searched;
    var recentText = document.getElementById('recentText');
    recentText.appendChild(inner);
    inner.addEventListener('click',recentSearch,false);

    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0',
        data: {
            method: 'artist.getInfo',
            autocorrect: '1', //Turns on autocorrecting
            artist: $("#artist").val(),
            format: 'json',
            api_key: '028a648a94b5ca3a256ed241d7952a20',
            callback: "getTag"
        },
        dataType: 'jsonp'
    }); 
    return false;
});

//Send ajax request for artist tags 
function getTag(result) {
    if(result.error != null) //if artist entered could not be found
    {
    	$('#dataCanvas').hide();
    	$('#topCharts').html('');
    	$('#topTracks').html(''); 
        $("#error").html("<p>The artist you requested could not be found. Please try again.</p>");
        resizeAll();
    }
    else
    {
    	var tag; 
    	if (!(result.artist.tags.tag)) {resizeAll(); return false;}
        var tag = result.artist.tags.tag[0].name;
        currentSearch.tag = tag; 
        $.ajax({
            url: 'http://ws.audioscrobbler.com/2.0',
            data: {
                method: 'tag.getTopTracks',
                limit: '5',
                tag: tag,
                format: 'json',
                api_key: '028a648a94b5ca3a256ed241d7952a20',
                callback: "getTracks"
            },
            dataType: 'jsonp'
        });
    }   
};

//Send ajax request for top tracks
function getTracks(result) {
    var newHeight = 0;
    if(result.error != null) //if artist entered could not be found
    {
    	$('#dataCanvas').hide();
    	$('#topCharts').html('');
    	$('#topTracks').html(''); 
        $("#error").html("<p>The artist you requested could not be found. Please try again.</p>");
        resizeAll();
    }
    else
    {
        var tracks = result.toptracks.track;
        currentSearch.tracks = tracks; 

        saveSearch[counter] = currentSearch; 

		$('#topTracks').html(''); 		
		$('#topCharts').html(''); 

		//Add to DOM
		$('#topTracks').html('<h2>Top tracks for this genre:</h2>')
    	for (var i = 0; i < currentSearch['tracks'].length;i++){
    		$('#topTracks').html($('#topTracks').html() + '<p>' + currentSearch['tracks'][i]['artist']['name'] + ' : ' +
    		currentSearch['tracks'][i]['name'] + '</p>');
        }

		$.ajax({
            url: 'http://ws.audioscrobbler.com/2.0',
            data: {
                method: 'tag.getWeeklyArtistChart',
                limit: '6',
                tag: currentSearch.tag,
                format: 'json',
                api_key: '028a648a94b5ca3a256ed241d7952a20',
                callback: "getWeeklyChart"
            },
            dataType: 'jsonp'
        });

    }
};

//Display top weekly tracks
function getWeeklyChart(result){

	currentSearch.weeklyChart = result['weeklyartistchart']['artist'];

	
	$('#topCharts').html('<h2>Top artists this week:</h2>');
	for (var i = 0; i < currentSearch.weeklyChart.length;i++){
    	$('#topCharts').html($('#topCharts').html() + '<div class="artistPicDiv"><img src="' + currentSearch.weeklyChart[i]['image'][2]['#text'] + '"></img>' + '<p>' + currentSearch.weeklyChart[i]['name'] + '</p></div>');
    	weight[i] = Math.round((currentSearch.weeklyChart[i].weight/ currentSearch.weeklyChart[0].weight)*560) ;
    	artists[i] = currentSearch.weeklyChart[i].name;
    }
	$('#dataCanvas').show();

	$('#dataCanvas').focus();
    run();
    setTimeout(function(){
    				for(var i = 0; i < 6; i++)
    				{
    					ctx.fillText(artists[i], 30, ((45)+i*60) );
    				}
    				
    }, 1000);
    $('#topCharts').html($('#topCharts').html() + '<h2>Artist popularity:</h2>');
    resizeAll();
    counter++; 
    currentSearch = new Object(); 
}

//Find largest of AppContent and RecentSearch divs, and resize accordingly
function resizeAll(){
	var newHeight = 0;
	var recentHeight = $('#title').height() + $('#recentText').height();
	if (recentHeight < defaultHeight) recentHeight = defaultHeight;
	var appHeight = $('#content').height();
	if (appHeight < defaultHeight) appHeight = defaultHeight;
	if (appHeight > recentHeight){
		newHeight = appHeight;
	}
	else{ 
		newHeight = recentHeight + 20;
	}
	$('#appBox').css({ height:newHeight });
	$('#recent').css({ height:newHeight });
	$('#divider').animate({ height:newHeight+15 }, 500);
}

//Draw canvas graph! Awwyeah! 
function redrawAll() {
    ctx.fillStyle = '#B0ACAE';
    ctx.font = '14px Raleway dots';

    ctx.fillRect(rectLeft6, 20, 40, 40);
    ctx.fillRect(rectLeft5, 80, 40, 40);
    ctx.fillRect(rectLeft4, 140, 40, 40);
    ctx.fillRect(rectLeft3, 200, 40, 40);
    ctx.fillRect(rectLeft2, 260, 40, 40);
    ctx.fillRect(rectLeft, 320, 40, 40);
    
    ctx.fillStyle = '#76767A';
    ctx.fillText("Meh", 90, 390);
    ctx.fillText("Sweet", 240, 390);
    ctx.fillText("Hot!", 390, 390);
    ctx.fillText("Chart-topper!", 550, 390);
       
}

//Move canvas elements 
function onTimer() {
    if (quit) return;
    
    if(rectLeft < weight[5])
    {
        rectLeft = (rectLeft + 10) % 562;
    }
    if(rectLeft2 < weight[4])
    {
        rectLeft2 = (rectLeft2 + 10)%562;
    }
    if(rectLeft3 < weight[3])
    {
        rectLeft3 = (rectLeft3 + 10) % 562;
    }
    if(rectLeft4 < weight[2])
    {
        rectLeft4 = (rectLeft4 + 10)%562;
    }
    if(rectLeft5 < weight[1])
    {
        rectLeft5 = (rectLeft5 + 10) % 562;
    }
    if(rectLeft6 < weight[0])
    {
        rectLeft6 = (rectLeft6 + 10)%562;
    }
    
    
    redrawAll();
}

function run() 
{
    canvas.setAttribute('tabindex','0');
    canvas.focus();
    intervalId = setInterval(onTimer, timerDelay);
}

//Enable recent search links
function recentSearch() {
	$('#artist').val($(this).text());
	$('#artistForm').submit();
}