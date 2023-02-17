// JQuery
// $('.search-button').on('click', function(){
//     $.ajax({
//         url :'http://www.omdbapi.com/?apikey=1e0d877f&s=' + $('.input-keyword').val(),
//         success : result => {
//             const movies = result.Search;
//             let cards = '';
//             movies.forEach(element => {
//                 cards += showCard(element);
//             });
            
//             $('.movie-container').html(cards);
    
//             $('.modal-detail-button').on('click', function(){
//                 $.ajax({
//                     url : 'http://www.omdbapi.com/?apikey=1e0d877f&i=' + $(this).data('imdb'), 
//                     success : m => {
//                         const movieDetail = showDetail(m);
                        
//                         $('.modal-body').html(movieDetail);                 
//                     },
//                     error :(e) =>{
//                         console.log(e.responseText);
//                     }
//                 })
//             });
//         },
//         error : (e) =>{
//             console.log(e.responseText);
//         }
//     })
    
// });

////////////////////
// //Penggunaan Fetch
// const seachButton = document.querySelector('.search-button');
// seachButton.addEventListener('click', function(){
//     //Dalam fetch wajib ada url atau resourcenya
//     //Fungsi 2 then pada code dibawah berfungsi untuk menampilkan data dalam bentuk json karena awalnya tidak berbentuk json

//     const inputKeyword = document.querySelector('.input-keyword');
//     fetch('http://www.omdbapi.com/?apikey=1e0d877f&s=' + inputKeyword.value)
//         .then(response => response.json())
//         .then(response => {
//             const movies = response.Search;
//             let cards = '';
//             movies.forEach(m => cards += showCard(m));
//             const movieContainer = document.querySelector('.movie-container');
//             movieContainer.innerHTML = cards;


//             // Ketika tombol detail di click
//             const modalDetailButton = document.querySelectorAll('.modal-detail-button');
//             modalDetailButton.forEach(btn => {
//                 btn.addEventListener('click', function(){
//                     const imbdID = this.dataset.imdb
//                     fetch('http://www.omdbapi.com/?apikey=1e0d877f&i=' + imbdID)
//                     .then(response => response.json())
//                     .then(m => {
//                         const movieDetail = showDetail(m);
//                         const modalBody = document.querySelector('.modal-body');
//                         modalBody.innerHTML = movieDetail;
//                     })
//                 })
//             })
//         })
         
// });

//Dibuat lebih rapi
//Apabila code dibawah langsung di console.log tanpa adanya async dan await maka akan menghasilkan hasil promises pending
//Karena ketika kode di proses dan getMovies akan masuk ke event loop terlebih dahulu karena termasuk async dan proses console.log akan dilakukan terlbih dahulu.
const seachButton = document.querySelector('.search-button');
seachButton.addEventListener('click', async function(){
    try{

        const inputKeyword = document.querySelector('.input-keyword');
        // await berfungsi untuk menunggu proses tersebut selesai baru dilanjutkan oleh proses lain
        const movies =  await getMovies (inputKeyword.value);
        updateUI(movies);
    }catch(err){
        alert(err);
    }
});

//Search kosong
//url fetch salah
//Fetch akan gagal ketika networknya error


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



//Event binding => memberikan event kepada element yang tidak ada namun apabila sudah ada maka akan bisa berjalan
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