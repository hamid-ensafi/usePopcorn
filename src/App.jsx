import { useEffect, useRef, useState } from 'react'
import './components/style.css'
import StarRating from './components/StarRate.jsx'
import { useFetch, useKey, useLocalStorage } from './components/usemovie.js'



const KEY = '8686e457'

function App() {

    // const [watched, setWatched] = useState(() => {
    //     const newWatched = localStorage.getItem('watched')
    //     return JSON.parse(newWatched)
    // })
    const [watched, setWatched] = useLocalStorage([])
    const [query, setQuery] = useState('')
    const [selectedId, setSelectedId] = useState(null)
    const { isLoding, error, movie } = useFetch(query)
    useLocalStorage(watched)

    function handleSelect(id) {
        setSelectedId(currentId => currentId === id ? null : id)

    }
    function onClosePage() {
        setSelectedId(null)
    }
    function handleAddWatch(movie) {
        setWatched((curr) => [...curr, movie])
        onClosePage()
    }
    function handleDelet(id) {
        setWatched(curr => curr.filter(item => item.imdbID !== id))
    }


    return (
        <>
            <Header >
                <SearchBox query={query} setQuery={setQuery}></SearchBox>
                <Resualt movie={movie}></Resualt>
            </Header>
            <Main>
                <Box>
                    {/* {( ) ? <Loding></Loding> : <ListItems movie={movie}></ListItems>}
                    {error&& <Erorr message={error}></Erorr>} */}
                    {!isLoding && error == '' && <ListItems handleSelect={handleSelect} movie={movie}></ListItems>}
                    {error && <Erorr message={error}></Erorr>}
                    {isLoding && <Loding></Loding>}
                </Box>
                <Box>

                    {selectedId ? <InfoWatchMovie watched={watched} onAddwatch={handleAddWatch} id={selectedId} onBack={onClosePage} ></InfoWatchMovie> : <><WatchedSummary watched={watched}></WatchedSummary>
                        <WatchedMovieList onDelete={handleDelet} watched={watched}></WatchedMovieList></>}


                </Box>
            </Main>
        </>
    )
}


function Header({ children }) {
    return (
        <header>
            <div className="content">
                <Logo></Logo>
                {children}
            </div>
        </header>
    )
}
function Logo() {
    return (
        <div className="logo">
            <span>🍿</span>
            <p>usePopcorns</p>
        </div>
    )
}

function SearchBox({ query, setQuery }) {
    const inputEl = useRef(null)
    useKey(function (e) {
            if (document.activeElement === inputEl.current) return
            inputEl.current.focus()
            setQuery('')
    }, 'Enter')

    return (
        <input ref={inputEl} value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder='Search Movies....' />
    )
}
function Resualt({ movie }) {
    return (
        <p>Found {movie.length} resualts</p>
    )
}
const average = (arr) => {

    return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)
}


function Main({ children }) {
    return (
        <section className='main-content'>
            {children}
        </section>
    )
}

function Box({ children }) {
    const [showMovie, setShowMovie] = useState(true)

    function handleClick() {
        setShowMovie((current) => !current)
    }
    return (
        <section className="list-box">

            <div className="box">
                <div className="button-content">
                    <button onClick={handleClick}>{showMovie ? '-' : '+'}</button>
                </div>

                {showMovie && children}

            </div>
        </section>
    )
}
function ListItems({ movie, handleSelect }) {
    return (
        <ul className='listbox-menu'>
            {movie.map(item => <ListItem handleSelect={handleSelect} key={item.imdbID} item={item}></ListItem>)}
        </ul>
    )
}

function ListItem({ item, handleSelect }) {
    return (
        <li onClick={() => handleSelect(item.imdbID)}>
            <figure>
                <img src={item.Poster} alt="" />
            </figure>
            <div className="info-list-box">
                <h3>{item.Title}</h3>
                <p>📅 {item.Year}</p>
            </div>
        </li>
    )
}

