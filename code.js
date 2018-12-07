const site = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&type=video&part=snippet&maxResults=16&fields=nextPageToken,items(id(videoId))&q=';

let url

let nextPage, items;
let arrayCards = [];

nextPage ?  url  + '&pageToken=' + nextPage : url

// create 'div' for buttons
const navdots = document.createElement('div');
navdots.className = 'navdots';

// create buttons
const button1 = document.createElement('div');
button1.className = 'button1';
button1.innerHTML = '1';
button1.dataset.checked = 'true';
button1.dataset.pageNum = '0';
navdots.appendChild(button1);
    
const button2 = document.createElement('div');
button2.className = 'button2';
button2.innerHTML = '2';
button2.dataset.checked = 'false';
button2.dataset.pageNum = '1';
navdots.appendChild(button2);
    
const button3 = document.createElement('div');
button3.className = 'button3';
button3.innerHTML = '3';
button3.dataset.checked = 'false';
button3.dataset.pageNum = '2';
navdots.appendChild(button3);
    
const button4 = document.createElement('div');
button4.className = 'button4';
button4.innerHTML = '4';
button4.dataset.checked = 'false';
button4.dataset.pageNum = '3';
navdots.appendChild(button4);

const windowControl = (width) => {
    width >= windowControl.prevWindowWidth ? expand(width) : narrow (width);
    windowControl.prevWindowWidth = width;
    };
    
windowControl.prevWindowWidth = window.innerWidth;

window.addEventListener('resize', () => windowControl(window.innerWidth));

const expand =(width) => {
    let elements = cards.childNodes;
    
    if (width > 1200){
        elements[3].dataset.hidden = 'false';
    }
    
    if (width > 900){
        elements[2].dataset.hidden = 'false';
    }
    
    if (width > 700){
        elements[1].dataset.hidden = 'false';
    }
    
};
    
const narrow =(width) => {
    let elements = cards.childNodes;
    
    if (width < 1200){
        elements[3].dataset.hidden = 'true';
    }
    
    if (width < 900){
        elements[2].dataset.hidden = 'true';
    }
    
    if (width < 700){
        elements[1].dataset.hidden = 'true';
    }
};

function createCards() {
    // cleaning fields with cards
    cards.innerHTML = '';
    // cleaning array with cards
    arrayCards.length = 0;

    fetch(url)
    .then(response => response.json())
    .then(json => {
        nextPage = json.nextPageToken;
        fetch('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&id=' + json.items.map( el => el.id.videoId ).join(',') + '&part=snippet,statistics&fields=items(id,%20snippet(title,description,channelTitle,publishedAt,thumbnails(medium(url))),statistics(viewCount))')
        .then(response => response.json())
        .then(json => {
            items = json.items;

            items.forEach(element => {
    
                /**
                 * creating cards
                 * creating cards elements
                 * filling cards
                 */
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.hidden = 'false';

                // creating img and links
                const img = document.createElement('img');
                card.appendChild(img);
                const anchor = document.createElement('a');
                card.appendChild(anchor);
                
                // creating author
                const author = document.createElement('div');
                author.className = 'author';
                const iAuthor = document.createElement('i')
                iAuthor.className = 'fas fa-male';
                author.appendChild(iAuthor);
                card.appendChild(author);
                const authorName = document.createElement('span');
                authorName.className = 'authorName';
                author.appendChild(authorName);

                // creating element - date
                const date = document.createElement('div');
                date.className = 'date';
                const idate = document.createElement('i');
                idate.className = 'fas fa-calendar-alt';
                date.appendChild(idate);
                card.appendChild(date);
                const dateName = document.createElement('span');
                dateName.className = 'dateName';
                date.appendChild(dateName);

                // creating element - counter
                const counter = document.createElement('div');
                counter.className = 'counter';
                const icounter = document.createElement('i');
                icounter.className = 'fas fa-eye';
                counter.appendChild(icounter);
                card.appendChild(counter);
                const counterName = document.createElement('span');
                counterName.className = 'counterName';
                counter.appendChild(counterName);

                // creating element - descriptions
                const divForDescription = document.createElement('div');
                divForDescription.className = 'divForDescription';
                const description = document.createElement('span');
                description.className = 'description';
                divForDescription.appendChild(description);
                card.appendChild(divForDescription);

                // filling cards
                img.src = element.snippet.thumbnails.medium.url;
                anchor.innerText = element.snippet.title.substring(0, 40) + '...';
                anchor.href = 'https://www.youtube.com/watch?v=' + element.id;
                authorName.innerText = element.snippet.channelTitle.substring(0,30);
                dateName.innerText = element.snippet.publishedAt.toLocaleString('ru-Ru').substring(0,10);
                counterName.innerText = element.statistics.viewCount;
                description.innerText = element.snippet.description.substring(0, 70) + '...';

                // push cards into an array
                arrayCards.push(card);
            });
            /**
             * adding 'div' cards to the body
             * calling the function output for cards with intex 0
             * adding buttons to the body
             */
            document.body.appendChild(cards);
            output(0);
            document.body.appendChild(navdots);
        }).catch(ex => console.log('error to get IDs', ex));
    }).catch(ex => console.log('error to get query', ex)); 
};

// creating 'div' for cards
const cards = document.createElement('div');
cards.className = 'cards';

// creating 'div' for input
const container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

// creating input
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Search on YouTube...';
input.addEventListener('keypress', function(event){
    if (event.key === "Enter") {
        url = site + input.value;
        // calling the cards creation function
        createCards();
  }
})

const search = document.createElement('div');
search.className = 'search';
container.appendChild(input);
container.appendChild(search);

// function for animation cards
const newAnim = () =>{
    cards.style.animation = 'fadeInDown 1s both';
    setTimeout(() => cards.style.animation = 'none', 1000);
}

// function, that looks at the click of a button
navdots.addEventListener("click",(e) => {
    navdots.childNodes.forEach((button)=>{
        button.dataset.checked = 'false';
    })
    e.target.dataset.checked = 'true';
    //calling function output for next 4 cards
    output(e.target.dataset.pageNum * 4);
});

// function, that looks at the touch of a button
navdots.addEventListener("touchend",(e) => {
    navdots.childNodes.forEach((button)=>{
        button.dataset.checked = 'false';
    })
    e.target.dataset.checked = 'true';
    output(+e.target.dataset.pageNum*4);
});

//the ountput function
function output(pageNum){
    if (cards.childNodes.length !== 0){
        cards.innerHTML = '';
    }
    for (let i = pageNum; i < pageNum+4; i++){
        cards.appendChild(arrayCards[i]);
    }
    narrow(window.innerWidth);
    newAnim();
};






