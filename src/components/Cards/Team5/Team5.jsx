import { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { faSliders, faClockRotateLeft, faRefresh, faSearch, faPencil, faTrashCan } 
 from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Team5 = () => {
  const [showSettingModal, setShowSettingModal] = useState(false);
  const handleShowSettingModal = () => setShowSettingModal(true);
  const handleCloseSettingModal = () => setShowSettingModal(false);
  const [showHistoricalModal, setShowHistoricalModal] = useState(false);
  const changeShowHistoricalModal = (show) => {
    setShowHistoricalModal(show); 
    setSearchCoin(show);
    if(!show){
      setCoinText('');
      setHistory([]);
    }
  };
  const [coin, setCoin] = useState('Bitcoin');
  const [respuesta, setRespuesta] = useState(undefined);
  const [dolar, setDolar] = useState(undefined);
  const [conversion, setConversion] = useState(undefined);
  const [history, setHistory] = useState([]);
  const [coinText, setCoinText] = useState("");
  const [searchCoin, setSearchCoin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(undefined);
  const [editData, setEditData] = useState('');
  const editConversion = (id) => {
    setMessage('');
    setEditId(id);
    setShowEditModal(true);
  };
  const [saveEditedData, setSaveEditedData] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [userData, setUserData] = useState({user: '', password: ''});

  useEffect(() => {
    const llamada = async () => {
      try {
        if(!respuesta && !dolar){
          const response = await fetch('http://localhost:8085/crypto/crypto-price?ids='+coin.toLowerCase());        
          if (response.ok) {
            const data = await response.json();
            setRespuesta(data);
          } else {
            console.log('Failed to retrieve cryptocurrency prices');
          }
        }
        if(!dolar && respuesta != undefined){
          const dolarData = await fetch('http://localhost:8085/dollar/data');
          if (dolarData.ok) {
            const data = await dolarData.json();
            setDolar(data);
          } else {
            console.log('Failed to retrieve dollar data');
          }
        }
        if(!conversion && respuesta != undefined && dolar != undefined){
          const conversionRequest = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              coinName: coin,
              coinPrice: respuesta.price,
              officialBuyPrice: dolar.officialBuyPrice,
              officialSellPrice: dolar.officialSellPrice,
              blueBuyPrice: dolar.blueBuyPrice,
              blueSellPrice: dolar.blueSellPrice
            })
          };
          const conversionData = await fetch('http://localhost:8085/convert/dollar-pesos', conversionRequest);
          if (conversionData.ok) {
            const data = await conversionData.json();
            setConversion(data);
          } else {
            console.log('Failed to retrieve conversion data');
          }
        }
        if(saveEditedData && editId!=0){
          const conversionRequest = {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa(userData.user + ':' + userData.password)
            },
            body: JSON.stringify(editData)
          };
          const conversionUpdate = await fetch('http://localhost:8085/convert/conversion', conversionRequest);
          if (conversionUpdate.ok) {
            setShowEditModal(false);
            setSearchCoin(true);
          } else if(conversionUpdate.status == 401 || conversionUpdate.status == 403){
            setEditId(0);
            setMessage('No tiene permisos para actualizar');
          } else {
            console.log('Failed to update conversion data. Status ' + conversionUpdate.status);
          }
          setSaveEditedData(false);
        }
        if(searchCoin){
          const historicalData = await fetch('http://localhost:8085/convert/allconversions?text='+coinText);
          if (historicalData.ok) {
            const data = await historicalData.json();
            setHistory(data);
            setSearchCoin(false);
          }
        }
        if(editId && deleteId==0 && showEditModal && !saveEditedData){
          const conversionData = await fetch('http://localhost:8085/convert/conversion/'+editId);
          if (conversionData.ok) {
            const data = await conversionData.json();
            setEditData(data);
          }
        }
        if(deleteId != 0){
          const conversionRequest = {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa(userData.user + ':' + userData.password)
           }
          };
          const deleteConversion = await fetch('http://localhost:8085/convert/delete/'+deleteId, conversionRequest);
          if(deleteConversion.status == 204){
            setSearchCoin(true);
          } else if(deleteConversion.status == 401 || deleteConversion.status == 403){
            setMessage('No tiene permisos para borrar');
          } else{
            console.log('Failed to delete conversion data. Status ' + deleteConversion.status);
          }
          setDeleteId(0);
        }
        if(message.length>0){setShowMessage(true);}
      } catch (error) {
        console.error('Error:', error);
      }
    };

    llamada();
  }, [respuesta, dolar, searchCoin, editId, saveEditedData, deleteId]);


  const coinPrice = respuesta && respuesta.price ? " " + respuesta.currency + " $" + respuesta.price : "";
  const dolarTitle = dolar ? <h4>Precio del Dolar</h4> : "";
  const dolarOficial = dolar ?
    <span>{dolar.officialName}: Compra ${dolar.officialBuyPrice} - Venta ${dolar.officialSellPrice}</span>
    : "";
  const dolarBlue = dolar ?
    <span>{dolar.blueName}: Compra ${dolar.blueBuyPrice} - Venta ${dolar.blueSellPrice}</span>
    : "";
  const conversionTitle = conversion ? <h4>Conversión a Pesos</h4> : "";
  const conversionOficial = conversion ?
    <span>{coin} {dolar.officialName}: Compra ${conversion.officialBuyPrice} - Venta $
    {conversion.officialSellPrice}</span>
    : "";
  const conversionBlue = conversion ?
    <span>{coin} {dolar.blueName}: Compra ${conversion.blueBuyPrice} - Venta ${conversion.blueSellPrice}</span>
    : "";

  return (
    <div className="card">
      <FontAwesomeIcon
        className="fw-bold fs-5 position-absolute"
        style={{ right: '6rem', cursor: 'pointer' }}
        icon={faRefresh}
        onClick={() => {setConversion(undefined); setRespuesta(undefined); setDolar(undefined)}}
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        className="fw-bold fs-5 position-absolute"
        style={{ right: "4rem", cursor: "pointer" }}
        icon={faClockRotateLeft}
        onClick={() => changeShowHistoricalModal(true)}
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        className="fw-bold fs-5 position-absolute"
        style={{ right: '2rem', cursor: 'pointer' }}
        icon={faSliders}
        onClick={handleShowSettingModal}
      ></FontAwesomeIcon>
      <label>
        <select onChange={(e) => {setCoin(e.target.value); setConversion(undefined); setRespuesta(undefined); setDolar(undefined)}}>
          <option value='Bitcoin'>Bitcoin</option>
          <option value='Ethereum'>Ethereum</option>
          <option value='Solana'>Solana</option>
        </select>
        {coinPrice}
      </label>
      {dolarTitle}
      {dolarOficial}
      {dolarBlue}
      {conversionTitle}
      {conversionOficial}
      {conversionBlue}

      {/* MODAL EDITABLE PARA CADA TEAM */}
      <Modal show={showSettingModal} onHide={handleCloseSettingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Configuracion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="my-form">
            <div className="boxInput">
              <label htmlFor="campo1">Usuario</label>
              <input type="text" id="campo1" value={userData.user} onChange={(e) => setUserData(prevData => ({...prevData, user: e.target.value}))} />
            </div>
            <div className="boxInput">
              <label htmlFor="campo2">Password</label>
              <input type="password" id="campo2" value={userData.password} onChange={(e) => setUserData(prevData => ({...prevData, password: e.target.value}))} />
            </div>
          </form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSettingModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showHistoricalModal} onHide={() => changeShowHistoricalModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>Historial de Conversiones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="boxInput">
            <label htmlFor="campo3">Moneda</label>
            <input type="text" id="campo3" onChange={(e)=>{setCoinText(e.target.value);}} />
            <FontAwesomeIcon
              className="fw-bold fs-5 position-absolute"
              style={{ right: '2rem', cursor: 'pointer' }}
              icon={faSearch}
              onClick={() => {setSearchCoin(true);}}
            ></FontAwesomeIcon>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Moneda</th>
                <th>Precio</th>
                <th>Compra Oficial</th>
                <th>Venta Oficial</th>
                <th>Compra Blue</th>
                <th>Venta Blue</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => {
                return (
                <tr key={index} id={index}>
                  <td>{item.id}</td>
                  <td>{item.coinName}</td>
                  <td>{item.coinPrice}</td>
                  <td>{item.officialBuyPrice}</td>
                  <td>{item.officialSellPrice}</td>
                  <td>{item.blueBuyPrice}</td>
                  <td>{item.blueSellPrice}</td>
                  <td>{item.dateCreated}</td>
                  <td>
                    <FontAwesomeIcon
                      style={{ cursor: 'pointer' }}
                      icon={faPencil}
                      onClick={() => editConversion(item.id) }
                    ></FontAwesomeIcon>
                    <FontAwesomeIcon
                      style={{ cursor: 'pointer' }}
                      icon={faTrashCan}
                      onClick={() => {setDeleteId(item.id); setMessage('')}}
                    ></FontAwesomeIcon>
                  </td>
                </tr>
                );
              })
            }
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => changeShowHistoricalModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => {setShowEditModal(false); setMessage('');}} >
        <Modal.Header closeButton>
          <Modal.Title>Editar Conversión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Id {editData.id}<br/></span>
          <span>Moneda {editData.coinName}<br/></span>
          <form className="my-form">
            <div className="boxInput">
              <label htmlFor="editCampo1">Precio</label>
              <input type="number" id="editCampo1" value={editData.coinPrice} onChange={(e) => setEditData(prevData => ({...prevData, coinPrice: e.target.value})) } />
            </div>
            <div className="boxInput">
              <label htmlFor="editCampo2">Compra Oficial</label>
              <input type="number" id="editCampo2" value={editData.officialBuyPrice} onChange={(e) => setEditData(prevData => ({...prevData, officialBuyPrice: e.target.value})) } />
            </div>
            <div className="boxInput">
              <label htmlFor="editCampo3">Venta Oficial</label>
              <input type="number" id="editCampo3" value={editData.officialSellPrice} onChange={(e) => setEditData(prevData => ({...prevData, officialSellPrice: e.target.value})) } />
            </div>
            <div className="boxInput">
              <label htmlFor="editCampo4">Compra Blue</label>
              <input type="number" id="editCampo4" value={editData.blueBuyPrice} onChange={(e) => setEditData(prevData => ({...prevData, blueBuyPrice: e.target.value})) } />
            </div>
            <div className="boxInput">
              <label htmlFor="editCampo5">Venta Blue</label>
              <input type="number" id="editCampo5" value={editData.blueSellPrice} onChange={(e) => setEditData(prevData => ({...prevData, blueSellPrice: e.target.value})) } />
            </div>
            <span>Fecha {editData.dateCreated}<br/></span>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setShowEditModal(false); setMessage('');}}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setSaveEditedData(true)}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMessage} onHide={() => {setShowMessage(false); setMessage('');}}>
        <Modal.Header closeButton>
        <Modal.Title>Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message}
        </Modal.Body>
      </Modal>
    </div>
  );
};
