import React,{useState,useContext} from 'react'
import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIELEMENTS/Card'
import Map from '../../shared/components/UIELEMENTS/Map'
import Modal from '../../shared/components/UIELEMENTS/Modal'
import './PlaceItem.css'

import { AuthContext } from '../../shared/context/auth-context'
import {useHttpClient} from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIELEMENTS/ErrorModal'
import LoadingSpinner from '../../shared/components/UIELEMENTS/LoadingSpinner'


const PlaceItem = props => {
const {isLoading,error,sendRequest,clearError} = useHttpClient()
 const auth =useContext(AuthContext)
  const [showMap,setShowMap] =useState(false);
  const [showConfirmModal,setShowConfirmModal] =useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () =>{
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler =() =>{
    setShowConfirmModal(false);
  }

    const confirmDeleteHandler =async () =>{
    setShowConfirmModal(false);
    try{
     await sendRequest(`http://localhost:5000/api/places/${props.id}`,'DELETE');
     props.onDelete(props.id);
    }catch(err){

    }
   
  }
 


 //ADD creator auth to auth.isLoggedIn for buttons

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal show={showMap} onClancel={closeMapHandler} header={props.address}//Modal to show the Map
      contentClass="place-item__modal-content"
      footerClass="place-item__modal-actions"
      footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}/></div>
      </Modal>
      <Modal
      show={showConfirmModal}
      onCancel={cancelDeleteHandler}
      header="Are you sure?" footerClass="place-item__modal-actions"
      footer={<React.Fragment>
        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
        <Button danger onClick={confirmDeleteHandler }>DELETE</Button>
      </React.Fragment>}>
          <p>Do you want to proceed and delete this place? Please note that it can't be undone after</p>
      </Modal>
    <li className="place-item">
     <Card className="place-item__content">
      {isLoading && <LoadingSpinner asOverlay />}
        <div className="place-item__image">
            <img src={props.image} alt={props.title} />
        </div>
        <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
        </div>
       <div className="place-item__actions">
        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>

       
        {auth.userId === props.creatorId &&<Button to={`/places/${props.id}`}>Edit</Button>}
        {auth.userId === props.creatorId &&<Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}

       </div>
     </Card>
    </li>
   </React.Fragment>
  )
}

export default PlaceItem