function WatchedMovieList({ watched, onDelete }) {
    return (
        <>
            <ul className='listbox-menu'>
                {watched.map((movie) => {
                    return (
                        <WatchedMovie onDelete={onDelete} movie={movie} key={movie.imdbID}></WatchedMovie>
                    )
                })}
            </ul>

        </>

    )
}

function WatchedMovie({ movie, onDelete }) {

    return (
        <li>
            <button onClick={() => onDelete(movie.imdbID)}>X</button>
            <figure>
                <img src={movie.Poster} alt="" />
            </figure>
            <div className="info-list-box">
                <h3>{movie.Title}</h3>
                <div className='watch-info'>
                    <p>⭐ {movie.imdbRating}</p>
                    <p>🌟 {movie.userRating}</p>
                    <p>🕢{movie.runtime} min</p>
                </div>
            </div>
        </li>
    )

}

function WatchedSummary({ watched }) {

    const avgImdbRating = Math.round(average(watched.map((item) => item.imdbRating)))
    const avgUserRating = Math.round(average(watched.map((item) => item.userRating)))
    const avgRunTime = Math.round(average(watched.map((item) => item.runtime)))

    return (
        <div className="sum-watched">
            <h4>movies your watched</h4>
            <div className="movie-watched-info">
                <p>{watched.length} movies</p>
                <p>⭐ {avgImdbRating}</p>
                <p>🌟 {avgUserRating}</p>
                <p>🕢{avgRunTime} min</p>
            </div>
        </div>

    )
}









function InfoWatchMovie({ id, watched, onBack, onAddwatch }) {
    const [infoMovie, setInfoMovie] = useState({})
    const [isLoding, setIsLoding] = useState(false)
    const { Title: title, Year: year, Rated: rated, Released: released, Runtime: runtime, Genre: genre, Director: director, Writer: writer, Actors: actors, Plot: plot, imdbRating: imdbrating, Poster } = infoMovie
    const [userRating, setUserRating] = useState(0)
    const isWatched = watched.map(item => item.imdbID).includes(id)
    const userRated = watched?.find(movie => movie.imdbID === id)?.userRating
    const countRef = useRef(0)
    function handleAddList() {
        const newMovie = {
            Title: title,
            imdbRating: imdbrating,
            Year: year,
            Poster,
            runtime: parseInt(runtime),
            imdbID: id,
            userRating

        }
        onAddwatch(newMovie)
    }
    useEffect(() => {
        if (userRating > 0) countRef.current += 1

    }, [userRating])

    useEffect(() => {
        async function fetchMoreInfoMovie() {
            setIsLoding(true)
            const response = await fetch(`https://omdbapi.com/?apikey=${KEY}&i=${id}`)
            const data = await response.json()
            setInfoMovie(data)
            setIsLoding(false)

        }
        fetchMoreInfoMovie()
    }, [id])
    useEffect(() => {
        if (!title) return
        document.title = `movie || ${title}`
        return () => document.title = `usePopCorn`
    }, [title])
    useKey(onBack, 'Escape')
    return (
        <div className="info-movie-container">
            {isLoding ? <Loding></Loding> :
                <>
                    <button onClick={onBack} className='back-to-home'>👈</button>
                    <div className="movie-content">
                        <figure><img src={Poster} alt="" /></figure>
                        <div className="title-more-info">
                            <h3>{title}</h3>
                            <p>{released} {runtime}</p>
                            <p>{genre}</p>
                            <p>🌟IMDb Rating{imdbrating}</p>
                        </div>
                    </div>
                    <div className="movie-plots">
                        <div className="rating-content">
                            {!isWatched ? <><StarRating onSetRating={setUserRating} size={20} Length={10} color='#f4dc50'></StarRating> {userRating > 0 && <button onClick={handleAddList} >Add to list </button>}</> : <p>your rated with movie {userRated}  🌟</p>}
                        </div>
                        <p>{plot} </p>
                        <p>starring {actors}</p>
                        <p>Directed by {director}</p>
                    </div>

                </>}
        </div>
    )
}

function Loding() {
    return <p className='load'>Is LOADING . . . .</p>
}

function Erorr({ message }) {
    return <p className='load'>{message}</p>
}

export default App