import React from 'react'
import { Select, Adapt, Sheet, YStack, Text } from 'tamagui'
import { ChevronDown, Check } from '@tamagui/lucide-icons'

interface FilterSelectProps {
  options: { label: string; value: string }[]
  value: string | undefined
  onValueChange: (value: string) => void
  placeholder: string
  style?: any
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  style,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} disablePreventBodyScroll>
      <Select.Trigger {...style}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animation="medium"
          snapPoints={[45]}
          position={0}
          zIndex={200000}
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Group>
            <Select.Label>{placeholder}</Select.Label>
            {options.map((option, i) => (
              <Select.Item 
                key={option.value + i} 
                value={option.value} 
                index={i}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select>
  )
}

