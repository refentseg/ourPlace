import React,{useContext} from 'react';
import { useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input';

import Button from '../../shared/components/FormElements/Button';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/vaildators';
import './PlaceForm.css'
import { useForm } from '../../shared/hooks/form-hook';

import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIELEMENTS/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIELEMENTS/LoadingSpinner';
//Validate the entire form


//Where user can add a new Place

const NewPlace = () => {  
  const auth = useContext(AuthContext);
  const {isLoading,sendRequest,error,clearError} = useHttpClient();

  const [formState,inputHandler] =useForm(
    {
      title:{
        value:'',
        isValid:false
      },
      description:{
        value:'',
        isValid:false
      },
      address:{
        value:'',
        isValid:false
      }
    },
    false

  );

  const history= useHistory();
 
  const placeSubmitHandler= async event =>{
   event.preventDefault();
   try{
    await sendRequest('http://localhost:5000/api/places','POST',
    JSON.stringify({
    title:formState.inputs.title.value,
    description:formState.inputs.description.value,
    address:formState.inputs.address.value,
    creator: auth.userId
   }),
    {
       'Content-Type':'application/json'
    },
   );;
   //Redirect user to different page
   history.push('/')
   }catch(err){

   }
  }


  return (
    <React.Fragment>
     <ErrorModal error={error} onClear={clearError}/>
    <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner  asOverlay/>}
       <Input 
       id="title"
       element="input" 
       type="text" 
       label="Title" 
       validators={[VALIDATOR_REQUIRE()]} 
       errorText="Plese enter a valid Title"
       onInput={inputHandler}/> 
       
       <Input
       id="description"
       element="textarea" type="text" label="Description" 
       validators={[VALIDATOR_MINLENGTH(5)]} 
       errorText="Plese enter a valid description(at least 5 charecters)"
       onInput={inputHandler}/> 

       <Input
       id="address"
       element="input" type="text" label="Address" 
       validators={[VALIDATOR_REQUIRE()]} 
       errorText="Plese enter correct address"
       onInput={inputHandler}/> 

       <Button type="submit" disabled={!formState.isValid}>ADD Place</Button>
   </form>
   </React.Fragment>
  )
};

export default NewPlace;