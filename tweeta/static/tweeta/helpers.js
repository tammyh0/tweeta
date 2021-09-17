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

function set_pagination(isLast) {

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
}






// // Returns the username of the user that's currently logged in
// function get_current_user() {
//   let username = '';
//   if (document.querySelector('#user-profile-link strong')) {
//     username = document.querySelector('#user-profile-link strong').innerHTML;
//   }

//   return username;
// }


// function add_pagination() {

//   // Get posts container
//   let container = document.querySelector('.posts-container');

//   // Create the general pagination bar
//   let pagNav = document.createElement('nav');
//   pagNav.setAttribute('id', 'pagination');
//   let btnList = document.createElement('ul');
//   btnList.classList.add('pagination', 'justify-content-center');
//   pagNav.appendChild(btnList);

//   // Create the previous and next buttons
//   let pagBtns = ['Previous', 'Next'];
//   pagBtns.forEach((label) => {

//     let listItem = document.createElement('li');
//     listItem.classList.add('page-item');
//     btnList.appendChild(listItem);
//     let btn = document.createElement('button');
//     btn.setAttribute('type', 'button');
//     btn.classList.add('btn', 'btn-lg', 'btn-secondary')
//     btn.innerHTML = label;
//     listItem.appendChild(btn);

//     // Add disable attributes, if necessary
//     if (postCounter === 0 && label === 'Previous') {
//       btn.disabled = true;
//     } else if (postCounter + limit > globalPosts.length && label === 'Next') {
//       btn.disabled = true;
//     }

//     // Add event listener
//     listItem.addEventListener('click', () => {

//       if (label === 'Previous' && postCounter > 0) {
//         // Update and decrement counter
//         postCounter -= limit;
//       } else if (label === 'Next') {
//         // Update and increment counter
//         postCounter += limit;
//       }

//       // Go to other page
//       insert_posts();
//     });
//   });

//   container.appendChild(pagNav);
// }








// const limit = 10;
// let counter = 0;
// let allPosts = [];

// function get_current_user() {
//   let username = '';
//   if (document.querySelector('#user-profile-link strong')) {
//     username = document.querySelector('#user-profile-link strong').innerHTML;
//   }

//   return username;
// }

// function load_page(view) {

//   // Get user that's logged in, if any
//   let current_user = get_current_user();

//   // Get page title
//   let title = document.querySelector('h1');

//   // Get page containers to switch between, depending on the view
//   let newPost = document.querySelector('.new-post-container');
//   let userProfile = document.querySelector('.user-profile-container');

//   if (view === 'user') { // Show current user's profile

//     // Switch to current user's profile view
//     newPost.style.display = 'none';
//     userProfile.style.display = 'block';
//     title.innerHTML = current_user;

//     // Load remaining contents
//     user_profile(current_user);

//   } else { // Either all or following view; 

//     // Turn off user profile view, if haven't already
//     if (current_user !== '') {
//       userProfile.style.display = 'none';
//     }

//     if (view === 'all') { // Show all posts view

//       // Show ability to create a new post, if logged in
//       if (current_user !== '') {
//         newPost.style.display = 'block';
//         document.querySelector('#new-post-form').addEventListener('submit', submit_new_post);
//       }
//       title.innerHTML = 'All';

//     } else if (view === 'following') { // Show users following view
//       newPost.style.display = 'none';
//       title.innerHTML = 'Following';
//     }
//   }

//   insert_posts(view)

// }
 
// function submit_new_post() {

//   // Get data from form
//   let author = document.querySelector('#user-profile-link strong').innerHTML;
//   let body = document.querySelector('.new-post-container textarea').value;

//   // Send POST request
//   fetch('/post', {
//     method: 'POST',
//     body: JSON.stringify({
//       author: author,
//       body: body
//     })
//   })
//   .then(response => response.json())
//   .then(() => {

//     // Refresh all posts page
//     load_page('all');
//   });
// }

// function user_profile(username) {

//   // Remove follow/unfollow button if viewing user's own profile
//   if (document.querySelector('.info button')) {
//     document.querySelector('.info button').remove();
//   }

//   // Show the username of user profile in view
//   let title = document.querySelector('.user-profile-container h2');
//   title.innerHTML = username;

//   // Show profiles stats
//   show_followers_following(username);

//   // Add follow/unfollow button for profiles other than own current user
//   if (username !== document.querySelector('#user-profile-link strong').innerHTML) {
//     add_follow_button(username);
//   }
// }

// function show_followers_following(username) {
//   fetch(`/follow/${username}`)
//   .then(response => response.json())
//   .then(data => {
//     let followers = document.querySelector('.followers h5');
//     if (data.followers.length > 0) {
//       followers.innerHTML = data.followers.length;
//     } else {
//       followers.innerHTML = 0;
//     }

