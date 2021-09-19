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

// Returns the username of the user that's currently logged in
function get_current_user() {
  let username = '';
  if (document.querySelector('#user-profile-link strong')) {
    username = document.querySelector('#user-profile-link strong').innerHTML;
  }

  return username;
}