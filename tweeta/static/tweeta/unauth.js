let counter = 0;
const QUANTITY = 10;

document.addEventListener('DOMContentLoaded', () => {

  // Toggle between views using navbar
  document.querySelector('#network-logo-link').addEventListener('click', () => {
    counter = 0;
    load_page_all()
  });
  document.querySelector('#all-posts-link').addEventListener('click', () => {
    counter = 0;
    load_page_all()
  });


  // By default, load all posts
  load_page_all();

  // Set pagination button functionality
  document.querySelector('#previous').addEventListener('click', () => {
    // Update counter
    counter -= QUANTITY;

    // Load new page
    if (document.querySelector('h1').innerHTML === 'All Posts') {
      load_page_all();
    } else {
      let author = document.querySelector('h2').innerHTML;
      load_page_profile(author)
    }
  });
  document.querySelector('#next').addEventListener('click', () => {
    // Update counter
    counter += QUANTITY;

    // Loage new page
    if (document.querySelector('h1').innerHTML === 'All Posts') {
      load_page_all();
    } else {
      let author = document.querySelector('h2').innerHTML;
      load_page_profile(author)
    }
  });
});

// Shows the view with all posts
function load_page_all() {

    // Update page title
    document.querySelector('h1').innerHTML = 'All Posts';

    // Hide user profile container
    document.querySelector('.user-profile-container').style.display = 'none';

    // Reset posts container
    document.querySelector('.posts-container').innerHTML = '';

    // Get all posts and set the paginator
    fetch(`/all?start=${counter}&end=${counter + QUANTITY}`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      let posts = data.posts;
      let isLast = data.isLast;
      let likes = data.likes;

      for (let i = 0; i < posts.length; i++) {
        create_post(posts[i].id, posts[i].author, posts[i].body, posts[i].timestamp, likes[i].count); // in helpers
      }

      set_pagination(isLast); // in helpers
    });
}

// Shows the user profile view and user profile's posts
function load_page_profile(author) {

  // Update page title
  document.querySelector('h1').innerHTML = '';

  // Show user profile container
  document.querySelector('.user-profile-container').style.display = 'block';

  // Set user profile header
  document.querySelector('h2').innerHTML = author;
  fetch(`/profile/${author}`)
  .then(response => response.json())
  .then(data => {
    let followersCount = data.followers.length;
    let followingCount = data.following.length; 

    document.querySelector('.followers h5').innerHTML = followersCount;
    document.querySelector('.following h5').innerHTML = followingCount;
  });

  // Reset posts container
  document.querySelector('.posts-container').innerHTML = '';

  // Get user profile's posts and set the paginator
  fetch(`/all/${author}?start=${counter}&end=${counter + QUANTITY}`)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    let posts = data.posts;
    let isLast = data.isLast;
    let likes = data.likes;

    for (let i = 0; i < posts.length; i++) {
      create_post(posts[i].id, posts[i].author, posts[i].body, posts[i].timestamp, likes[i].count); // in helpers
    }

    set_pagination(isLast); // in helpers
  });
}