// Exercise I. Random numbers
function sortEvenOddNumbers(sourceArr, evenArr, oddArr) {
    sourceArr.forEach((num) => {
        num % 2 === 0 ? evenArr.push(num) : oddArr.push(num);
    });

    evenArr.sort((num1, num2) => num1 - num2);
    oddArr.sort((num1, num2) => num1 - num2);
}

function createHtmlElement(wrapId, content, elementClasses, elementId, elementTag = 'div') {
    const htmlWrap = document.getElementById(wrapId);
    if (htmlWrap) {
        const htmlElement = document.createElement(elementTag);
        elementId && (htmlElement.id = elementId);
        elementClasses && (htmlElement.className = elementClasses);
        content && (htmlElement.innerHTML = content);
        htmlWrap.append(htmlElement);

        return htmlElement;
    }
    return null;
}

function createRandomNumbersTable(wrapId, tableLenght = 20, min = 1, max = 100) {
    const wrap = document.getElementById(wrapId);
    if (wrap) {
        wrap.innerHTML = '';
        const randomNumbers = [];
        const evenNumbers = [];
        const oddNumbers = [];

        for (let i = 0; i < tableLenght; i++) {
            const randomNumber = Math.floor(Math.random() * max) + min;
            randomNumbers.push(randomNumber);
        }

        sortEvenOddNumbers(randomNumbers, evenNumbers, oddNumbers);

        const leftColumn = createHtmlElement(wrapId, null, 'table-column', 'oddNumbers');
        const rightColumn = createHtmlElement(wrapId, null, 'table-column', 'evenNumbers');

        createHtmlElement(leftColumn.id, 'Odd numbers', 'table-header');
        createHtmlElement(rightColumn.id, 'Even numbers', 'table-header');
        evenNumbers.forEach((num) => {
            createHtmlElement(leftColumn.id, num, 'table-item');
        });
        oddNumbers.forEach((num) => {
            createHtmlElement(rightColumn.id, num, 'table-item');
        });
    }
}

// Exercise II. Forms
const addBook = (e) => {
    e.preventDefault();

    const form = document.forms[e.target.name];

    const book = {
        title: form['bookTitle'].value,
        author: form['bookAuthor'].value,
        priority: form['bookPriority'].value,
        category: [],
    };

    const bookCategories = Array.from(form['category'].getElementsByTagName('INPUT'));
    bookCategories.forEach((item) => {
        if (item.checked) {
            book.category.push(item.name);
        }
    });

    localStorage.setItem(`book-${form['bookTitle'].value}`, JSON.stringify(book));
    form.reset();
    showTableFromLocalStorage();
};

window.onload = () => {
    showTableFromLocalStorage();

    // load file
    loadQuote();
};

function showTableFromLocalStorage() {
    const BOOK_TEMPLATE = [
        { title: 'Tytuł' },
        { author: 'Autor' },
        { priority: 'Priorytet przeczytania' },
        { category: 'Kategorie' },
        { delete: '' },
    ];
    document.getElementById('libraryTable').innerHTML = '';

    // create table header
    createHtmlElement('libraryTable', null, null, 'libraryTableHeader', 'tr');
    BOOK_TEMPLATE.forEach((item) => {
        createHtmlElement('libraryTableHeader', Object.values(item), 'table-header', null, 'th');
    });

    // create table content
    for (const [key, value] of Object.entries(localStorage)) {
        if (key.includes('book-')) {
            const book = JSON.parse(value);
            let content = '';

            createHtmlElement('libraryTable', null, null, key, 'tr');

            BOOK_TEMPLATE.forEach((item) => {
                content = book[Object.keys(item)];
                if (Array.isArray(content)) {
                    content = content.join(', ');
                }
                const htmlTd = createHtmlElement(key, content, 'table-item', null, 'td');

                // create button for delete book
                if (Object.keys(item)[0] === 'delete') {
                    const deleteButton = document.createElement('button');
                    deleteButton.innerHTML = 'Usunąć';
                    deleteButton.className = 'button';
                    deleteButton.onclick = () => {
                        localStorage.removeItem(key);
                        showTableFromLocalStorage();
                    };

                    htmlTd.append(deleteButton);
                }
            });
        }
    }
}

// Exercise III. Loading quotes
let actualQuote = null;
let prevQuote = null;
let prevQuoteButton = null;

async function loadQuote() {
    try {
        const resp = await fetch(
            'https://gist.githubusercontent.com/natebass/b0a548425a73bdf8ea5c618149fe1fce/raw/f4231cd5961f026264bb6bb3a6c41671b044f1f4/quotes.json'
        );
        const data = await resp.json();

        const randomNum = Math.floor(Math.random() * data.length);
        const randomQuote = data[randomNum];

        writeQuote(randomQuote);
    } catch (e) {
        console.error(e);
    }
}

function loadNextQuote() {
    prevQuote = actualQuote;
    loadQuote();

    if (!prevQuoteButton) {
        const nextQuoteButton = document.getElementById('nextQuote');
        prevQuoteButton = document.createElement('button');
        prevQuoteButton.className = 'button';
        prevQuoteButton.innerHTML = 'Poprzedni cytat';
        prevQuoteButton.onclick = () => loadPrevQuote();

        nextQuoteButton.after(prevQuoteButton);
    }
}
function loadPrevQuote() {
    writeQuote(prevQuote);
    prevQuoteButton.remove();
    prevQuoteButton = null;
}

function writeQuote(quote) {
    actualQuote = quote;
    document.getElementById('quoteWrap').innerHTML = '';
    createHtmlElement('quoteWrap', quote.quote, null, null, 'q');
    createHtmlElement('quoteWrap', `Author: ${quote.author}`);
}

// Exercise IV. Img css
function getImage() {
    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = '';
    body.className = 'body-fill';

    const img = document.createElement('img');
    img.className = 'img-fill';
    img.src = './img/everest.jpg';
    body.append(img);
}
