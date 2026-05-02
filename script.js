const bookContainer = document.querySelector(".book-container");
const bookSearchInput = document.querySelector(".book-search");
const filterBtn = document.querySelector(".book-filter");
const addBtn = document.querySelector(".add-book");
const openModalBtn = document.querySelector(".open-popup");
const closeModalBtn = document.querySelector(".close-btn");
const addBookModal = document.querySelector(".add-book-popup");
const bookTitle = document.querySelector(".book-title");
const bookAuthor = document.querySelector(".book-author");
const bookDate = document.querySelector(".book-date");
const bookStatus = document.querySelector(".book-status");
const bookListContainer = document.querySelector(".book-list-container");
const bookArray = JSON.parse(localStorage.getItem("newBook")) || [];

openModalBtn.onclick = () => addBookModal.classList.add("show");
closeModalBtn.onclick = () => addBookModal.classList.remove("show");

window.addEventListener("click", function (event) {
  if (event.target === addBookModal) {
    addBookModal.classList.remove("show");
  }
});

function bookTracker() {
  bookArray.forEach((item) => displayBooks(item));
  addBook();
  searchBook();
  statusFilter();
}

function renderBooks(bookToDisplay) {
  bookListContainer.innerHTML = "";
  bookToDisplay.forEach((item) => displayBooks(item));
}

function addBook() {
  addBtn.addEventListener("click", () => {
    const bookTitleValue = bookTitle.value;
    const bookAuthorValue = bookAuthor.value;
    const bookDateValue = bookDate.value;
    const bookStatusValue = bookStatus.value;

    if (
      bookTitleValue !== "" &&
      bookAuthorValue !== "" &&
      bookDateValue !== "" &&
      bookStatusValue !== ""
    ) {
      const newBook = {
        id: Date.now(),
        title: bookTitleValue,
        author: bookAuthorValue,
        dateAdded: bookDateValue,
        status: bookStatusValue,
      };
      bookArray.push(newBook);
      displayBooks(newBook);
      localStorage.setItem("newBook", JSON.stringify(bookArray));

      bookTitle.value = "";
      bookAuthor.value = "";
      bookDate.value = "";

      addBookModal.classList.remove("show");
    } else {
      alert(`error fill all the boxs`);
    }
  });
}

function displayBooks(book) {
  if (!book.title) return;
  const bookCard = document.createElement("div");
  bookCard.classList.add("book-card-container");

  const bookInfo = document.createElement("div");
  bookInfo.classList.add("book-info");

  const title = document.createElement("h3");
  title.textContent = `Title: ${book.title}`;

  const author = document.createElement("h4");
  author.textContent = `Author: ${book.author}`;

  const date = document.createElement("p");
  date.textContent = `Date-added: ${book.dateAdded}`;

  bookInfo.appendChild(title);
  bookInfo.appendChild(author);
  bookInfo.appendChild(date);

  const statusSelect = document.createElement("select");
  statusSelect.classList.add("status-select");
  const selectOptions = ["Not started", "Read", "Favorite"];

  selectOptions.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.toLowerCase().replace(" ", "-");
    option.textContent = opt;
    statusSelect.appendChild(option);
  });
  statusSelect.value = book.status;
  statusSelect.addEventListener("change", function () {
    book.status = statusSelect.value;
    localStorage.setItem("newBook", JSON.stringify(bookArray));
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-book");
  deleteBtn.textContent = "delete Book";

  deleteBtn.addEventListener("click", function () {
    bookCard.remove();
    const index = bookArray.findIndex((item) => item.id === book.id);
    if (index > -1) {
      bookArray.splice(index, 1);
      localStorage.setItem("newBook", JSON.stringify(bookArray));
    }
  });

  bookCard.appendChild(bookInfo);
  bookCard.appendChild(statusSelect);
  bookCard.appendChild(deleteBtn);

  bookListContainer.appendChild(bookCard);
}

function searchBook() {
  bookSearchInput.addEventListener("input", function () {
    const searchInputValue = bookSearchInput.value.toLowerCase();
    const bookSearched = bookArray.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchInputValue) ||
        item.author?.toLowerCase().includes(searchInputValue),
    );

    renderBooks(bookSearched);
  });
}

function statusFilter() {
  filterBtn.addEventListener("change", function () {
    const filterButtonValue = filterBtn.value;
    if (filterButtonValue === "default") {
      renderBooks(bookArray);
    } else {
      const filtered = bookArray.filter(
        (item) => item.status === filterButtonValue,
      );
      renderBooks(filtered);
    }
  });
}

bookTracker();
