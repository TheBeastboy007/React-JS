import React from 'react'
import { useParams } from 'react-router-dom'

function User() {
    const {UserId} = useParams()
  return (
    <div className='bg-red-600 text-white p-4 text-3xl'>User: {UserId}</div>
  )
}

export default User