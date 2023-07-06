import { useEffect, useState } from "react";

import {
  faClockRotateLeft,
  faRainbow,
  faSliders,
  faSnowflake,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";

export const Team1 = () => {
  const [realtime, setRealtime] = useState(undefined);
  const [country, setCountry] = useState(undefined);
  const [iconWeather, setIconWeather] = useState(undefined);
  const [bgCard, setBgCard] = useState(undefined);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showHistoricalModal, setShowHistoricalModal] = useState(false);
  const [countryInput, setCountryInput] = useState(undefined);
  const [historyRealtime, setHistoryRealTime] = useState([]);

  const handleCloseSettingModal = () => setShowSettingModal(false);
  const handleShowSettingModal = () => setShowSettingModal(true);

  const handleCloseHistoricalModal = () => setShowHistoricalModal(false);
  const handleShowHistoricalModal = async () => {
    // Llamada a la API
    const response = await fetch("http://localhost:8081/realtime/history");
    const history = await response.json();

    setHistoryRealTime(!history ? [] : history);

    setShowHistoricalModal(true);
  };

  const formatDate = (date) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("es-AR", options);
  };

  const handleSelectRealtime = (history) => {
    setCountry(history.realtime.location.name);
    setCountryInput(history.realtime.location.name);
    styleCard(history.realtime);
    setShowHistoricalModal(false);
  };

  const handleSettingChange = async () => {
    const requestAPI = {
      location: countryInput,
      units: "metric",
    };
    getRealtime(requestAPI);
    setShowSettingModal(false);
  };

  const bgCooler = "#330031";
  const bgHot = "#ff7251";
  const bgNormal = "#5BC8FF";

  const styleCard = (realtime) => {
    // Seleccion de iconos
    if (realtime.temperature <= 15) {
      setIconWeather(faSnowflake);
    } else if (realtime.temperature >= 25) {
      setIconWeather(faSun);
    } else {
      setIconWeather(faRainbow);
    }

    // Seleccion de color de fondo
    if (realtime.temperature <= 10) {
      setBgCard(bgCooler);
    } else if (realtime.temperature >= 30) {
      setBgCard(bgHot);
    } else {
      setBgCard(bgNormal);
    }

    setRealtime(realtime);
  };

  const getRealtime = async (request) => {
    // Llamada a la API
    const response = await fetch(
      "http://localhost:8081/realtime?" + new URLSearchParams(request)
    );
    const realtime = await response.json();
    setCountry(realtime.location.name);
    setCountryInput(realtime.location.name);
    styleCard(realtime);
  };

  useEffect(() => {
    const requestAPI = {
      location: "Buenos Aires",
      units: "metric",
    };
    setCountry("Buenos Aires");
    getRealtime(requestAPI);
  }, []);

  return (
    <>
      <div className="card border-0" style={{ "background-color": bgCard }}>
        <div style={{ color: "white" }}>
          <FontAwesomeIcon
            className="fw-bold fs-5 position-absolute"
            style={{ right: "4rem", cursor: "pointer" }}
            icon={faClockRotateLeft}
            onClick={handleShowHistoricalModal}
          ></FontAwesomeIcon>

          <FontAwesomeIcon
            className="fw-bold fs-5 position-absolute"
            style={{ right: "2rem", cursor: "pointer" }}
            icon={faSliders}
            onClick={handleShowSettingModal}
          ></FontAwesomeIcon>
        </div>
        <div className="card-body">
          <h1 className="card-tile fw-semibold" style={{ color: "white" }}>
            {`${realtime?.temperature} C`}
            <FontAwesomeIcon
              className="ps-3"
              icon={iconWeather}
            ></FontAwesomeIcon>
          </h1>
          <div
            className="card-text d-flex flex-column"
            style={{ color: "white" }}
          >
            <small>
              Sensación Térmica
              <span className="fw-semibold ps-1">
                {realtime?.temperatureApparent} C
              </span>
            </small>
            <small className="fw-semibold">{country}</small>
          </div>
        </div>
      </div>

      <Modal show={showSettingModal} onHide={handleCloseSettingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Configuración de clima</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>País o ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buenos Aires"
              value={countryInput}
              onChange={(e) => {
                setCountryInput(e.target.value);
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSettingModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSettingChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showHistoricalModal} onHide={handleCloseHistoricalModal}>
        <Modal.Header closeButton>
          <Modal.Title>Historial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {historyRealtime.map((h, i) => {
              return (
                <ListGroup.Item
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleSelectRealtime(h);
                  }}
                >
                  <div className="d-flex flex-row justify-content-between w-100">
                    {h.realtime.location.name}
                    <span className="fw-bold" style={{ color: bgNormal }}>
                      {formatDate(new Date(h.time))}
                    </span>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseHistoricalModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
