// Start with the initial post
let counter = 0;

// Load 10 posts at a time
const quantity = 10;


document.addEventListener('DOMContentLoaded', () => {

  // Toggle between views using navbar
  document.querySelector('#network-logo-link').addEventListener('click', () => load_page('all'));
  document.querySelector('#all-posts-link').addEventListener('click', () => load_page('all'));


  // By default, load all posts
  load_page('all');

  let usernames = document.querySelectorAll('h5');
  usernames.forEach((username) => {
    username.addEventListener('click', () => load_page(username.innerHTML));
  });
});






function load_page(view) {

  // Reset post counter 
  counter = 0;

  // Get page title
  let title = document.querySelector('h1');

  // Get user profile container
  let userProfile = document.querySelector('.user-profile-container');

  // Reset paginator
  let paginator = document.querySelector('.pagination-container');
  paginator.style.display = 'none';

  if (view === 'all') { 

    // Update page title
    title.innerHTML = 'All';

    // Hide user profile container
    userProfile.style.display = 'none';

  } else { 

    // Update page title
    title.innerHTML = '';

    // Show user profile container
    userProfile.style.display = 'block';

    // Populate user profile with follower/following count
    // populate_profile_header(view);
  }

  // Get page of posts;
  insert_posts(view);

  // // Allow buttons to swap pages, and update counter
  // if (document.querySelector('#previous')) {
  //   document.querySelector('#previous').addEventListener('click', () => {
  //     counter = counter - quantity;
  //     insert_posts(view);
  //   });
  // }

  // if (document.querySelector('#next')) {
  //   document.querySelector('#next').addEventListener('click', () => {
  //     counter = counter + quantity;
  //     insert_posts(view);
  //   });
  // }


}

// Load the user profile header
function populate_profile_header(view) {
  return;
}

// Load next set of posts for the page
function insert_posts(view) {

  // Reset posts container
  let container = document.querySelector('.posts-container');
  container.innerHTML = '';

  // Reset pagination
  document.querySelector('#previous').removeEventListener('click', get_previous_posts);
  document.querySelector('#next').removeEventListener('click', get_next_posts);

  // Set start post numbers
  let start = counter; // 0
  let end = start + quantity; // 10

  // Get post data and create posts
  fetch(`/posts/${view}?start=${start}&end=${end}`)
  .then(response => response.json())
  .then(data => {

    let isLast = data.isLast;
    let posts = data.posts;
    let likes = data.likes;

    for (let i = 0; i < posts.length; i++) {
      create_post(posts[i], likes[i]);
    }
    
    // Set pagination using the isLast data
    set_pagination(isLast, view);
  });
}

function create_post(postData, likes) {

  // Get posts container
  let container = document.querySelector('.posts-container');

  // Create general card
  let card = document.createElement('div');
  card.classList.add('card', 'mt-3', 'mb-3');
  card.setAttribute('id', `${postData.id}`);

  // Create card body
  let body = document.createElement('div');
  body.classList.add('card-body');
  card.appendChild(body);

  // Create body's header
  let header = document.createElement('div');
  header.classList.add('d-flex', 'justify-content-between');
  body.appendChild(header);

  // Add title to header
  let username = document.createElement('h5');
  username.innerHTML = postData.author;
  // username.addEventListener('click', () => load_page(postData.author));
  header.appendChild(username);

  // Create body's main content
  let textContainer = document.createElement('div');
  textContainer.classList.add('mb-3');
  let text = document.createElement('p');
  text.classList.add('card-text');
  text.innerHTML = postData.body;
  textContainer.appendChild(text);
  body.appendChild(textContainer);

  // Create body's metadata
  let meta = document.createElement('h6');
  meta.classList.add('card-subtitle', 'mb-2', 'text-muted');
  let timestamp = document.createElement('span');
  timestamp.innerHTML = `${postData.timestamp} | `;
  meta.appendChild(timestamp);
  let likeCount = document.createElement('span');
  likeCount.classList.add('likes');
  likeCount.innerHTML = `${likes.count} likes`;
  meta.appendChild(likeCount);
  body.appendChild(meta);

  // Insert card
  container.appendChild(card);
}

