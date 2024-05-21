const NodeGeocoder = require("node-geocoder");

// Configure options for NodeGeocoder
const options = {
  provider: process.env.GEOCODER_PROVIDER, // Geocoding provider (e.g., 'google', 'here', 'openstreetmap')
  httpAdapter: "https", // Use HTTPS for HTTP requests
  apiKey: process.env.GEOCODER_API_KEY, // API key for the geocoding service
  formatter: null, // Do not format the geocoding response
};

// Create a new instance of NodeGeocoder with the specified options
const geocoder = NodeGeocoder(options);

// Export the geocoder instance for use in other modules
module.exports = geocoder;
