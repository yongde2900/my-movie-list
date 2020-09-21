const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const MOVIES_PER_PAGE = 12
let filteredMovies =[]
//監聽 data panel
dataPanel.addEventListener('click',function onPanelClick(event){
    if(event.target.matches('.btn-show-movie')){
        console.log(event.target.dataset.id)
        showMovieModal(event.target.dataset.id)
    }
    else if (event.target.matches('.btn-add-favorite')){
        addToFavorite(Number(event.target.dataset.id))
    }
})
//監聽serch form
searchForm.addEventListener('submit',function onSerchFormSumbit(event){
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    // if(!keyword.length){
    //     return alert('請輸入有效字串')
    // }
    filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(keyword)
    )
    if(filteredMovies.length === 0 ){
        return alert(`你輸入的關鍵字 ${keyword}沒有資料`)
    }
    renderPaginator(filteredMovies.length)
    renderMovieList(getMoviesByPage(1))
})
//監聽 paginator
paginator.addEventListener('click',function onPaginatorClick(){
    if(event.target.tagName !== 'A') return
    const page = Number(event.target.innerText)
    renderMovieList(getMoviesByPage(page))
})
function renderMovieList(data){
    let rawHTML = ''
    data.forEach(item => {
        rawHTML += `
        <div class="col-sm-3">
                <div class="mb-2">
                    <div class="card">
                        <img src="${POSTER_URL + item.image}"
                            class="card-img-top" alt="Movie Poster" />
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                                data-target="#movie-modal" data-id="${item.id}">More</button>
                            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        dataPanel.innerHTML = rawHTML
    });
}
function showMovieModal(id){
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    axios.get(INDEX_URL + id).then(response => {
        const data = response.data.results
        console.log(data)
        modalTitle.innerText = data.title
        console.log(data.image)
        modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
        modalDate.innerText =  `Release date: ${data.release_date}`
        modalDescription.innerText = data.description
    })
}
function addToFavorite(id){
    const list = JSON.parse(localStorage.getItem('favoritesMovie')) || [ ]
    if(list.some(movie => movie.id === id)){
        return alert('此電影已在收藏清單內')
    }
    list.push(movies.find(movie => movie.id === id))
    localStorage.setItem('favoritesMovie',JSON.stringify(list))
}
function getMoviesByPage(page){
    const data = filteredMovies.length ? filteredMovies:movies
    const startIndex = (page - 1) * MOVIES_PER_PAGE
    return data.slice(startIndex,startIndex + MOVIES_PER_PAGE)
}
function renderPaginator(amount){
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    let rawHTML = ''
    for(let i = 1; i <= numberOfPages; i++){
        rawHTML += `<li class="page-item"><a class="page-link" href="javascript:;" data-page=${i}>${i}</a></li>`
    }
    console.log(rawHTML)
    paginator.innerHTML = rawHTML
}

axios.get(`${INDEX_URL}`).then((response) => {
        movies.push(...response.data.results)
        console.log(movies)
        renderMovieList(getMoviesByPage(1))
        renderPaginator(movies.length)
})
.catch((err) => console.log(err))

