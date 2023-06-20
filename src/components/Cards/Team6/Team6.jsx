import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'react-bootstrap';
import { faSliders } from '@fortawesome/free-solid-svg-icons';

export const Team6 = () => {
  const [respuesta, setRespuesa] = useState(undefined);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const handleShowSettingModal = () => setShowSettingModal(true);
  const handleCloseSettingModal = () => setShowSettingModal(false);

  useEffect(() => {
    const llamada = async () => {
      let response = await fetch('http://localhost:8086/api6/museos');
      let data = await response.text();
      setRespuesa(data);
    };
    llamada();
  }, []);

  return (
    <>
      <div className="card">
        <FontAwesomeIcon
          className="fw-bold fs-5 position-absolute"
          style={{ right: '2rem', cursor: 'pointer' }}
          icon={faSliders}
          onClick={handleShowSettingModal}
        ></FontAwesomeIcon>

        <p>{respuesta}</p>
      </div>

      {/* MODAL EDITABLE PARA CADA TEAM */}
      <Modal show={showSettingModal} onHide={handleCloseSettingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Configuracion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aqui van la interfaz front dependiendo de la funcionalidad, en caso de que necesiten ayuda con esta parte porfavor avisarme (German).*/}
          <form className="my-form">
            <div className="boxInput">
              <label htmlFor="campo1">Campo 1</label>
              <input type="text" id="campo1" />
            </div>
            <div className="boxInput">
              <label htmlFor="campo2">Campo 2</label>
              <input type="text" id="campo2" />
            </div>
            <div className="boxInput">
              <label htmlFor="campo3">Campo 3</label>
              <input type="text" id="campo3" />
            </div>
            <button>Enviar</button>
          </form>
          {/* Este form es solo para ejemplificar, como mencione, se puede cambiar dependediendo del proyecto */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSettingModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
