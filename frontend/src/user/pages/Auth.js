import React, { useState,useContext } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIELEMENTS/Card';
import { useForm } from '../../shared/hooks/form-hook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/vaildators';

import { AuthContext } from '../../shared/context/auth-context';


import './Auth.css';
import LoadingSpinner from '../../shared/components/UIELEMENTS/LoadingSpinner';

import ErrorModal from '../../shared/components/UIELEMENTS/ErrorModal'
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Auth = () => {

  const auth = useContext(AuthContext);
  const [isLoginMode,setIsLoginMode]=useState(true);
 const{isLoading,error,sendRequest,clearError}= useHttpClient()

  const [formState, inputHandler,setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  //Sign UP
  const switchModeHandler =()=>{
   if(!isLoginMode){
    setFormData({
      ...formState.inputs,
       name:undefined,
       image:undefined
    },
      formState.inputs.email.isValid && formState.inputs.password.isValid
    );
   } else{
    setFormData({
      ...formState.inputs,
      name:{
        value:'',
        isValid:false
      },
      image:{
        value:null,
        isValid:false
      }
    },false
    );
   }
  setIsLoginMode(prevMode => !prevMode);
  }

  const authSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState.inputs);

    if(isLoginMode){
      try{
        const responseData =
        await sendRequest('http://localhost:5000/api/users/login','POST',
        JSON.stringify({
        email:formState.inputs.email.value,
        password:formState.inputs.password.value
      }),
      {
       'Content-Type':'application/json'
      },
      
    );
    auth.login(responseData.user.id);
   }catch(err){
    
   }

    }else{
    try{
        const responseData = await sendRequest('http://localhost:5000/api/users/signup','POST',JSON.stringify({
        name:formState.inputs.name.value,
        email:formState.inputs.email.value,
        password:formState.inputs.password.value
      }),
      {
       'Content-Type':'application/json'
      },
    );

    auth.login(responseData.user.id);
    }catch(err){

    }
    }
    
  };

  return (
    <React.Fragment>
    <ErrorModal  error={error} onClear={clearError}/>
    <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay />}
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode &&
        <ImageUpload center id="image" onInput={inputHandler}/>
        }
        {!isLoginMode &&
        <Input
          element="input"
          id="name"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Name"
          onInput={inputHandler}
        />}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password, at least 6 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode? 'LOGIN':'SIGN UP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? 'SIGN UP':'LOGIN'}</Button>
    </Card>
  </React.Fragment>
  );
};

export default Auth