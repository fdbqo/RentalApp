import React from 'react';
import { Text, Circle } from 'tamagui';

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  size?: number;
}

export const UserAvatar = ({ 
  firstName = '', 
  lastName = '', 
  size = 100 
}: UserAvatarProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const backgroundColor = '#016180';

  return (
    <Circle
      size={size}
      backgroundColor={backgroundColor}
      alignItems="center"
      justifyContent="center"
    >
      <Text
        color="white"
        fontWeight="bold"
        fontSize={size * 0.4}
      >
        {initials}
      </Text>
    </Circle>
  );
};