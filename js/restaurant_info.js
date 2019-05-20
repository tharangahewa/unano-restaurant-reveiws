const imageSizesQuery = "(max-width: 320px) 280px,(max-width: 480px) 440px, (max-width: 800px) 440px, 800px";
let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Show map click event.
 */
document.getElementById('map-button').addEventListener('click', (event) => {
  event.preventDefault();
  document.getElementsByClassName('col-2')[0].classList.toggle("open");
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoidGhhcmFuZ2FoZXdhIiwiYSI6ImNqdmJuZTJsOTFvd3Y0ZG50bXVwYWJneHYifQ.LDz9c5ETQ_Rxq23X2XLsRw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  const pinIcon = document.createElement('i');
  pinIcon.classList.add("fas");
  pinIcon.classList.add("fa-map-marker-alt");
  address.appendChild(pinIcon);
  const span = document.createElement('span');
  span.innerHTML = restaurant.address;
  address.appendChild(span);

  const image = document.getElementById('restaurant-img');
  ImageHelper.fillImageElement(image, restaurant);
  image.className = 'restaurant-img';
  image.sizes = imageSizesQuery;


  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const div = document.createElement('div');

  //add name
  const name = document.createElement('p');
  const userIcon = document.createElement('i');
  userIcon.classList.add("fas");
  userIcon.classList.add("fa-user-circle");
  name.appendChild(userIcon);

  const nameSpan = document.createElement('span');
  nameSpan.innerHTML = review.name;
  name.appendChild(nameSpan);
  div.appendChild(name);

  //add rating
  div.appendChild(createRatingsHTML(review));

  //add date
  const date = document.createElement('p');
  const dateIcon = document.createElement('i');
  dateIcon.classList.add("far");
  dateIcon.classList.add("fa-calendar-alt");
  date.appendChild(dateIcon);

  const dateSpan = document.createElement('span');
  dateSpan.innerHTML = review.date;
  date.appendChild(dateSpan);
  div.appendChild(date);


  li.appendChild(div);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Create ratings HTML and add it to the webpage.
 */
createRatingsHTML = (review) => {
  const rating = document.createElement('p');
  rating.classList.add("stars");

  for (let i = 0; i < review.rating; i++) {
    const starIcon = document.createElement('i');
    starIcon.classList.add("rating-star");
    starIcon.classList.add("fa-star");
    starIcon.classList.add("fa");
    rating.appendChild(starIcon);
  }

  const emptyStars = 5 - review.rating;
  if (emptyStars > 0) {
    for (let i = 0; i < emptyStars; i++) {
      const starIcon = document.createElement('i');
      starIcon.classList.add("fa-star");
      starIcon.classList.add("far");
      rating.appendChild(starIcon);
    }
  }
  return rating;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
