// Declare observatories array (PC)
let observatories = [];

// Call JQuery .ajax function to fetch array from observatories.json (PC)
// https://api.jquery.com/jquery.ajax/
$.ajax({
	// URL for ajax function (PC)
	url: "./observatories.json",
	// function called when ajax successfully retrieves observatories.json (PC)
	success: function(data) {
		// put resulting array into observatories variable (PC)
		observatories = data;
		console.log(observatories);
		setNumObservatoriesOnline(observatories);
		buildObservatoryThumbs(observatories);
	}
});

// iterate through observatories array and generate html for thumbnails (PC)
function buildObservatoryThumbs(observatories) {
	for (let i = 0; i < observatories.length; i++) {
		// declare htmlString var and add relevant html (PC)
		let htmlString = "<a class='obsThumb' href='#" + observatories[i].name + "'>";
		htmlString += "<img src='" + observatories[i].thumb + "'/>";
		htmlString += "<h1>" + observatories[i].name + "</h1>";
		htmlString += "<h2>" + observatories[i].location + "</h2>";
		htmlString += "</a>";

		// add htmlString to innerhtml of thumbholder (PC)
		document.getElementById("obsThumbHolder").innerHTML += htmlString;
	}
}

function setNumObservatoriesOnline(observatories) {
	document.getElementById("obsOnline").innerHTML = observatories.length;
}

function showVal(newVal){
    document.getElementById("rangeValHolder").innerHTML = newVal;
}

// -------- navbar effects on scroll (PC) adapted from: --------
// https://stackoverflow.com/questions/34551611/trying-to-fade-in-a-background-color-of-my-navigation-bar-after-i-scroll
// var for y position (PC)
let position = 0;
// var for nav element (PC)
let nav = $("nav");
// var for the jumbotron element (PC)
let jumbo = $("#homeJumbo");
// jquery "on scroll" function (PC)
$(document).scroll(function () {
	// update position var with scroll top value (PC)
	position = $(this).scrollTop();
	// if the viewport scrolls 80px down (PC)
	if (position > 80) {
		// add class fixed-top to nav element (PC)
		nav.addClass("fixed-top");
		// Kind of hacky, add spacing to top of jumbo when nav removed from flow (PC)
		jumbo.css('margin-top', '116px');
	} else {
		// if the position is < 80, remove fixed-top class (PC)
		nav.removeClass("fixed-top");
		// and remove the margin-top from the jumbotron (PC)
		jumbo.css('margin-top', '0');
	}
});
