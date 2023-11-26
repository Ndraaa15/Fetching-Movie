const seachButton = document.querySelector('.search-button');
seachButton.addEventListener('click', async function(){
    try{
        const inputKeyword = document.querySelector('.input-keyword');
        const movies =  await getMovies (inputKeyword.value);
        updateUI(movies);
    }catch(err){
        alert(err);
    }
});

function getMovies(keyword){
    return fetch('http://www.omdbapi.com/?apikey=1e0d877f&s=' + keyword)
    .then(response => {
        if (!response.ok){
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(response => {
        if (response.Response === "false"){
            throw new Error(response.Error);
        }
        return response.Search;
    });
};

function updateUI (movies){
    let cards = '';
    movies.forEach(m => cards += showCard(m));
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards; 
};  


document.addEventListener('click', async function(e){
    if (e .target.classList.contains('modal-detail-button')){
        const imdbID = e.target.dataset.imdb;
        const movieDetail = await getMovieDetail(imdbID);
        updateUIDetail(movieDetail);
    }
});
 
function getMovieDetail(imdbID){
    return fetch('http://www.omdbapi.com/?apikey=1e0d877f&i=' + imdbID)
            .then(response => response.json())
            .then(m => m);
};

function updateUIDetail (m){
    const movieDetail = showDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
};


function showCard(element){
    return `<div class="col-md-4 my-3">
                <div class="card">
                    <img src="${element.Poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${element.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${element.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" 
                        data-target="#movieDetailModal" data-imdb="${element.imdbID}">Show Detail</a>
                    </div>
                </div>
            </div>`;
}

function showDetail (m){
    return `<div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <img src="${m.Poster}" class="img-fluid">
            </div>
                   <div class="col-md">
                        <ul class="list-group">
                              <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                              <li class="list-group-item"><strong>Director : </strong>${m.Director}</li>
                              <li class="list-group-item"><strong>Actors : </strong>${m.Actors}</li>
                              <li class="list-group-item"><strong>Writter : </strong>${m.Writer}</li>
                              <li class="list-group-item"><strong>Plot : </strong> <br>${m.Plot}</li>
                        </ul>
                   </div>
            </div>
        </div>`;
}