//     let following = document.querySelector('.following h5');
//     if (data.following.length > 0) {
//       following.innerHTML = data.following.length;
//     } else {
//       following.innerHTML = 0;
//     }
//   });
// }

// function add_follow_button(username) {

//   fetch(`/follow/${username}`)
//   .then(response => response.json())
//   .then(data => {
//     let button = document.createElement('button');
//     button.setAttribute('type', 'button');
//     button.setAttribute('id', 'follow-btn');
//     button.classList.add('btn', 'btn-primary');

//     if (data.followers.length > 0) {
//       // Check if this profile's followers includes the current user
//       data.followers.forEach(item => {
//         if (item.user === document.querySelector('#user-profile-link strong').innerHTML) {
//           button.innerHTML = 'Unfollow';
//         } else {
//           button.innerHTML = 'Follow';
//         }
//       });
//     } else {
//       // Can be the first follower
//       button.innerHTML = 'Follow';
//     }

//     button.addEventListener('click', () => {
//       if (button.innerHTML === 'Follow') {
//         button.innerHTML = 'Unfollow';
//         follow_user(username, 'follow');
//       } else {
//         button.innerHTML = 'Follow';
//         follow_user(username, 'unfollow');
//       }
//     });
  
//     document.querySelector('.user-profile-container .info').appendChild(button);
//   });
// }

// function follow_user(username, action) {
  
//   fetch(`/follower/${username}/${action}`, {
//     method: 'POST'
//   })
//   .then(response => response.json())
//   .then(() => {

//     show_followers_following(username)
//   });
// }


// // First page of posts
// function insert_posts(view) {

//   let following = [];
//   // If logged in, get list of people following
//   if (document.querySelector('#user-profile-link strong')) {
//     fetch(`/follow/${document.querySelector('#user-profile-link strong').innerHTML}`)
//     .then(response => response.json())
//     .then(data => {
//       data.following.forEach(item => {
//         following.push(item.following);
//       });
//     });
//   }

//   // Get each post
//   fetch('/posts')
//   .then(response => response.json())
//   .then(data => {

//     let posts = [];
//     for (let i = data.length - 1; i >= 0; i--) {
//       let post = data[i];

//       if (view === 'all') {
//         // Insert all posts
//         posts.push(post);
//       } else if (view === 'user' && post.author === document.querySelector('.user-profile-container h2').innerHTML) {
//         // Insert all posts made by current user profile
//         posts.push(post);
//       } else if (view === 'following' && following.includes(post.author)) {
//         // Insert all posts by all following
//         posts.push(post);
//       } 
//     }

//     allPosts = posts;
//     // Create initial pagination
//     post(counter);

//   });
// }

// function post(counter) {
//   let container = document.querySelector('.posts-container');
//   container.innerHTML = '';

//   if (document.querySelector('#pagination')) {
//     document.querySelector('#pagination').delete();
//   }

//   let start = counter; 
//   let stop = 0; 
//   if (allPosts.length <= limit) {
//     stop = allPosts.length;
//   } else {
//     if (allPosts.length - (allPosts.length % 10) === start) {
//       stop = allPosts.length;
//     } else {
//       stop = counter + limit;
//     }
//   }

//   for (let i = start; i < stop; i++) {
//     create_card(allPosts[i]);
//   }

//   if (allPosts.length > limit) {
//     create_pagination_bar()
//   }
// }

// function create_pagination_bar() {
//   let container = document.querySelector('.posts-container');

//   let pagNav = document.createElement('nav');
//   pagNav.setAttribute('id', 'pagination');
//   let list = document.createElement('ul');
//   list.classList.add('pagination', 'justify-content-center');
//   pagNav.appendChild(list);
//   let previousBtn = document.createElement('li');
//   previousBtn.classList.add('page-item');
//   if (counter === 0) {
//     previousBtn.classList.add('disabled');
//   }
//   previousBtn.innerHTML = 'Previous';
//   previousBtn.addEventListener('click', () => {
//     if (counter !== 0) {
//       // Update counter
//       counter -= limit;

//       // Go to previous page
//       post(counter);
//     }
//   });
//   list.appendChild(previousBtn);
//   let nextBtn = document.createElement('li');
//   nextBtn.classList.add('page-item');
//   if (counter + limit > allPosts.length) {
//     nextBtn.classList.add('disabled');
//   }
//   nextBtn.innerHTML = 'Next';
//   nextBtn.addEventListener('click', () => {
//     if (counter + limit < allPosts.length) {
//       // Update counter
//       counter += limit;

//       // Go to next page
//       post(counter);
//     }
//   })
//   list.appendChild(nextBtn);

