"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
//* called in start() in main.js
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //* note the use of jQuery here.  
  //? What would be the difference in using a template literal without $()?
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    //?wouldn't this put new stories at the bottom?
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle new story submission */
async function addNewStory(evt){
  console.debug("addNewStory",evt)
  evt.preventDefault()

  const newTitle = $('#create-title').val()
  const newAuthor = $('#create-author').val()
  const newUrl = $('#create-url').val()
  

  
  const story = await storyList.addStory(currentUser, {title: newTitle, author: newAuthor, url: newUrl})
  
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // hide the form and reset it
  //$submitForm.slideUp("slow");
  $submitForm.hide()
  $submitForm.trigger("reset");
  
}

$submitForm.on('submit', addNewStory)