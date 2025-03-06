import React, { useState, useEffect } from "react";
import { ScrollView, useWindowDimensions, Alert, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Theme,
  Text,
  Button,
  Stack,
  XStack,
  YStack,
  H1,
  H2,
  Paragraph,
  Image as TamaguiImage,
  Separator,
  useMedia,
  Card,
} from "tamagui";
import {
  Euro,
  Bed,
  Bath,
  MapPin,
  Home,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
  Book,
  Clock,
} from "@tamagui/lucide-icons";
import NavigationHeader from "@/components/NavigationHeader";
import { rentalAppTheme } from "@/constants/Colors";
import { Property } from "@/store/interfaces/Property";
import { usePropertyStore } from "@/store/property.store";
import { useChatStore } from "@/store/chat.store";
import { useUserStore } from "@/store/user.store";

export default function PropertyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const media = useMedia();
  const isMobile = !media.gtXs;
  const { width } = useWindowDimensions();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const { selectedProperty, isLoading, error, fetchPropertyById } =
    usePropertyStore();

  // Preload all images when property is loaded
  useEffect(() => {
    if (selectedProperty?.images && selectedProperty.images.length > 0) {
      selectedProperty.images.forEach((image) => {
        if (image.uri) {
          Image.prefetch(image.uri).catch((err) =>
            console.error("Error prefetching image:", err)
          );
        }
      });
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (params.id) {
      fetchPropertyById(params.id);
    }
  }, [params.id, fetchPropertyById]);

  const capitaliseFirstLetter = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Theme name="blue">
        <NavigationHeader title="Property Details" />
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Text>Loading...</Text>
        </Stack>
      </Theme>
    );
  }

  if (error) {
    return (
      <Theme name="blue">
        <NavigationHeader title="Property Details" />
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Text color="$red10">{error}</Text>
        </Stack>
      </Theme>
    );
  }

  if (!selectedProperty) {
    return (
      <Theme name="blue">
        <NavigationHeader title="Property Details" />
        <Stack flex={1} alignItems="center" justifyContent="center">
          <Text>Property not found</Text>
        </Stack>
      </Theme>
    );
  }

  const images = selectedProperty.images;
  const houseAddress = selectedProperty.houseAddress;

  const ImageCarousel = () => (
    <Stack width="100%" height={isMobile ? 300 : 500} position="relative">
      {images && images.length > 0 ? (
        <>
          <TamaguiImage
            source={{
              uri: images[activeIndex]?.uri
                ? images[activeIndex].uri
                : "https://via.placeholder.com/800x600?text=No+Image",
              cache: "force-cache",
            }}
            width="100%"
            height="100%"
            resizeMode="cover"
            borderRadius={isMobile ? 0 : "$4"}
            onError={(e) => {
              console.error("Image loading error in carousel:", e.nativeEvent);
            }}
          />
          {/* Preload next and previous images */}
          {images.map(
            (image, index) =>
              index !== activeIndex && (
                <TamaguiImage
                  key={`preload-${index}`}
                  source={{
                    uri: image.uri,
                    cache: "force-cache",
                  }}
                  width={0}
                  height={0}
                  opacity={0}
                  position="absolute"
                />
              )
          )}
          {images.length > 1 && (
            <>
              <XStack
                position="absolute"
                bottom="$2"
                left="$2"
                right="$2"
                justifyContent="space-between"
              >
                <Button
                  icon={ChevronLeft}
                  circular
                  size="$3"
                  onPress={() => {
                    const newIndex =
                      activeIndex > 0 ? activeIndex - 1 : images.length - 1;
                    setActiveIndex(newIndex);
                  }}
                  backgroundColor="rgba(255,255,255,0.7)"
                />
                <Button
                  icon={ChevronRight}
                  circular
                  size="$3"
                  onPress={() => {
                    const newIndex =
                      activeIndex < images.length - 1 ? activeIndex + 1 : 0;
                    setActiveIndex(newIndex);
                  }}
                  backgroundColor="rgba(255,255,255,0.7)"
                />
              </XStack>
            </>
          )}
        </>
      ) : (
        <Stack
          width="100%"
          height="100%"
          backgroundColor="$gray5"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="$gray11">No images available</Text>
        </Stack>
      )}
    </Stack>
  );

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        <NavigationHeader title="Property Details" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <YStack>
            <ImageCarousel />
            <YStack padding="$4" space="$4">
              {/* Price and Title Section */}
              <Card
                elevate
                bordered
                borderRadius="$6"
                backgroundColor="white"
                padding="$4"
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
              >
                <YStack space="$3">
                  <XStack space="$2" alignItems="center">
                    <Card
                      backgroundColor={`${rentalAppTheme.primaryDark}10`}
                      padding="$2"
                      borderRadius="$4"
                    >
                      <Home size={20} color={rentalAppTheme.primaryDark} />
                    </Card>
                    <Text
                      fontSize="$7"
                      fontWeight="bold"
                      color={rentalAppTheme.textDark}
                      numberOfLines={2}
                    >
                      {selectedProperty.shortDescription ||
                        "No title available"}
                    </Text>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Text
                      fontSize="$8"
                      color={rentalAppTheme.primaryDark}
                      fontWeight="600"
                    >
                      €{selectedProperty.price.toLocaleString()}
                      <Text fontSize="$5" color={rentalAppTheme.textLight}>
                        /month
                      </Text>
                    </Text>
                  </XStack>

                  <XStack flexWrap="wrap" gap="$2">
                    <Card
                      backgroundColor="$gray2"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$4"
                    >
                      <XStack space="$2" alignItems="center">
                        <Bed size={16} color={rentalAppTheme.primaryDark} />
                        <YStack>
                          <Text fontSize={12} color="$gray11">
                            Beds
                          </Text>
                          <Text fontSize={14} color="$gray12" fontWeight="500">
                            {(selectedProperty.singleBedrooms || 0) +
                              (selectedProperty.doubleBedrooms || 0)}
                          </Text>
                        </YStack>
                      </XStack>
                    </Card>

                    <Card
                      backgroundColor="$gray2"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$4"
                    >
                      <XStack space="$2" alignItems="center">
                        <Bath size={16} color={rentalAppTheme.primaryDark} />
                        <YStack>
                          <Text fontSize={12} color="$gray11">
                            Baths
                          </Text>
                          <Text fontSize={14} color="$gray12" fontWeight="500">
                            {selectedProperty.bathrooms || "N/A"}
                          </Text>
                        </YStack>
                      </XStack>
                    </Card>

                    <Card
                      backgroundColor="$gray2"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$4"
                    >
                      <XStack space="$2" alignItems="center">
                        <Home size={16} color={rentalAppTheme.primaryDark} />
                        <YStack>
                          <Text fontSize={12} color="$gray11">
                            Type
                          </Text>
                          <Text fontSize={14} color="$gray12" fontWeight="500">
                            {capitaliseFirstLetter(
                              selectedProperty.propertyType
                            )}
                          </Text>
                        </YStack>
                      </XStack>
                    </Card>
                  </XStack>
                </YStack>
              </Card>

              {/* Contact Button */}
              <Button
                backgroundColor={rentalAppTheme.primaryDark}
                pressStyle={{
                  backgroundColor: rentalAppTheme.primaryDarkPressed,
                }}
                borderRadius="$6"
                size="$5"
                elevation={4}
                onPress={async () => {
                  if (!isAuthenticated) {
                    router.push("/screens/LoginScreen");
                    return;
                  }

                  try {
                    const chatStore = useChatStore.getState();
                    const room = await chatStore.createRoom(
                      selectedProperty.lenderId,
                      selectedProperty._id || ""
                    );

                    router.push({
                      pathname: "/screens/ChatRoomScreen/[roomId]",
                      params: { roomId: room._id },
                    } as any);
                  } catch (error) {
                    Alert.alert(
                      "Error",
                      "Failed to create chat room. Please try again.",
                      [{ text: "OK" }]
                    );
                  }
                }}
              >
                <XStack space="$2" justifyContent="center" alignItems="center">
                  <Calendar size={20} color="white" />
                  <Text color="white" fontSize={16} fontWeight="bold">
                    {isAuthenticated ? "Contact Landlord" : "Login to Contact"}
                  </Text>
                </XStack>
              </Button>

              {/* Description Section */}
              <Card
                elevate
                bordered
                borderRadius="$6"
                backgroundColor="white"
                padding="$4"
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
              >
                <YStack space="$3">
                  <XStack space="$2" alignItems="center">
                    <Card
                      backgroundColor={`${rentalAppTheme.primaryDark}10`}
                      padding="$2"
                      borderRadius="$4"
                    >
                      <FileText size={20} color={rentalAppTheme.primaryDark} />
                    </Card>
                    <Text
                      fontSize="$6"
                      fontWeight="bold"
                      color={rentalAppTheme.textDark}
                    >
                      Description
                    </Text>
                  </XStack>
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    {selectedProperty.description || "No description available"}
                  </Text>
                </YStack>
              </Card>

              {/* Address Section */}
              <Card
                elevate
                bordered
                borderRadius="$6"
                backgroundColor="white"
                padding="$4"
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
              >
                <YStack space="$3">
                  <XStack space="$2" alignItems="center">
                    <Card
                      backgroundColor={`${rentalAppTheme.primaryDark}10`}
                      padding="$2"
                      borderRadius="$4"
                    >
                      <MapPin size={20} color={rentalAppTheme.primaryDark} />
                    </Card>
                    <Text
                      fontSize="$6"
                      fontWeight="bold"
                      color={rentalAppTheme.textDark}
                    >
                      Address
                    </Text>
                  </XStack>
                  <YStack space="$2">
                    <Text fontSize={16} color={rentalAppTheme.textDark}>
                      {houseAddress.addressLine1}
                    </Text>
                    {houseAddress.addressLine2 && (
                      <Text fontSize={16} color={rentalAppTheme.textDark}>
                        {houseAddress.addressLine2}
                      </Text>
                    )}
                    <Text fontSize={16} color={rentalAppTheme.textDark}>
                      {houseAddress.townCity}, {houseAddress.county}
                    </Text>
                    <Text fontSize={16} color={rentalAppTheme.textDark}>
                      {houseAddress.eircode}
                    </Text>
                  </YStack>
                </YStack>
              </Card>

              {/* Universities Section */}
              <Card
                elevate
                bordered
                borderRadius="$6"
                backgroundColor="white"
                padding="$4"
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
              >
                <YStack space="$3">
                  <XStack space="$2" alignItems="center">
                    <Card
                      backgroundColor={`${rentalAppTheme.primaryDark}10`}
                      padding="$2"
                      borderRadius="$4"
                    >
                      <Book size={20} color={rentalAppTheme.primaryDark} />
                    </Card>
                    <Text
                      fontSize="$6"
                      fontWeight="bold"
                      color={rentalAppTheme.textDark}
                    >
                      Nearest Universities
                    </Text>
                  </XStack>
                  {!selectedProperty.nearestUniversities ||
                  selectedProperty.nearestUniversities.length === 0 ? (
                    <Text fontSize={16} color={rentalAppTheme.textLight}>
                      No university information available
                    </Text>
                  ) : (
                    <YStack space="$3">
                      {selectedProperty.nearestUniversities.map(
                        (uni, index) => (
                          <YStack key={index} space="$2">
                            <Text
                              fontSize={16}
                              fontWeight="600"
                              color={rentalAppTheme.textDark}
                            >
                              {uni.name}
                            </Text>
                            <XStack space="$4">
                              <XStack space="$1" alignItems="center">
                                <MapPin
                                  size={14}
                                  color={rentalAppTheme.textLight}
                                />
                                <Text
                                  fontSize={14}
                                  color={rentalAppTheme.textLight}
                                >
                                  {formatDistance(uni.distance || 0)} away
                                </Text>
                              </XStack>
                              <XStack space="$1" alignItems="center">
                                <Clock
                                  size={14}
                                  color={rentalAppTheme.textLight}
                                />
                                <Text
                                  fontSize={14}
                                  color={rentalAppTheme.textLight}
                                >
                                  {uni.avgTimeByCar || 0} min by car
                                </Text>
                              </XStack>
                            </XStack>
                            {index !==
                              selectedProperty.nearestUniversities.length -
                                1 && <Separator marginVertical="$2" />}
                          </YStack>
                        )
                      )}
                    </YStack>
                  )}
                </YStack>
              </Card>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}

const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatDistance = (distance: number) => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${distance} m`;
};