function set_pagination(isLast, view) {

  // Switch on pagination
  let paginator = document.querySelector('.pagination-container');
  paginator.style.display = 'block';

  // Get previous and next buttons, and reset
  let previousBtn = document.querySelector('#previous');
  previousBtn.disabled = true;
  let nextBtn = document.querySelector('#next');
  nextBtn.disabled = true;

  // Enable buttons
  if (counter !== 0) {
    // Enable previous button
    previousBtn.disabled = false;
    if (!isLast) {
      // Enable next button
      nextBtn.disabled = false;
    } 
  } else if (counter === 0 && !isLast){
    // Enable next button only
    nextBtn.disabled = false;
  } else {
    // Remove paginator
    paginator.style.display = 'none';
  }

  // Allow buttons to swap pages, and update counter
  if (document.querySelector('#previous')) {
    document.querySelector('#previous').addEventListener('click', get_previous_posts());
  }

  if (document.querySelector('#next')) {
    document.querySelector('#next').addEventListener('click', get_next_posts());
  }
}

// Update counter
function get_previous_posts() {
  counter -= quantity;
  view = document.querySelector('h1').innerHTML.toLowerCase();
  insert_posts(view);
}

function get_next_posts() {
  counter += quantity;
  view = document.querySelector('h1').innerHTML.toLowerCase();
  insert_posts(view);
}

// // Show rest of the 'all' view
// function get_all() {

//   // Reset posts container
//   let container = document.querySelector('.posts-container');
//   container.innerHTML = '';

//   // Get all posts and all post likes
//   let set = [];
//   fetch('/posts/all')
//   .then(response => response.json())
//   .then(data => {

//     // Get 10 posts based on counter
//     let len = data.length;
//     let stop = 0;
//     if (len <= limit) {
//       // This set of posts can fit on one page
//       stop = len;
//     } else if (start + limit > len) {
//       // This set of posts can fit on one page
//       stop = len;
//     } else if (start + limit <= len) { // posts length is greater than 10
//       stop = counter + limit;
//     } 

//     // return fetch for the likes
//   })
//   .then(() => {

//     // Get the likes for each post and append to the dict
//   });
// }




// // view could either be all or loading the page of a user profile that was clicked on
// // view can either be 'all' or a profile's username
// function load_page(view) {

//   // Get page title
//   let title = document.querySelector('h1');

//   // Get user profile container
//   let userProfile = document.querySelector('.user-profile-container');

//   if (view === 'all') { // Show all posts

//     // Update page title
//     title.innerHTML = 'All Posts';

//     // Switch out of user profile container
//     userProfile.style.display = 'none';

//   } else { // Show a user profile page

//     // Update page title
//     title.innerHTML = '';

//     // Switch to user profile container
//     userProfile.style.display = 'block';

//     // Show profile's following and follower info
//     get_user_profile(view);
//   }

//   // // Retrieve appropriate posts and store globally
//   // get_posts(view);
// }

// function get_user_profile(username) {

//   // Show the username of user profile in view
//   let title = document.querySelector('.user-profile-container h2');
//   title.innerHTML = username;

//   // Show number of followers and following
//   fetch(`/follows/${username}/all`)
//   .then(response => response.json())
//   .then(data => {

//     let userCount = 0;

//     let userTypes = ['followers', 'following'];

//     userTypes.forEach(users => {

//       // Get the number of followers or following 
//       if (users === 'followers') {
//         userCount = data.followers.length;
//       } else if (users === 'following') {
//         userCount = data.following.length;
//       }

//       // Get user profile stat element and update
//       let userType = document.querySelector(`.${users} h5`);
//       if (userCount > 0) {
//         userType.innerHTML = userCount;
//       } else {
//         userType.innerHTML = 0;
//       }
//     });
//   })
//   .then(insert_posts(username)); // Insert the posts created by a username
// }

// function insert_posts(view) {
  
//   // Reset post counter and global posts
//   globalPosts = [];
//   postCounter = 0;

//   // Reset posts container
//   let container = document.querySelector('.posts-container');
//   container.innerHTML = '';

//   // Filter through all posts
//   fetch('/posts')
//   .then(response => response.json())
//   .then(data => {

//     // Get ten posts for the first page
//     let currentCount = 0;

