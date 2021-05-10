'use strict'

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $('body')

const $storiesLoadingMsg = $('#stories-loading-msg')
const $allStoriesList = $('#all-stories-list')
const $allFavsList = $('#all-favs-list')
const $allUserStoriesList = $('#all-user-stories-list')


const $loginForm = $('#login-form')
const $signupForm = $('#signup-form')
const $submitForm = $('#submit-form')

const $navLogin = $('#nav-login')
const $navUserProfile = $('#nav-user-profile')
const $navLogOut = $('#nav-logout')

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [$allStoriesList, $loginForm, $signupForm]
  components.forEach(c => c.hide())
}


/** Overall function to kick off the app. */

async function start() {
  //* apparently, console.debug only changes the color and maybe hidden in some cases:
  //* (https://stackoverflow.com/questions/21876461/difference-between-console-log-and-console-debug)
  console.debug('start')

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser()
  await getAndShowStoriesOnStart()

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin()
}

// Once the DOM is entirely loaded, begin the app

console.warn(
  'HEY STUDENT: This program sends many debug messages to' +
    " the console. If you don't see the message 'start' below this, you're not" +
    ' seeing those helpful debug messages. In your browser console, click on' +
    " menu 'Default Levels' and add Verbose"
)

//? why does running start() return:
// !main.js:36 Uncaught (in promise) ReferenceError: checkForRememberedUser is not defined
// !at start (main.js:36)
// !at main.js:55

$(start)



/* basically this file grabs some useful elements from the dom that I assume 
can be used by nav.js, stories.js and user.js. It also has a fucntion that hides 
the login and sign up forms.  I guess this is a non-React way of creating a SPA by hiding 
elements instead generating them on the fly using the "virual DOM".  i suppose this aslo keeps
us form having to worry about path routing since we haven't discussed that yet. start() is an 
async function that waits for two functions--checkForRememberedUser() and 
getAndShowStoriesOnStart()--to be resolved.  */

//! The if statement accepts a variable called "currentUser" 
//! but it isn't defined until the user.js file. How can main.js have access?

// *It is unclear 
// * why $(start) doesn't break the code but start() does.





