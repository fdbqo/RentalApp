import React from 'react'
import { styled, Text, XStack } from 'tamagui'

const StyledBadge = styled(XStack, {
  backgroundColor: '$green9',
  paddingVertical: '$1',
  paddingHorizontal: '$2',
  borderRadius: '$4',
  alignItems: 'center',
  justifyContent: 'center',
})

const BadgeText = styled(Text, {
  color: 'white',
  fontSize: 12,
  fontWeight: '500',
})

export interface BadgeProps {
  children: React.ReactNode
}

export function Badge({ children }: BadgeProps) {
  return (
    <StyledBadge>
      <BadgeText>{children}</BadgeText>
    </StyledBadge>
  )
}