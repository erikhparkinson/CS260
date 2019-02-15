document.getElementById("getJoke").addEventListener("click", function(event) {
  event.preventDefault();
  const url = "https://api.chucknorris.io/jokes/random" ;
fetch(url)
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json);
    let results = "<center><h1>" + json.value +  "</h1>";
    results += "<img src=" + json.icon_url + ">";
    document.getElementById("joke").innerHTML = results;
  });
});
