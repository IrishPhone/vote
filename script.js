
const header = new Headers({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*'
})

const url = new URL('https://sf-pyw.mosyag.in/sse/vote/stats')
const ES = new EventSource(url, header)

ES.onerror = error => {
    ES.readyState ? progress.textContent = "Some error" : null;
}

ES.onmessage = message => {

    let o = JSON.parse(message.data);

		    // magic with Math.max.apply(null, Array) explained:
		    // https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
    
    let maxVal = Math.max.apply( null, [o.cats, o.parrots, o.dogs] );
    
    //normalize to 100
    let coe = 100 / maxVal;

	$("#cats").text(`${o.cats}`);
	$("#cats").css('width', `${o.cats * coe}%`);
	$("#cats").prop('aria-valuenow', `${o.cats * coe}%`);
	
	$("#dogs").text(`${o.dogs}`);
	$("#dogs").css('width', `${o.dogs * coe}%`);
	$("#dogs").prop('aria-valuenow', `${o.dogs * coe}%`);

	$("#parrots").text(`${o.parrots}`);
	$("#parrots").css('width', `${o.parrots * coe}%`);
	$("#parrots").prop('aria-valuenow', `${o.parrots * coe}%`);
    
    if ( !( $("#results").css('display') == 'none' || $("#results").css("visibility") == "hidden") ){
    // element is hidden
        $("#leading").text(`${o.cats + o.parrots + o.dogs} people voted`);
    }

}

function showResults() {
	$("#show-results-btn").hide();
	$("#results").show();
	$("#title").text("Results");
}

function buttonPress(e) {
	e.preventDefault();
	let u = $(e.target).parent().attr("formaction");
	$(".btn").hide();
	$("#title").text("Thank you");
	$("#leading").text("Your choice is accepted.");
	$("#show-results-btn").show();
	postData(u, {}) 
  		.then((data) => {
    		console.log(data); // JSON data parsed by `response.json()` call
  		});
}


async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'no-cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'omit', // include, *same-origin, omit
		headers: {
			//'Content-Type': 'application/json'
			'Content-Type': 'application/x-www-form-urlencoded'
			//'Access-Control-Allow-Credentials': true, 
	  		//'Access-Control-Allow-Origin': 'https://sf-pyw.mosyag.in'
			},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *client
		body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		
        return true;
		//return await response.json(); // parses JSON response into native JavaScript objects
}

function init() {
	//
	$("#title").text("Voting");
	$("#leading").text("Choose a domestic pet you'd prefer:");
	$("#results").hide();
	$("#show-results-btn").hide();
	$(".btn").on('click', buttonPress);
}

$(document).ready(init);