//     // Go through each post in reverse order
//     for (let i = data.length - 1; i >= 0; i--) {
//       let postData = data[i];

//       if (view !== 'all' && postData.author === view) {
//         // Add to global user profile posts
//         globalPosts.push(postData);

//         if (currentCount < limit) {
//           // Create and insert the post
//           create_card(postData);

//           currentCount++;
//         }
//       }
//     }
//   });
// }

// // function insert_posts(view) {

// //   // Reset post counter and global posts
// //   globalPosts = [];
// //   postCounter = 0;

// //   // Get all existing posts
// //   fetch('/posts')
// //   .then(response => response.json())
// //   .then(data => {

// //     // Go through each post in reverse order
// //     for (let i = data.length - 1; i >= 0; i--) {
// //       let postData = data[i];

// //       if (view !== 'all' && postData.author === view) {
// //         // Add to global user profile posts
// //         globalPosts.push(postData);
// //       } else if (view === 'all') {
// //         // Add to global all posts
// //         globalPosts.push(postData);
// //       }
// //     }

// //     // // Insert ten posts based on the post counter
// //     // insert_posts();
// //   }); 
// // }

// // function get_posts(view) {

// //   // Reset post counter and global posts
// //   globalPosts = [];
// //   postCounter = 0;

// //   // Get all existing posts
// //   fetch('/posts')
// //   .then(response => response.json())
// //   .then(data => {

// //     // Go through each post in reverse order
// //     for (let i = data.length - 1; i >= 0; i--) {
// //       let postData = data[i];

// //       if (view !== 'all' && postData.author === view) {
// //         // Add to global user profile posts
// //         globalPosts.push(postData);
// //       } else if (view === 'all') {
// //         // Add to global all posts
// //         globalPosts.push(postData);
// //       }
// //     }

// //     // // Insert ten posts based on the post counter
// //     // insert_posts();
// //   })
// //   .then(insert_posts());
// // }

// function get_posts() {

//   // Reset posts container
//   let container = document.querySelector('.posts-container');
//   container.innerHTML = '';

//   let start = postCounter;
//   let stop = 0;
//   if (globalPosts.length <= limit) {
//     // This set of posts can fit on one page
//     stop = globalPosts.length;
//   } else if (start + limit > globalPosts.length) {
//     // This set of posts can fit on one page
//     stop = globalPosts.length;
//   } else if (start + limit <= globalPosts.length) { // global posts length is greater than 10
//     stop = start + limit;
//   } 

//   // Create a post and insert for each post in this page's set
//   for (let i = start; i < stop; i++) {
//     create_card(globalPosts[i]);
//   }
// }

// function create_card(postData) {

//   // Get posts container
//   let container = document.querySelector('.posts-container');

//   // Create general card
//   let card = document.createElement('div');
//   card.classList.add('card', 'mt-3', 'mb-3');

//   // Create card body
//   let body = document.createElement('div');
//   body.classList.add('card-body');
//   card.appendChild(body);

//   // Create body's header
//   let header = document.createElement('div');
//   header.classList.add('d-flex', 'justify-content-between');
//   body.appendChild(header);

//   // Add title to header
//   let username = document.createElement('h5');
//   username.innerHTML = postData.author;
//   username.addEventListener('click', () => load_page(postData.author));
//   header.appendChild(username);

//   // Create body's main content
//   let textContainer = document.createElement('div');
//   textContainer.classList.add(`id-${postData.id}`, 'mb-3');
//   let text = document.createElement('p');
//   text.classList.add('card-text');
//   text.innerHTML = postData.body;
//   textContainer.appendChild(text);
//   body.appendChild(textContainer);

//   // Create body's metadata
//   fetch(`likes/${postData.id}`)
//   .then(response => response.json())
//   .then(data => {
//     let meta = document.createElement('h6');
//     meta.classList.add('card-subtitle', 'mb-2', 'text-muted');
//     meta.innerHTML = `${postData.timestamp} | ${data.likes.length} likes`;
//     body.appendChild(meta);

//     // Insert card
//     container.appendChild(card);
//   });

//   // Create and insert pagination, if needed
//   if (globalPosts.length > limit) {
//     add_pagination();
//   }
// }