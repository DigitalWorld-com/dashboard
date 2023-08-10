import './team2.css';
const DetallePelicula = ({ pelicula }) => {

    return (
        <>
            <div className='detail-box'>
                <h3 className='title'>{pelicula.title}</h3>
                <div>
                    <img src={pelicula.imageURL} width={'50%'} />
                </div>
                <div className='description'>{pelicula.description}</div>
            </div>
        </>
    )
}

export default DetallePelicula;