//   container.appendChild(pagNav);
// }

// function create_card(post) {

//   let container = document.querySelector('.posts-container');

//   // Create general card
//   let card = document.createElement('div');
//   card.classList.add('card', 'mt-3', 'mb-3');

//   // Create card body
//   let body = document.createElement('div');
//   body.classList.add('card-body');

//   // Create body's header
//   let header = document.createElement('div');
//   header.classList.add('d-flex', 'justify-content-between');
//   let username = document.createElement('h5');
//   username.innerHTML = post.author;
//   username.addEventListener('click', () => {
//     document.querySelector('.new-post-container').style.display = 'none';
//     document.querySelector('.user-profile-container').style.display = 'block';
//     document.querySelector('h1').innerHTML = '';
//     counter = 0;
//     user_profile(post.author);
//     insert_posts('user');
//   });
//   header.appendChild(username);
//   let action = document.createElement('button');
//   action.setAttribute('type', 'button');
//   action.setAttribute('id', post.id);
//   action.classList.add('btn', 'btn-link');
//   if (document.querySelector('#user-profile-link strong')) {
//     if (post.author === document.querySelector('#user-profile-link strong').innerHTML) {
//       action.innerHTML = 'EDIT';
//     } else {
//       let isLiked = check_likes(post.id);
//       if (isLiked) {
//         action.innerHTML = 'Unlike';
//       } else {
//         action.innerHTML = 'Like';
//       }
//     }
//   } 
//   header.appendChild(action);
//   body.appendChild(header);

//   // Create body's main content
//   let textContainer = document.createElement('div');
//   textContainer.classList.add(`id-${post.id}`, 'mb-3');
//   let text = document.createElement('p');
//   text.classList.add('card-text');
//   text.innerHTML = post.body;
//   textContainer.appendChild(text);
//   body.appendChild(textContainer);

//   // Create body's metadata
//   let meta = document.createElement('h6');
//   meta.classList.add('card-subtitle', 'mb-2', 'text-muted', `id-${post.id}`);
//   meta.innerHTML = `${post.timestamp} | `;
//   // Get current likes
  

//   body.appendChild(meta);

//   card.appendChild(body);

//   container.appendChild(card);


//   action.addEventListener('click', (e) => {

//     if (action.innerHTML === 'EDIT') {

//       // Edit post
//       let thisBody = document.querySelector(`.id-${e.target.id}`);
//       thisBody.innerHTML = '';

//       let editArea = document.createElement('textarea');
//       editArea.classList.add('editedText');

//       editArea.value = post.body;
//       thisBody.appendChild(editArea);

//       action.innerHTML = 'SAVE';
//     } else if (action.innerHTML === 'SAVE') {
//       // Save edited post
//       let newText = document.querySelector('.editedText').value;
      
//       // Send PUT request and update post
//       fetch(`/edit/${e.target.id}`, {
//         method: 'PUT',
//         body: JSON.stringify({
//           body: newText
//         })
//       })
//       .then(() => {

//         let thisBody = document.querySelector(`.id-${e.target.id}`);
//         thisBody.innerHTML = '';
//         let updatedText = document.createElement('p');
//         updatedText.classList.add('card-text');
//         updatedText.innerHTML = newText;
//         thisBody.appendChild(updatedText);
//       });

//       action.innerHTML = 'EDIT';
//     } else if (action.innerHTML === 'Like') {
//       like(e.target.id, 'like');
//       action.innerHTML = 'Unlike';
//       // Change like count
      
//     } else if (action.innerHTML === 'Unlike') {
//       like(e.target.id, 'unlike');
//       action.innerHTML = 'Like';
//       // Change like count

//     }
//   });
// }

// // function like_count(timestamp, id) {

// //   let count = 0;
// //   fetch(`/likes/${id}`)
// //   .then(response => response.json())
// //   .then(data => {
// //     count = data.likes.length;
// //     // let likeCounter = document.querySelector(`h6.id-${id}`);
// //     // likeCounter.innerHTML = `${timestamp} | ${count} likes`;
// //   });
// //   return count;
// // }

// function check_likes(id) {
//   let isLiked = false;

//   fetch(`/likes/${id}`)
//   .then(response => response.json())
//   .then(data => {
//     data.likes.forEach((like) => {
//       if (like.liker === document.querySelector('#user-profile-link strong').innerHTML) {
//         isLiked = true;
//       }
//     });
//   });

//   return isLiked;
// }

// function like(id, action) {
//   fetch(`/like/${id}/${action}`, {
//     method: 'POST'
//   })
//   .then(response => response.json())
//   .then((data) => {

//     console.log(data);
//   });
// }


