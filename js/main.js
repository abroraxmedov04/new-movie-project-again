// ? render movies elements
const fragment = new DocumentFragment();
const elTemplateMovieCard = document.querySelector(".js-movie-card").content;
const elMovieListWr = document.querySelector(".js-movie-list");

// ? form elements
const elForm = document.querySelector(".js-form");
const elInputSearch = document.querySelector(".js-search-movie-input");
const elSelectCategories = document.querySelector(".js-category");
const elMinYearInput = document.querySelector(".js-min-year-search");
const elmaxyearInput = document.querySelector(".js-max-year-search");
const elsortInputField = document.querySelector(".js-sort");

// ? modal main elements
let elModalMain = document.querySelector(".js-modal-learn-more");
let elmodalFrame = document.querySelector(".js-frame-modal");
let elModalTitleFull = document.querySelector(".movie-title-full-modal");
let elModalMovieYear = document.querySelector(".js-movie-year-modal");
let elModalMovieRating = document.querySelector(".js-movie-rating-modal");
let elModalMovieRuntime = document.querySelector(".js-movie-runtime-modal");
let elModalSummaryFull = document.querySelector(".js-modal-summary");
let elModalMovielinkImdb = document.querySelector(".js-movie-link-modal");

// ? bookmarks elements
let eltemplateBookmark = document.querySelector(
  ".js-bookmark-cards-template"
).content;
let closeModalButton = document.getElementById("closeModalButton");
let elBookmarksWr = document.querySelector(".js-bookmarks-wr");
let elBookmarkOpenBtn = document.querySelector(".open-bookmark-modal");

// ? unique arrays
let categories = [];
let bookmarks = [];

// ? functions
function renderModal(movieData) {
  //  show modal
  elModalMain.classList.remove("hidden");
  // close modal
  closeModalButton.addEventListener("click", (evet) => {
    elModalMain.classList.add("hidden");
  });
  // add text content and src
  elmodalFrame.src = movieData.movie_frame;
  elModalTitleFull.textContent = movieData.full_title;
  elModalMovieYear.textContent = movieData.movie_year;
  elModalMovieRating.textContent = movieData.imdb_rating;
  elModalMovieRuntime.textContent = getHourAndMin(movieData.runtime);
  elModalSummaryFull.textContent = movieData.summary;
  elModalMovielinkImdb.href = movieData.imdb_link;
}

function renderBookmarks(arr, node) {
  closeButton.addEventListener("click", () => {
    offCanvas.classList.add("hidden");
  });
  node.innerHTML = "";
  arr.forEach((item) => {
    let cloneNode = eltemplateBookmark.cloneNode(true);
    cloneNode.querySelector(".js-bookmarks-image-card").src = item.image_url;
    cloneNode.querySelector(".js-bookmark-title").textContent =
      item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title;
    cloneNode.querySelector(".bookmark-delete-btn").dataset.imdbId =
      item.imdb_id;
    node.appendChild(cloneNode);
  });
}
renderBookmarks(bookmarks, elBookmarksWr);

function getUniqueCategories(arr) {
  for (const movie of arr) {
    let movieCategories = movie.categories;
    for (const category of movieCategories) {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    }
  }
}
getUniqueCategories(movies);

function renderCategories(arr) {
  arr.forEach((category) => {
    let option = document.createElement("option");
    option.textContent = category;
    option.value = category;
    elSelectCategories.appendChild(option);
  });
}
renderCategories(categories);

function getHourAndMin(data) {
  return `${Math.floor(data / 60)} hr ${data % 60} min`;
}

function sort(arr) {
  arr.sort((a, b) => {
    if (elsortInputField.value === "a-z") {
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
      return 0;
    }

    if (elsortInputField.value === "z-a") {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
      if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
      return 0;
    }

    if (elsortInputField.value === "new-to-old-year") {
      if (a.movie_year < b.movie_year) return 1;
      if (a.movie_year > b.movie_year) return -1;
      return 0;
    }

    if (elsortInputField.value === "old-to-new-year") {
      if (a.movie_year < b.movie_year) return -1;
      if (a.movie_year > b.movie_year) return 1;
      return 0;
    }

    if (elsortInputField.value === "top-rating") {
      if (a.imdb_rating < b.imdb_rating) return 1;
      if (a.imdb_rating > b.imdb_rating) return -1;
      return 0;
    }

    if (elsortInputField.value === "small-rating") {
      if (a.imdb_rating < b.imdb_rating) return -1;
      if (a.imdb_rating > b.imdb_rating) return 1;
      return 0;
    }
  });
}

