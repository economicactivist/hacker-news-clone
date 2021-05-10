'use strict'

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  // * returns: jQuery.Event {originalEvent: MouseEvent, type: "click", target:
  //* a#nav-all.nav-link, currentTarget: a#nav-all.nav-link, isDefaultPrevented: ƒ, …}
  console.debug('navAllStories', evt)
  hidePageComponents() //main.js (hides forms and storylist)
  putStoriesOnPage() //stories.js (haven't revied this js file yet but assume it is conected to storylist)
}

//add event listener to the element with the "nav-all" id and then calls navAllStories on click
//$body can be accessed because it was defined in main.js and the script is above nav.js in index.html
//? why didn't we grab 'nav-all' directly and assign it to variable in main.js?
$body.on('click', '#nav-home', navAllStories)


/** Show story formj (Don't hide stories below form) */

function navSubmitClick(evt){
  console.debug('navSubmitClick', evt)
  hidePageComponents()
  putStoriesOnPage()
  $submitForm.show()
  $allStoriesList.prepend($submitForm);
 
}
$body.on('click', '#nav-submit', navSubmitClick)

function navUserStoriesClick(evt) { 
  console.debug('navUserStoriesClick', evt)
  hidePageComponents()
  $allUserStoriesList.show()
 }

$body.on('click', '#nav-my-stories', navUserStoriesClick)

function navFavClick(evt){
  console.debug('navFavlick', evt)
  hidePageComponents()
  $allFavsList.show()
}
$body.on('click', '#nav-fav', navFavClick)


/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt)
  hidePageComponents() //hide everthing then choose what to show
  $loginForm.show()
  $signupForm.show()
}

//defined in main.js
$navLogin.on('click', navLoginClick)

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin')
  $('.main-nav-links').show() //*had to add this class
  $navLogin.hide()
  $navLogOut.show() //overrides the css property for the hidden class in site.css
  //? why .show()? the code doesn't indicate that navUserProfile is hidden
  $navUserProfile.text(`${currentUser.username}`).show() //!once again currentUser isn't defined
}
