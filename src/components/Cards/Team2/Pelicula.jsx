import { useEffect, useState } from "react";
import './team2.css';
import DetallePelicula from "./DetallePelicula";



const Pelicula = (props) => {

    const [pelicula] = useState(props.pelicula);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleClick = () => {
        setIsDetailOpen(!isDetailOpen);
    }

    const handleHide = () => {
        setIsDetailOpen(false);
    }

    return (
        <>
            <div className="pelicula" onClick={handleClick}>{pelicula.title}</div>
            {
                isDetailOpen &&
                <DetallePelicula isOpen={isDetailOpen} pelicula={pelicula} />
            }
        </>
    )
}

export default Pelicula;