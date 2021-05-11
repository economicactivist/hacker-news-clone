'use strict'

// This is the global list of the stories, an instance of StoryList
let storyList

/** Get and show stories when site first loads. */
//* called in start() in main.js
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories()
  $storiesLoadingMsg.remove()

  putStoriesOnPage()
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName()
  //* note the use of jQuery here.
  //? What would be the difference in using a template literal without $()?
  const showStar = Boolean(currentUser);
  return $(`
            <li id="${story.storyId}">
              ${showDeleteBtn ? getDeleteBtnHTML() : ''}
              ${showStar ? getStarHTML(story, currentUser) : ''}
              <a href="${story.url}" target="a_blank" class="story-link">
                ${story.title}
              </a>
              <small class="story-hostname">(${hostName})</small>
              <small class="story-author">by ${story.author}</small>
              <small class="story-user">posted by ${story.username}</small>
            </li>
          `)
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage')

  $allStoriesList.empty()

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story)
    //?wouldn't this put new stories at the bottom?
    $allStoriesList.append($story)
  }

  $allStoriesList.show()
}

/** Handle new story submission */
async function addNewStory(evt) {
  console.debug('addNewStory', evt)
  evt.preventDefault()

  const newTitle = $('#create-title').val()
  const newAuthor = $('#create-author').val()
  const newUrl = $('#create-url').val()

  const story = await storyList.addStory(currentUser, {
    title: newTitle,
    author: newAuthor,
    url: newUrl,
  })

  const $story = generateStoryMarkup(story)
  $allStoriesList.prepend($story)

  // hide the form and reset it
  //$submitForm.slideUp("slow");
  $submitForm.hide()
  $submitForm.trigger('reset')
}

$submitForm.on('submit', addNewStory)

function putUserStoriesOnPage() {
  console.debug('putUserStoriesOnPage')

  $allUserStoriesList.empty()

  if (currentUser.ownStories.length === 0) {
    $allUserStoriesList.append('<h5>No stories added by user yet!</h5>')
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true)
      $allUserStoriesList.append($story)
    }
  }

  $allUserStoriesList.show() //? duplication?
}

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`
}

/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story)
  const starType = isFavorite ? 'fas' : 'far'
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`
}

/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug('deleteStory')

  const $closestLi = $(evt.target).closest('li')
  const storyId = $closestLi.attr('id')

  await storyList.removeStory(currentUser, storyId)

  // re-generate story list
  await putUserStoriesOnPage()
}

$allUserStoriesList.on('click', '.trash-can', deleteStory)

/** Put favorites list on page. */

function putFavoritesListOnPage() {
  console.debug('putFavoritesListOnPage')

  $allFavsList.empty()

  if (currentUser.favorites.length === 0) {
    $allFavsList.append('<h5>No favorites added!</h5>')
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story)
      $allFavsList.append($story)
    }
  }

  $allFavsList.show()
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug('toggleStoryFavorite')

  const $tgt = $(evt.target)
  const $closestLi = $tgt.closest('li')
  const storyId = $closestLi.attr('id')
  const story = storyList.stories.find(s => s.storyId === storyId)

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass('fas')) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story)
    $tgt.closest('i').toggleClass('fas far')
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story)
    $tgt.closest('i').toggleClass('fas far')
  }
}

$storiesLists.on('click', '.star', toggleStoryFavorite)
