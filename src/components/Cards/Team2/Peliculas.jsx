import { useState } from "react"
import Pelicula from "./Pelicula";

export const Peliculas = () => {

    const [search, setSearch] = useState();

    const [peliculas, setPeliculas] = useState(null);

    // const [defaultPelicula, setDefaultPelicula] = useState({ title: "" })

    const handleSearch = () => {
        setPeliculas([])
        let response = fetch('http://localhost:8082/api2/movies/search/' + search);
        response
            .then(data => {
                data.json().then(obj => {
                    setPeliculas(obj);
                })

            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <div>
                <h2 className="title">Peliculas</h2>
                <div className="searcher">
                    <input
                        type="text"
                        value={search}
                        placeholder='Escribe titulo de película'
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key == 'Enter') { handleSearch() } }}
                    />
                    <div>
                        <button
                            onClick={handleSearch}
                        >
                            Buscar
                        </button>
                    </div>
                </div>
                <div className="peliculas">
                    {
                        peliculas
                            ?
                            peliculas.map((peli, index) => {
                                return <Pelicula key={index} pelicula={peli} className="pelicula" />
                            })
                            : <div className="pelicula"> No hay peliculas. </div>
                    }


                </div>
            </div>
        </>
    )
}