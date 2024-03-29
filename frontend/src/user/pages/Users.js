import React,{useEffect,useState} from 'react';
import UsersList from '../components/UsersList'

import ErrorModal from '../../shared/components/UIELEMENTS/ErrorModal';

import LoadingSpinner from '../../shared/components/UIELEMENTS/LoadingSpinner';

import {useHttpClient} from '../../shared/hooks/http-hook'

//Fetch data
const Users = () => {
const {isLoading,error,sendRequest,clearError} = useHttpClient();

const [loadedUsers,setLoadedUsers] = useState(); //undefined

useEffect(() => {
  const fetchUsers = async () =>{
    try{
     const responseData = await sendRequest('http://localhost:5000/api/users');

 setLoadedUsers(responseData.users);
   
 }catch(err){
}
  };
  fetchUsers();
},[sendRequest])


 return( <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading && (<div className="center">
     <LoadingSpinner />
    </div>)}
    {!isLoading && loadedUsers &&<UsersList items={loadedUsers}/>}
  </React.Fragment>
 )
};

export default Users;
