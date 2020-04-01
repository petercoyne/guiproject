// declare observatories array (PC)
let observatories = [
    ["Palomar", 		"San Diego, CA", 	"thumb-palomar.jpg"],
    ["Hobby-Eberly", 	"Austin, TX", 		"thumb-hobby.jpg"],
    ["Kitt Peak", 		"Tucson, AZ", 		"thumb-kittpeak.jpg"],
];

// Add observatory to dom function (PC)
function addObservatoryThumb(thumbHTML) {
	// set innerhtml of thumbholder to result from iteration below (PC)
	document.getElementById("observatoriesThumbHolder").innerHTML += thumbHTML;
}

// iterate through observatories array and generate html for thumbnails (PC)
for (let i = 0; i < observatories.length; i++) {
	// put observatory name from array into var (PC)
	let obsName = observatories[i][0];
	// put observatory location from array into var (PC)
	let obsLocation = observatories[i][1];
	// put observatory thumnail name from array into var (PC)
	let obsImage = observatories[i][2];

	// declare htmlString var and add relevant html (PC)
	let htmlString = "<a class='obsThumb' href='#" + obsName + "'>";
	htmlString += "<img src='images/" + obsImage + "'/>";
	htmlString += "<h1>" + obsName + "</h1>";
	htmlString += "<h2>" + obsLocation + "</h2>";
	htmlString += "</a>";

	// call addObservatory function (PC)
	addObservatoryThumb(htmlString);
}

// manage navbar on scroll (PC) adapted from
// https://stackoverflow.com/questions/34551611/trying-to-fade-in-a-background-color-of-my-navigation-bar-after-i-scroll
// var for y position (PC)
let position = 0;
// var for nav element (PC)
let nav = $("nav");
// var for the jumbotron element (PC)
let jumbo = $("#homeJumbo");
// jquery scroll function (PC)
$(document).scroll(function () {
	// update position var with scroll top value (PC)
	position = $(this).scrollTop();
	// if the viewport scrolls 80px down (PC)
	if (position > 80) {
		// add class fixed-top to nav element (PC)
		nav.addClass("fixed-top");
		// Kind of hacky, spacing top of jumbo when nav removed from flow (PC)
		jumbo.css('margin-top', '116px');
	} else {
		// if the position is < 80, remove fixed-top class (PC)
		nav.removeClass("fixed-top");
		// and remove the margin-top from the jumbotron (PC)
		jumbo.css('margin-top', '0');
	}
});
