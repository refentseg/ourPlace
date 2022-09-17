import React, {useContext, useEffect, useState} from 'react'

import { useHistory, useParams } from 'react-router-dom'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIELEMENTS/Card'
import { useForm } from '../../shared/hooks/form-hook'

import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/util/vaildators'
import { useHttpClient } from '../../shared/hooks/http-hook'

import './PlaceForm.css'
import LoadingSpinner from '../../shared/components/UIELEMENTS/LoadingSpinner'
import ErrorModal from '../../shared/components/UIELEMENTS/ErrorModal'
import { AuthContext } from '../../shared/context/auth-context'

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading,error,sendRequest,clearError} = useHttpClient();
 const history = useHistory();
 const [loadedPlace,setLoadedPlace] = useState();

  const placeId = useParams().placeid;


   const[formState,inputHandler,setFormData]=useForm({
      title:{
       value:'',
        isValid:false
      },
      description:{
         value:'',
        isValid:false
      },
   },false);


   useEffect(()=>{
    const fetchPlace=async () =>{

    try{
      const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
      setLoadedPlace(responseData.place);
       setFormData({
         title:{
         value:responseData.place.title,
        isValid:true
      },
      description:{
         value:responseData.place.description,
        isValid:true
      },
  },
  true
  );
      
    }catch(err){
        
      }

    }
   fetchPlace();
   },[sendRequest,placeId,setFormData])

 const placeUpdateSubmitHandler =async event =>{
   event.preventDefault();
   try{
    await sendRequest(`http://localhost:5000/api/places/${placeId}`,'PATCH',JSON.stringify({
    title:formState.inputs.title.value,
    description:formState.inputs.description.value
   }),{
    'Content-Type':'application/json'
   });
   }catch(err){

   }
 };
 history.push('/'+auth.userId+'/places')

if(isLoading){
  return(
    <div className="center">
      <LoadingSpinner />
    </div>
  )
}

 if(!loadedPlace && !error){
   return (
    <div className='center'>
      <Card>
         <h2>Could not find place!</h2>
      </Card>      
   </div>
  );
}


   return (
       <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {!isLoading && loadedPlace &&<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input id="title" element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE]} 
        errorText="Please enter a valid title"
        onInput={inputHandler}
        intialValue={loadedPlace.title}
        intialIsValid={true}/>

        <Input id="description" element="input"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText="Please enter a valid description"
        onInput={inputHandler}
        intialValue={loadedPlace.description}
        intialIsValid={true}/>
        
        <Button tybe="submit" disabled={!formState.isValid}>Update Place</Button>
    </form>}
   </React.Fragment>  
   )
}

export default UpdatePlace;
