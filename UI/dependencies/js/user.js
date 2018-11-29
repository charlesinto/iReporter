document.addEventListener("DOMContentLoaded", function(event) {
    toggleSection();
  var js_file = document.createElement('script');
  js_file.type = 'text/javascript';
  js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDQgA7Rjq-5S62KnkqtYsw-4dMP-aYuUxo&callback=initMap';
  document.getElementsByTagName('head')[0].appendChild(js_file);
  setUpEvents();
    
})
// google.maps.event.addDomListener(window, "load", initMap);
// google.maps.event.addListenerOnce(map, 'idle', function(){
//     window.initMap = function(){
//         // The location of Uluru
//         var uluru = {lat: -25.344, lng: 131.036};
//         // The map, centered at Uluru
//         var map = new google.maps.Map(
//             document.getElementById('map'), {zoom: 4, center: uluru});
//         // The marker, positioned at Uluru
//         var marker = new google.maps.Marker({position: uluru, map: map});
//     }
// navigator.geolocation.getCurrentPosition(function(location) {
//     console.log(location.coords.latitude);
//     console.log(location.coords.longitude);
//     console.log(location.coords.accuracy);
//   });
// });



const toggleSection = () => {
    Array.from(document.getElementsByClassName('link')).forEach( link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            Array.from(document.getElementsByClassName('active-link')).forEach(link => {
                link.classList.toggle('active-link')
            })
            const linkId = e.target.hash.split('#')[1];
            const elementClasses = [...e.target.classList]
            if(!(elementClasses.includes('active-link'))){
                e.target.classList.toggle('active-link');
                Array.from(document.getElementsByClassName('active')).forEach(section => {
                    section.classList.toggle('active')
                })
                document.getElementById(linkId).classList.toggle('active');
            }
            
        })
    })
}

const mapMaker = () => {
    console.log('here')
    var myLatLng = {lat: 6.465422, lng: 3.406448};
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatLng
      });
      const marker = new google.maps.Marker({
        position: myLatLng,
        map: map
      });
      marker.setMap(map);
}

window.initMap =  () => {
    // The location of Uluru
    var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    var map1 = new google.maps.Map(
        document.getElementById('map1'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker1 = new google.maps.Marker({position: uluru, map: map1});
    var map2 = new google.maps.Map(
        document.getElementById('map2'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker2 = new google.maps.Marker({position: uluru, map: map2});
    var map3 = new google.maps.Map(
        document.getElementById('map3'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker3 = new google.maps.Marker({position: uluru, map: map3});
    var map4 = new google.maps.Map(
        document.getElementById('map4'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker4 = new google.maps.Marker({position: uluru, map: map4});
    // var map5 = new google.maps.Map(
    //     document.getElementById('map5'), {zoom: 4, center: uluru});
    // // The marker, positioned at Uluru
    // var marker5 = new google.maps.Marker({position: uluru, map: map5});
    // var map6 = new google.maps.Map(
    //     document.getElementById('map6'), {zoom: 4, center: uluru});
    // // The marker, positioned at Uluru
    // var marker6 = new google.maps.Marker({position: uluru, map: map6});
   
}

const setUpEvents = () => {
    Array.from(document.getElementsByClassName('logout')).forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location = window.origin;
        })
    })
}