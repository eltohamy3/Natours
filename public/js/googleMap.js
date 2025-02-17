// Define initMap globally so it's accessible when Google Maps API loads
export const  initMap =()=> {
  console.log('Google Map Initialized');
  
  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  console.log(locations);

  // Initialize the Google Map
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: locations[0].coordinates[1], lng: locations[0].coordinates[0] }, // Default center location
    zoom: 7,
  });
  
  // Loop through the locations and create markers
  locations.forEach(location => {
    const marker = new google.maps.Marker({
      position: { lat: location.coordinates[1], lng: location.coordinates[0] },
      map: map,
      title: location.description
    });

    // Add an info window for each marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${location.description}</h3>`
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });
}

