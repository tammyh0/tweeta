const limit = 10;
let globalPosts = [];
let postCounter = 0;


document.addEventListener('DOMContentLoaded', () => {

  // Toggle between views using navbar
  document.querySelector('#network-logo-link').addEventListener('click', () => load_page('all'));
  document.querySelector('#user-profile-link').addEventListener('click', () => load_page(get_current_user()));
  document.querySelector('#all-posts-link').addEventListener('click', () => load_page('all'));
  document.querySelector('#following-link').addEventListener('click', () => load_page('following'))


  // By default, load all posts
  load_page('all');
});

// view can either be 'all', 'following', or a username
function load_page(view) {

  // Get page title
  let title = document.querySelector('h1');

  // Get page containers to switch between, depending on the view
  let newPost = document.querySelector('.new-post-container');
  let userProfile = document.querySelector('.user-profile-container');

  if (view === 'all') {

    // Update page title
    title.innerHTML = 'All Posts';

    // Switch views
    newPost.style.display = 'block';
    userProfile.style.display = 'none';

    // Allow new post submission
    document.querySelector('#new-post-form').addEventListener('submit', submit_new_post);

  } else if (view === 'following') {

    // Update page title
    title.innerHTML = 'Following';

    // Switch views
    newPost.style.display = 'none';
    userProfile.style.display = 'none';

  } else { // view is a username

    // Update page title
    title.innerHTML = '';

    // Switch views
    newPost.style.display = 'none';
    userProfile.style.display = 'block';

    // Show profile's following and follower info
    user_profile(view);
  }

  // Retrieve appropriate posts and store globally
  get_posts(view);
}

function submit_new_post() {
  
  // Get data from form
  let author = document.querySelector('#user-profile-link strong').innerHTML;
  let body = document.querySelector('.new-post-container textarea').value;

  // Send POST request
  fetch('/post', {
    method: 'POST',
    body: JSON.stringify({
      author: author,
      body: body
    })
  })
  .then(response => response.json())
  .then(() => {

    // Refresh all posts page
    load_page('all');
  });
}


function user_profile(username) {

  // Show the username of user profile in view
  let title = document.querySelector('.user-profile-container h2');
  title.innerHTML = username;

  // Show number of followers and following
  fetch(`/follows/${username}/all`)
  .then(response => response.json())
  .then(data => {

    let userCount = 0;

    let userTypes = ['followers', 'following'];

    userTypes.forEach(users => {

      // Get the number of followers or following 
      if (users === 'followers') {
        userCount = data.followers.length;
      } else if (users === 'following') {
        userCount = data.following.length;
      }

      // Get user profile stat element and update
      let userType = document.querySelector(`.${users} h5`);
      if (userCount > 0) {
        userType.innerHTML = userCount;
      } else {
        userType.innerHTML = 0;
      }
    });

    // MAKE SURE TO ADD FOLLOW/UNFOLLOW BUTTON //
  });
}

function get_posts(view) {

  // Reset post counter and global posts
  globalPosts = [];
  postCounter = 0;

  let following = [];

  // Get list of following
  fetch(`/follows/${get_current_user()}/following`)
  .then(response => response.json())
  .then(data => {
    following = data.following;

    // Get all existing posts
    return fetch('/posts');
  })
  .then(response => response.json())
  .then(data => {
    // Go through each post in reverse order
    for (let i = data.length - 1; i >= 0; i--) {
      let postData = data[i];

      if (view === 'all') {
        globalPosts.push(postData);
      } else if (view === 'following') {

        // iterate through each person and see if they match the postData author
        following.forEach((user) => {
          if (user.following === postData.author) {
            globalPosts.push(postData);
          }
        });
      } else if (view === postData.author) {
        globalPosts.push(postData);
      }
    }

    // Insert ten posts based on the post counter
    insert_posts();
  });
  
}

function insert_posts() {

  // Reset posts container
  let container = document.querySelector('.posts-container');
  container.innerHTML = '';

  let start = postCounter;
  let stop = 0;
  if (globalPosts.length <= limit) {
    // This set of posts can fit on one page
    stop = globalPosts.length;
  } else if (start + limit > globalPosts.length) {
    // This set of posts can fit on one page
    stop = globalPosts.length;
  } else if (start + limit <= globalPosts.length) { // global posts length is greater than 10
    stop = start + limit;
  } 

  // Create a post and insert for each post in this page's set
  for (let i = start; i < stop; i++) {
    create_card(globalPosts[i]);
  }

  // Create and insert pagination, if needed
  if (globalPosts.length > limit) {
    add_pagination();
  }
}

function create_card(postData) {

  // Get posts container
  let container = document.querySelector('.posts-container');

  // Create general card
  let card = document.createElement('div');
  card.classList.add('card', 'mt-3', 'mb-3');

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
  username.addEventListener('click', () => load_page(postData.author));
  header.appendChild(username);

  // Add user action options to header, either 'edit' or 'like' post
  let action = document.createElement('button');
  action.setAttribute('type', 'button');
  action.classList.add('btn', 'btn-link', `id-${postData.id}`);
  if (postData.author === get_current_user()) {
    action.innerHTML = 'EDIT';
  } else {
    // Check if this post has been liked
    fetch(`/likes/${postData.id}`)
    .then(response => response.json())
    .then(data => {
      data.likes.forEach((like) => {
        if (like.liker === get_current_user()) {
          action.innerHTML = 'Unlike';
        } else {
          action.innerHTML = 'Like';
        }
      });
    });
  }
  // MAKE SURE TO ADD EVENT LISTENERS TO THE 'EDIT' OR 'LIKE/UNLIKE' BUTTONS
  header.appendChild(action);

  // Create body's main content
  let textContainer = document.createElement('div');
  textContainer.classList.add(`id-${postData.id}`, 'mb-3');
  let text = document.createElement('p');
  text.classList.add('card-text');
  text.innerHTML = postData.body;
  textContainer.appendChild(text);
  body.appendChild(textContainer);

  // Create body's metadata
  fetch(`/likes/${postData.id}`)
    .then(response => response.json())
    .then(data => {

      let meta = document.createElement('h6');
      meta.classList.add('card-subtitle', 'mb-2', 'text-muted');
      let timestamp = document.createElement('span');
      timestamp.innerHTML = `${postData.timestamp} | `;
      meta.appendChild(timestamp);
      let likes = document.createElement('span');
      likes.classList.add('likes', `id-${postData.id}`);
      likes.innerHTML = `${data.likes.length} likes`;
      meta.appendChild(likes);
      body.appendChild(meta);
    });

  // Insert card
  container.appendChild(card);
}

