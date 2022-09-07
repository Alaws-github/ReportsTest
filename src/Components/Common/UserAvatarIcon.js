import React, { useEffect, useState } from 'react'
import Avatar from 'antd/lib/avatar/avatar'
import { useAuth } from '../../Context/AuthContext'
import { UserOutlined } from '@ant-design/icons'

const UserAvatarIcon = () => {
  const [givenName, setGivenName] = useState('')
  const { currentUser } = useAuth()

  useEffect(() => {
    if (
      currentUser &&
      currentUser?.attributes &&
      currentUser?.attributes?.given_name
    ) {
      setGivenName(currentUser.attributes.given_name.charAt(0))
    } else {
      setGivenName('')
    }
  }, [currentUser])

  if (givenName) {
    return (
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
        {givenName}
      </Avatar>
    )
  }

  return <Avatar icon={<UserOutlined />} />
}

export default UserAvatarIcon
