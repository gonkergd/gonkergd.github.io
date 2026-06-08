function Book(title, author, pages, read){
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
    this.info = function() {
        let first = this.title + " by " + this.author + ", " + this.pages + " pages, ";
        if (!this.read){
            return first + "not read yet";
        }
        return first + "book read";
    };
}

Book.prototype.readTrigger = function () {
    this.read = !this.read;
};

const lib = [];
let body = document.querySelector("body");
let newBook = document.querySelector("form");

function addBookToLibrary(title, author, pages, read){
    lib.push(new Book(title, author, pages, read));
}

function bookInfo() {
    lib.forEach(n => {
        let book = document.createElement("div");
        book.textContent = n.info();
        body.appendChild(book);
    });
} 

newBook.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let bookDiv = document.createElement("div");
    let bookObject = new Book(formData.get("title"), 
    formData.get("author"),
    formData.get("pages"),
    formData.get("read"));
    bookDiv.textContent = bookObject.info();
    bookDiv.style.backgroundColor = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
    bookDiv.style.width = "fit-content";
    bookDiv.style.padding = "8px";
    bookDiv.setAttribute("data-uuid", bookObject.id);
    let destroyerButton = document.createElement("button");
    destroyerButton.textContent = "Remove";
    destroyerButton.style.marginLeft = "4px";
    destroyerButton.addEventListener("click", (e) => {
        destroyerButton.parentElement.remove();
    });
    if (!bookObject.read) {
        let readButton = document.createElement("button");
        readButton.textContent = "Mark as Read";
        readButton.style.marginLeft = "4px";
        readButton.addEventListener("click", (e) => {
            bookObject.readTrigger();
            bookDiv.textContent = bookObject.info();
            bookDiv.appendChild(destroyerButton);
        });
        bookDiv.appendChild(readButton);
        bookDiv.appendChild(destroyerButton);
    } else {
        bookDiv.appendChild(destroyerButton);
    }
    
    body.appendChild(bookDiv);
});
