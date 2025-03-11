import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { YStack, Text, Button, Popover } from "tamagui";
import { rentalAppTheme } from "../constants/Colors";

interface NotificationPopoverProps {
  // Optional props for customization
  iconSize?: number;
  iconColor?: string;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  iconSize = 24,
  iconColor = rentalAppTheme.textDark,
}) => {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <Popover
      open={notificationOpen}
      onOpenChange={setNotificationOpen}
      placement="bottom"
      size="$5"
    >
      <Popover.Trigger asChild>
        <Button
          variant="outlined"
          padding="$2"
          borderWidth={0}
          borderRadius="$4"
          onPress={() => setNotificationOpen(true)}
        >
          <Feather name="bell" size={iconSize} color={iconColor} />
        </Button>
      </Popover.Trigger>

      <Popover.Content
        borderWidth={1}
        borderColor="$gray4"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        width="90%"
        maxWidth={400}
        borderRadius={20}
        backgroundColor="white"
        shadowColor={rentalAppTheme.textDark}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        padding="$5"
        alignSelf="center"
        marginHorizontal="$4"
        x={-10}
        y={10}
      >
        <YStack space="$4" minHeight={250} justifyContent="center">
          <YStack alignItems="center" space="$3">
            <Feather name="inbox" size={32} color={rentalAppTheme.textLight} />
            <Text
              color={rentalAppTheme.textLight}
              textAlign="center"
              fontSize={16}
            >
              No new notifications
            </Text>
          </YStack>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}; 