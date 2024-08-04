import {
    useState,
    useEffect
} from "react"

const KEY = '8686e457'
export function useFetch(query) {
    const [isLoding, setIsLoding] = useState(false)
    const [error, setErorr] = useState('')
    const [movie, setMovies] = useState([])
    useEffect(() => {
        const controller = new AbortController()
        async function fetchMovie() {
            try {
                setIsLoding(true)
                setErorr('')
                const response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
                    signal: controller.signal
                })
                if (!response.ok) throw new Error('something in data fetching is wrong ')
                const data = await response.json()

                if (data.Response == 'False') throw new Error('keyword is wrong')
                setMovies(data.Search)

            } catch (error) {
                if (error.name == 'AbortError') return
                setErorr(error.message)

            } finally {
                setIsLoding(false)
            }
        }
        if (query.length < 3) {
            setMovies([])
            setErorr('')
            return
        }
        fetchMovie()

        return () => controller.abort()
    }, [query])
    return {
        isLoding,
        error,
        movie
    }
}
export function useLocalStorage(initialState) {
    const [value, setValue] = useState(() => {
        const newWatched = localStorage.getItem('watched')
        return newWatched!=null? JSON.parse(newWatched):initialState
    })
    useEffect(() => {
        localStorage.setItem('watched', JSON.stringify(value))

    }, [value])
    return [value, setValue]
}

export function useKey(onBack,key){
    useEffect(() => {
        function Close(e) {
            if (e.code == key) onBack()

        }
        document.addEventListener('keydown', Close)

        return () => document.removeEventListener('keydown', Close)
    }, [onBack,key])
}