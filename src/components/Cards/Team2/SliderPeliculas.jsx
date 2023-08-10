import Carousel from 'react-bootstrap/Carousel';

export const SliderPeliculas = ({ peliculas }) => {
    return (
        <div>
            <Carousel controls={false} interval={3000}>
                {
                    peliculas
                        .filter(peli => peli.imageURL)
                        .map((peli, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    src={peli.imageURL}
                                    width={400}
                                    height={300}
                                />
                            </Carousel.Item>
                        ))
                }
            </Carousel>
        </div>
    );
}