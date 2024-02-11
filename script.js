function initMap() {
  // Initialize the map
  const map = L.map('map').setView([20, 0], 2);

  // Load OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Fetch data from cards.json
  fetch('cards.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(cardsData => {
      // Iterate through each location
      cardsData.locations.forEach(location => {
        let iconUrl;
        if (location.title === 'your location') {
          iconUrl = 'marker-icon-2x.png';
        } else {
          iconUrl = 'leaf-red.png';
        }

        const currentIcon = L.icon({
          iconUrl: iconUrl,
          iconSize: [38, 95],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76]
        });

        const marker = L.marker([location.latitude, location.longitude], { icon: currentIcon }).addTo(map);

        // Create a popup with title, latitude, longitude, and summary
        const popupContent = `<h3>${location.title}</h3>
                             <p>Latitude: ${location.latitude}</p>
                             <p>Longitude: ${location.longitude}</p>
                             <p>${location.summary}</p>`;

        marker.bindPopup(popupContent);
      });
    })
    .catch(error => console.error('Error loading JSON:', error));

  // Update coordinates on map move
  map.on('move', updateCoordinates);
  updateCoordinates(); // Initial update

  function updateCoordinates() {
    const center = map.getCenter();
    const latitude = center.lat.toFixed(6);
    const longitude = center.lng.toFixed(6);
    document.getElementById('coordinates').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;
  }
}

// Call the initMap function when the DOM is ready
document.addEventListener('DOMContentLoaded', initMap);
