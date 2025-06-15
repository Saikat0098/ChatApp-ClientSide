import React, { useEffect } from 'react'
import HomePage from '../pages/HomePage'
import {useAuthStore} from "../store/useAuthStore"
import { Navigate } from 'react-router';
export default function home() {
const {authUser , checkAuth , isCheckingAuth} = useAuthStore();
 
 useEffect(() =>{
   checkAuth()
 } , [checkAuth])

  return (
    <div>
       {/* {
         authUser ? <HomePage /> : Navigate({to: '/signup'})
       } */}
      <HomePage />
    </div>
  )
}
