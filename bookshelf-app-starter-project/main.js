document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const searchBookForm = document.getElementById("searchBook");
    const searchInput = document.getElementById("searchBookTitle");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
  
    const BOOKS_KEY = "bookshelf";
    let books = JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];
  
    function saveBooks() {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }
  
    function renderBooks(filteredBooks = books) {
      incompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
  
      filteredBooks.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.setAttribute("data-bookid", book.id);
        bookItem.setAttribute("data-testid", "bookItem");
  
        bookItem.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div>
            <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
            <button data-testid="bookItemEditButton">Edit Buku</button>
          </div>
        `;
  
        const toggleButton = bookItem.querySelector("[data-testid='bookItemIsCompleteButton']");
        toggleButton.addEventListener("click", () => toggleBookStatus(book.id));
  
        const deleteButton = bookItem.querySelector("[data-testid='bookItemDeleteButton']");
        deleteButton.addEventListener("click", () => deleteBook(book.id));
  
        const editButton = bookItem.querySelector("[data-testid='bookItemEditButton']");
        editButton.addEventListener("click", () => editBook(book.id));
  
        if (book.isComplete) {
          completeBookList.appendChild(bookItem);
        } else {
          incompleteBookList.appendChild(bookItem);
        }
      });
    }
  
    function addBook(title, author, year, isComplete) {
      const book = {
        id: +new Date(),
        title,
        author,
        year: Number(year),
        isComplete,
      };
  
      books.push(book);
      saveBooks();
      renderBooks();
    }
  
    function toggleBookStatus(bookId) {
      books = books.map((book) =>
        book.id === bookId ? { ...book, isComplete: !book.isComplete } : book
      );
      saveBooks();
      renderBooks();
    }
  
    function deleteBook(bookId) {
      books = books.filter((book) => book.id !== bookId);
      saveBooks();
      renderBooks();
    }
  
    function editBook(bookId) {
      const book = books.find((b) => b.id === bookId);
      if (!book) return;
  
      document.getElementById("bookFormTitle").value = book.title;
      document.getElementById("bookFormAuthor").value = book.author;
      document.getElementById("bookFormYear").value = book.year;
      document.getElementById("bookFormIsComplete").checked = book.isComplete;
  
      deleteBook(bookId);
    }
  
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("bookFormTitle").value;
      const author = document.getElementById("bookFormAuthor").value;
      const year = document.getElementById("bookFormYear").value;
      const isComplete = document.getElementById("bookFormIsComplete").checked;
  
      addBook(title, author, year, isComplete);
      bookForm.reset();
    });
  
    searchBookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
  
      if (query === "") {
        renderBooks(books);
      } else {
        const filteredBooks = books.filter((book) =>
          book.title.toLowerCase().includes(query)
        );
        renderBooks(filteredBooks);
      }
    });
  
    renderBooks();
  });
  