function renderMovies(arr, node, regex = "") {
  arr.forEach((movie) => {
    let cloneNode = elTemplateMovieCard.cloneNode(true);
    cloneNode.querySelector(".js-movie-image-card").src = movie.image_url;
    cloneNode.querySelector(".js-movie-title").textContent =
      movie.title.length > 20
        ? movie.title.substring(0, 20) + "..."
        : movie.title;

    // ? regex
    if (regex.source != "(?:)" && regex) {
      cloneNode.querySelector(".js-movie-title").innerHTML =
        movie.title.replace(
          regex,
          (
            match
          ) => `<mark class="d-inline-block p-0 bg-warning text-light rounded-2">
          ${match}</mark>`
        );
    } else {
      cloneNode.querySelector(".js-movie-title").textContent = movie.title;
    }

    cloneNode.querySelector(".js-movie-year").textContent = movie.movie_year;
    cloneNode.querySelector(".js-movie-rating").textContent = movie.imdb_rating;
    cloneNode.querySelector(".js-movie-runtime").textContent = getHourAndMin(
      movie.runtime
    );
    cloneNode.querySelector(".js-movie-genres").textContent = movie.categories
      .slice(0, 4)
      .join(", ");
    cloneNode.querySelector(".js-modal-btn").dataset.imdbId = movie.imdb_id;
    cloneNode.querySelector(".js-bookmark-btn").dataset.imdbId = movie.imdb_id;
    fragment.appendChild(cloneNode);
  });
  node.appendChild(fragment);
}
renderMovies(movies.slice(0, 30), elMovieListWr);

function renderSearchedData(event) {
  event.preventDefault();
  let inputValue = elInputSearch.value.trim();
  let regex = new RegExp(inputValue, "gi");

  let resultSearch = movies.filter((item) => {
    return (
      item.title.match(regex) &&
      (elSelectCategories.value == "all" ||
        item.categories.includes(elSelectCategories.value)) &&
      (elMinYearInput.value == "" ||
        item.movie_year >= Number(elMinYearInput.value)) &&
      (elmaxyearInput.value == "" ||
        item.movie_year <= Number(elmaxyearInput.value))
    );
  });

  elMovieListWr.innerHTML = "";

  if (resultSearch.length > 0) {
    if (elsortInputField.value !== "choose") sort(resultSearch);
    renderMovies(resultSearch, elMovieListWr, regex);
  } else {
    console.log("not found");
  }
}

// ? event listners

elMovieListWr.addEventListener("click", (evet) => {
  if (evet.target.matches(".js-modal-btn")) {
    let imdbId = evet.target.dataset.imdbId;
    movies.find((item) => {
      if (item.imdb_id === imdbId) {
        renderModal(item);
      }
    });
  }

  if (evet.target.matches(".js-bookmark-btn")) {
    let imdbId = event.target.dataset.imdbId;
    let bookmarkObj = movies.find((item) => item.imdb_id === imdbId);

    evet.target.classList.toggle("bookmarked");

    if (!bookmarks.includes(bookmarkObj)) {
      bookmarks.push(bookmarkObj);
      renderBookmarks(bookmarks, elBookmarksWr);
    }

    if (evet.target.classList.contains("bookmarked")) {
      evet.target.textContent = "Bookmarked";
      renderBookmarks(bookmarks, elBookmarksWr);

      // window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

      evet.target.classList.add(
        "text-yellow-500",
        "bg-gray-800",
        "hover:bg-yellow-500",
        "hover:text-white"
      );
    } else {
      evet.target.textContent = "Bookmark";
      let index = bookmarks.findIndex((item) => item.imdb_id === imdbId);
      if (index !== -1) {
        bookmarks.splice(index, 1);
        renderBookmarks(bookmarks, elBookmarksWr);
        evet.target.classList.remove(
          "text-yellow-500",
          "bg-gray-800",
          "hover:bg-yellow-500",
          "hover:text-white"
        );
      }
    }
  }
});

elBookmarksWr.addEventListener("click", (event) => {
  if (event.target.matches(".bookmark-delete-btn")) {
    let imdb = event.target.dataset.imdbId;
    let unique = bookmarks.findIndex((item) => item.imdb_id === imdb);
    if (unique !== -1) {
      bookmarks.splice(unique, 1);
      renderBookmarks(bookmarks, elBookmarksWr);
    }
  }
});

elBookmarkOpenBtn.addEventListener("click", () => {
  offCanvas.classList.toggle("hidden");
});

elForm.addEventListener("submit", renderSearchedData);
