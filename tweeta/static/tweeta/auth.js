let counter = 0;
const QUANTITY = 10;

document.addEventListener('DOMContentLoaded', () => {

  // Toggle between views using navbar
  document.querySelector('#network-logo-link').addEventListener('click', () => {
    counter = 0;
    load_page_all();
  });
  document.querySelector('#all-posts-link').addEventListener('click', () => {
    counter = 0;
    load_page_all();
  });
  document.querySelector('#user-profile-link').addEventListener('click', () => {
    counter = 0;
    load_page_profile(get_current_user());
  });
  document.querySelector('#following-link').addEventListener('click', () => {
    counter = 0;
    load_page_following();
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

    // Load new page
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
  document.querySelector('.new-post-container').style.display = 'block';

  // Allow new post submission
  document.querySelector('#new-post-form').addEventListener('submit', () => {
    submit_new_post();
  });

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

function submit_new_post() {
  
  // Get data from form
  let author = get_current_user();
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
    counter = 0;
    load_page_all();
  });
}

// Shows the user profile view and user profile's posts
function load_page_profile(author) {

  // Update page title
  document.querySelector('h1').innerHTML = '';

  // Show user profile container
  document.querySelector('.new-post-container').style.display = 'none';
  document.querySelector('.user-profile-container').style.display = 'block';

  // Reset follow/unfollow button
  if (document.querySelector('.follow-btn')) {
    document.querySelector('.follow-btn').remove();
  }

  // Set user profile header
  document.querySelector('h2').innerHTML = author;
  fetch(`/profile/${author}`)
  .then(response => response.json())
  .then(data => {
    let followersCount = data.followers.length;
    let followingCount = data.following.length; 
    document.querySelector('.followers h5').innerHTML = followersCount;
    document.querySelector('.following h5').innerHTML = followingCount;

    if (author !== get_current_user()) {
      set_follow_btn(author);
    }
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

function set_follow_btn(author) {

  // Check to see if user is following this profile
  fetch(`/follow/${author}`)
  .then(response => response.json())
  .then(data => {
    let isFollowing = data.isFollowing;
    let parent = document.querySelector('.info');
    let followBtn = document.createElement('button');
    followBtn.classList.add('btn', 'btn-primary', 'follow-btn');
    if (isFollowing) {
      followBtn.innerHTML = 'Unfollow';
      followBtn.addEventListener('click', () => {
        unfollow_user(author);
      });
    } else {
      followBtn.innerHTML = 'Follow';
      followBtn.addEventListener('click', () => {
        follow_user(author);
      });
    }
    parent.appendChild(followBtn);
  });
}

function load_page_following() {

  // Update page title
  document.querySelector('h1').innerHTML = 'Following';

  // Show user profile container
  document.querySelector('.new-post-container').style.display = 'none';
  document.querySelector('.user-profile-container').style.display = 'none';

  // Reset posts container
  document.querySelector('.posts-container').innerHTML = '';

  // Get user profile's posts and set the paginator
  fetch(`/following/${get_current_user()}?start=${counter}&end=${counter + QUANTITY}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
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

  // Add action to header
  let action = document.createElement('button');
  action.type = 'button';
  action.classList.add('btn', 'btn-link', 'action');
  if (author === get_current_user()) {
    action.innerHTML = 'Edit';
  } else {
    // Get whether current user has liked or unliked this post
    get_like_status(id);
  }
  action.addEventListener('click', () => {
    let label = action.innerHTML;
    if (label === 'Edit') {
      // allow editing to this post
      edit_post(id);
    } else if (label === 'Like') {
      // like pose
      like_post(id);
    } else if (label === 'Unlike') {
      // unlike post
      unlike_post(id);
    }
  });
  header.appendChild(action);

  // Create body's main content
  let textContainer = document.createElement('div');
  textContainer.classList.add('mb-3');
  textContainer.classList.add('card-text-container')
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

function get_like_status(postId) {

  fetch(`/like/${get_current_user()}?post=${postId}`)
  .then(response => response.json())
  .then(data => {
    let isLiked = data.isLiked;
    let action = document.getElementById(postId);
    action = action.querySelector('.action');
    if (isLiked) {
      action.innerHTML = 'Unlike';
    } else if (!isLiked) {
      action.innerHTML = 'Like';
    }
  });
}

function edit_post(id) {

  // Change to edit view
  let card = document.getElementById(id);
  let body = card.querySelector('.card-text-container');
  let text = card.querySelector('.card-text').innerHTML;
  body.innerHTML = '';
  let edit = document.createElement('textarea');
  edit.value = text;
  body.appendChild(edit);
  let actionBtn = card.querySelector('.action');
  actionBtn.innerHTML = 'Save';

  // Submit changes
  actionBtn.addEventListener('click', () => {

    fetch(`/edit?post=${id}`, {
      method: 'POST',
      body: JSON.stringify({
        body: edit.value
      })
    })
    .then(response => response.json())
    .then(data => {
      body.innerHTML = '';
      let updatedText = document.createElement('p');
      updatedText.classList.add('.card-text');
      updatedText.innerHTML = edit.value;
      body.appendChild(updatedText);
      actionBtn.innerHTML = 'Edit';
    });
  })
}

function like_post(id) {
  
  // Submit like and replace card with updated one
  fetch(`/update_like/${get_current_user()}?post=${id}&action=like`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

    // Update likes count
    let post = document.getElementById(id);
    let likesContainer = post.querySelector('.likes')
    let likes = likesContainer.innerHTML.slice(3, 4);
    likes = parseInt(likes);
    likes++;
    likesContainer.innerHTML = ` | ${likes} likes`;

    // Switch action button to like
    let actionBtn = post.querySelector('.action');
    actionBtn.innerHTML = 'Unlike';
  });
}

function unlike_post(id) {
  
  // Submit unlike and replace card with updated one
  fetch(`/update_like/${get_current_user()}?post=${id}&action=unlike`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

    // Update likes count
    let post = document.getElementById(id);
    let likesContainer = post.querySelector('.likes')
    let likes = likesContainer.innerHTML.slice(3, 4);
    likes = parseInt(likes);
    likes--;
    likesContainer.innerHTML = ` | ${likes} likes`;

    // Switch action button to like
    let actionBtn = post.querySelector('.action');
    actionBtn.innerHTML = 'Like';
  });
}

function follow_user(author) {
  // Submit follow and updated button
  fetch(`/follow/${author}?action=follow`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

    let followerCount = document.querySelector('.followers h5');
    let count = parseInt(followerCount.innerHTML);
    count++;
    followerCount.innerHTML = count;

    let oldBtn = document.querySelector('.follow-btn');
    let newBtn = oldBtn.cloneNode(true);
    newBtn.innerHTML = 'Unfollow';
    newBtn.addEventListener('click', () => {
      unfollow_user(author);
    });
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  });
}

function unfollow_user(author) {
  // Submit follow and updated button
  fetch(`/follow/${author}?action=unfollow`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

    let followerCount = document.querySelector('.followers h5');
    let count = parseInt(followerCount.innerHTML);
    count--;
    followerCount.innerHTML = count;
    
    let oldBtn = document.querySelector('.follow-btn');
    let newBtn = oldBtn.cloneNode(true);
    newBtn.innerHTML = 'Follow';
    newBtn.addEventListener('click', () => {
      follow_user(author);
    });
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  });
}