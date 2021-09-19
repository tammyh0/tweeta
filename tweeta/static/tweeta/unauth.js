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

function create_post(id, author, body, timestamp, likes) {

  let parent = document.querySelector('.posts-container');

  // Create general card
  let cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'mt-3', 'mb-3');
  cardContainer.id = id;
  parent.appendChild(cardContainer);

  // Create card body
  let cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardContainer.appendChild(cardBody);

  // Create body's header
  let header = document.createElement('div');
  header.classList.add('d-flex', 'justify-content-between');
  cardBody.appendChild(header);

  // Add title to header
  let link = document.createElement('a');
  link.href = '#';
  let username = document.createElement('h5');
  username.innerHTML = author;
  username.addEventListener('click', () => {
    counter = 0;
    load_page_profile(author)
  });
  link.appendChild(username);
  header.appendChild(link);

  // Create body's main content
  let textContainer = document.createElement('div');
  textContainer.classList.add('mb-3');
  let text = document.createElement('p');
  text.classList.add('card-text');
  text.innerHTML = body;
  textContainer.appendChild(text);
  cardBody.appendChild(textContainer);

  // Create body's metadata
  let meta = document.createElement('h6');
  meta.classList.add('card-subtitle', 'mb-2', 'text-muted');
  let cardTimestamp = document.createElement('span');
  cardTimestamp.innerHTML = timestamp;
  meta.appendChild(cardTimestamp);
  let likeCount = document.createElement('span');
  likeCount.classList.add('likes');
  likeCount.innerHTML = ` | ${likes} likes`;
  meta.appendChild(likeCount);
  cardBody.appendChild(meta);
}