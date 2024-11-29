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
    <Select value={value} onValueChange={onValueChange}>
      <Select.Trigger {...style}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Group>
            {options.map((option, i) => (
              <Select.Item key={option.value + i} value={option.value} index={i}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>
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

