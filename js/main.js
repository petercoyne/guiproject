// Declare observatories array (PC)
let observatories = [];
let cart = [];

//localStorage.setItem('user', JSON.stringify(person));

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
		setNumObservatoriesOnline();
		buildObservatoryThumbs();
		initCart();
		populatePrices();
	}
});

// iterate through observatories array and generate html for thumbnails (PC)
function buildObservatoryThumbs() {
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

function setNumObservatoriesOnline() {
	document.getElementById("obsOnline").innerHTML = observatories.length;
}

function populatePrices() {
	for (let i = 0; i < observatories.length; i++) {
		document.getElementById("price" + i).innerHTML = observatories[i].price;
		document.getElementById("badge" + i).innerHTML = "€" + observatories[i].price;
		observatories[i].cost = observatories[i].price; // initial cost = price
	}
}

function setHours(observatory, hours){
    document.getElementById("hoursHolder" + observatory).innerHTML = hours;
	let cost = observatories[observatory].price * hours;
	document.getElementById("badge" + observatory).innerHTML = "€" + cost;
	observatories[observatory].numHours = hours;
	observatories[observatory].cost = cost;
}

function initCart() {
	console.log("init cart");
	if (localStorage.cart) {
		cartStorageToArray();
		updateCartIcon();
		populateCartModal();
	}
}

function updateCartIcon() {
	document.getElementById("navBadge").innerHTML = cart.length;
}

function cartArrayToStorage() {
	localStorage.cart = JSON.stringify(cart);
}

function cartStorageToArray() {
	console.log("parsing storage");
	cart = JSON.parse(localStorage.cart);
}

function populateCartModal() {
	$("#cartContents").html("");
	for (let i = 0; i < cart.length; i++) {
		let obsID = cart[i][0];
		$("#cartContents").append("<tr>");
		$("#cartContents").append("<td>" + i + "</td>");
		$("#cartContents").append("<td>" + observatories[obsID].name + "</td>");
		$("#cartContents").append("<td>" + i + "</td>");
		$("#cartContents").append("<td>" + i + "</td>");
		$("#cartContents").append("<td>" + i + "</td>");
		$("#cartContents").append("</tr>");
	}
}

$(".addToCartBtn").click(function() {
	let obsID = this.getAttribute("data-obs-id");
	cart.push([obsID, observatories[obsID].numHours]);
	updateCartIcon();
	populateCartModal();
	cartArrayToStorage();
});

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
		// if the scroll position is < 80, remove fixed-top class (PC)
		nav.removeClass("fixed-top");
		// and remove the margin-top from the jumbotron (PC)
		jumbo.css('margin-top', '0');
	}
});
