function loadMapScenario() {
    let map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(43.2557, -79.871),
    })

  
    
    //current Location
    navigator.geolocation.getCurrentPosition(function (position) {
        var loc = new Microsoft.Maps.Location(
            position.coords.latitude,
            position.coords.longitude);

        //Add a pushpin at the user's location.
        let pinOptions = {
            title: "Current Location",
        }
        var pin = new Microsoft.Maps.Pushpin(loc, pinOptions);
    
        let infoboxDetails = {
            title: 'Current Location',
            description: 'Latitude: '+ loc.latitude+' Longitude: '+loc.longitude,
            visible: false,
        }
    
        let infobox = new Microsoft.Maps.Infobox(pin, infoboxDetails)
        infobox.setMap(map)
    
        Microsoft.Maps.Events.addHandler(pin, 'click', function () {
            let infoboxNewOptions = {
                location: loc,
                visible: true,
            }
            infobox.setOptions(infoboxNewOptions)
        })

        map.entities.push(pin);
        },function (error){
            let errMsg
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errMsg = 'User denied the request for geolocation'
                break
            case error.POSITION_UNAVAILABLE:
                errMsg = 'Location information is unavailable'
                break
            case error.TIMEOUT:
                errMsg = 'The request to get user location timed out'
                break
            case error.UNKNOWN_ERROR:
            default:
                errMsg = 'An unknown error occurred'
                break
        }
        $('#error').html(`Error: ${errMsg}`)
        })
    //Educations Locations
    let infoboxOptions = {
        visible: false,
    }
    let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    infobox.setMap(map)

    function success(librarylist) {
        for (let i = 0; i < librarylist.length; i++) {
            let location = new Microsoft.Maps.Location(
                librarylist[i].LATITUDE,
                librarylist[i].LONGITUDE
            )
    
            let pushpinOptions = {
                title: librarylist[i].NAME,
            }
            let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
            pushpin.metadata = {
                myTitle: librarylist[i].NAME,
                myDescription: librarylist[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
                librarylist[i].LATITUDE + "," + librarylist[i].LONGITUDE +
                ");" + "'>directions</a>" ,
                myCommunity: librarylist[i].COMMUNITY,
                myRanking: librarylist[i].RANKING
            }
    
            Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
            map.entities.push(pushpin)
        }
    }

    url = "GetList.php";
        fetch(url, { credentials: 'include' })
            .then(response => response.json())
            .then(success)

    // for (i = 0; i < education.length; i++) {
    //     let location = new Microsoft.Maps.Location(
    //         education[i].LATITUDE,
    //         education[i].LONGITUDE
    //     )

    //     let pushpinOptions = {
    //         title: education[i].NAME,
    //     }
    //     let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //     pushpin.metadata = {
    //         myTitle: education[i].NAME,
    //         myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //         education[i].LATITUDE + "," + education[i].LONGITUDE +
    //         ");" + "'>directions</a>" ,
    //         myCommunity: education[i].COMMUNITY,
    //         myCategory: education[i].CATEGORY,
    //     }

    //     Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)

    //     map.entities.push(pushpin)
    // }

    function pushpinClicked(e) {
        let infoboxNewOptions = {
            location: e.target.getLocation(),
            title: e.target.metadata.myTitle,
            description: e.target.metadata.myCommunity+"<br>"+e.target.metadata.myRanking+"<br>"+e.target.metadata.myDescription,
            visible: true,
        }
        infobox.setOptions(infoboxNewOptions)
    }

    $(document).ready(function () {
        
        //geocode query
    document.forms.mform.addEventListener("submit", function (event) {
        event.preventDefault();
        let name = document.forms.mform.name.value;
        let address = document.forms.mform.address.value;
        //Make a request to geocode New York, NY.
        geocodeQuery(address);
    })
    function geocodeQuery(query) {
        //If search manager is not defined, load the search module.
        if (!searchManager) {
            //Create an instance of the search manager and call the geocodeQuery function again.
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                searchManager = new Microsoft.Maps.Search.SearchManager(map);
                geocodeQuery(query);
            });
        } else {
            var searchRequest = {
                where: query,
                callback: function (r) {
                    //Add the first result to the map and zoom into it.
                    if (r && r.results && r.results.length > 0) {
                        var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
                        map.entities.push(pin);

                        map.setView({ bounds: r.results[0].bestView });
                    }
                },
                errorCallback: function (e) {
                    //If there is an error, alert the user about it.
                    alert("No results found.");
                }
            };

            //Make the geocode request.
            searchManager.geocode(searchRequest);
        }
    }
        //button Functions
    //     $('#elementary').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         if(education[i].CATEGORY == "Elementary School"){
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    //     }
    // })
    // $('#all').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    // })
    // $('#middle').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         if(education[i].CATEGORY == "Middle School"){
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    //     }
    // })
    // $('#secondary').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         if(education[i].CATEGORY == "Secondary School"){
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    //     }
    // })
    // $('#postSecondary').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         if(education[i].CATEGORY == "Post Secondary"){
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    //     }
    // })
    // $('#alternative').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         if(education[i].CATEGORY == "Alternative Education"){
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    //     }
    // })
    // $('#adult').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         if(education[i].CATEGORY == "Adult Learning"){
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    //     }
    // })
    // $('#section').click(function (event) {
    //     event.preventDefault();
    //     map.entities.clear();
    //     let infoboxOptions = {
    //         visible: false,
    //     }
    //     let infobox = new Microsoft.Maps.Infobox(map.getCenter(), infoboxOptions)
    //     infobox.setMap(map)
    
    //     for (i = 0; i < education.length; i++) {
    //         if(education[i].CATEGORY == "Section 23 Program"){
    //         let location = new Microsoft.Maps.Location(
    //             education[i].LATITUDE,
    //             education[i].LONGITUDE
    //         )
    
    //         let pushpinOptions = {
    //             title: education[i].NAME,
    //         }
    //         let pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions)
    //         pushpin.metadata = {
    //             myTitle: education[i].NAME,
    //             myDescription: education[i].ADDRESS+ "<br><a href='#' onclick='return directions(" +
    //             education[i].LATITUDE + "," + education[i].LONGITUDE +
    //             ");" + "'>directions</a>" ,
    //             myCommunity: education[i].COMMUNITY,
    //             myCategory: education[i].CATEGORY,
    //         }
    
    //         Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked)
    
    //         map.entities.push(pushpin)
    //     }
    //     }
    //})

    
   
})
function directions(latitude,longitude){
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        // Create an instance of the directions manager
        let directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map)

        directionsManager.clearAll();
        // Create waypoint
        var firstWaypoint = new Microsoft.Maps.Directions.Waypoint({
            location: new Microsoft.Maps.Location(loc.latitude, loc.longitude)
        })
        // Add first waypoint to map
        directionsManager.addWaypoint(firstWaypoint)

        // Create second waypoint
        var secondWaypoint = new Microsoft.Maps.Directions.Waypoint({
            location: new Microsoft.Maps.Location(latitude, longitude)
        })
        directionsManager.addWaypoint(secondWaypoint)


        // Set which element we want to display the directions in
        directionsManager.setRenderOptions({
            itineraryContainer: '#myDirections',
        })

        // Calculate directions
        directionsManager.calculateDirections()
    })
}
}
