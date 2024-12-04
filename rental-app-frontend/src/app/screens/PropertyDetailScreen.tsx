import React, { useState, useEffect } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
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
  ArrowLeft,
  Calendar,
  User,
} from "@tamagui/lucide-icons";
import NavigationHeader from "@/components/NavigationHeader";
import { rentalAppTheme } from "@/constants/Colors";
import { Property, Image } from "@/store/interfaces/Property";

type PropertyParams = {
  [K in keyof Property]: string;
};

export default function PropertyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<PropertyParams>();
  const [activeIndex, setActiveIndex] = useState(0);
  const media = useMedia();
  const isMobile = !media.gtXs;

  const images: Image[] = JSON.parse(params.images || "[]");
  const houseAddress = JSON.parse(params.houseAddress || "{}");

  const { width } = useWindowDimensions();

  const capitaliseFirstLetter = (string: string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
    return formattedDate.length > 8
      ? `${formattedDate.slice(0, 8)}...`
      : formattedDate;
  };

  const ImageCarousel = () => (
    <Stack
      width="100%"
      height={isMobile ? 300 : 500}
      position="relative"
      marginBottom="$4"
    >
      {images.length > 0 ? (
        <>
          <TamaguiImage
            source={{ uri: images[activeIndex].uri }}
            width="100%"
            height="100%"
            resizeMode="cover"
            borderRadius={isMobile ? 0 : "$4"}
          />
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
                  onPress={() =>
                    setActiveIndex((prevIndex) =>
                      prevIndex > 0 ? prevIndex - 1 : images.length - 1
                    )
                  }
                  backgroundColor="rgba(255,255,255,0.7)"
                />
                <Button
                  icon={ChevronRight}
                  circular
                  size="$3"
                  onPress={() =>
                    setActiveIndex((prevIndex) =>
                      prevIndex < images.length - 1 ? prevIndex + 1 : 0
                    )
                  }
                  backgroundColor="rgba(255,255,255,0.7)"
                />
              </XStack>
              <XStack
                justifyContent="center"
                space="$2"
                position="absolute"
                bottom="$2"
                left={0}
                right={0}
              >
                {images.map((_, index) => (
                  <Stack
                    key={index}
                    width={10}
                    height={10}
                    borderRadius={5}
                    backgroundColor={
                      index === activeIndex ? "$blue9" : "$gray5"
                    }
                  />
                ))}
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

  const ActionButtons = () => (
    <XStack
      space="$4"
      paddingTop="$4"
      paddingBottom="$6"
      paddingHorizontal="$5"
      backgroundColor="white"
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      borderTopWidth={1}
      borderTopColor="$gray5"
      elevation={5}
    >
      <Button
        flex={1}
        backgroundColor={rentalAppTheme.primaryDark}
        size="$5"
        onPress={() => alert("Contact Landlord")}
        elevation={2}
      >
        <Text color="white" fontWeight="bold">
          Contact Landlord
        </Text>
      </Button>
      <Button
        flex={1}
        variant="outlined"
        borderColor={rentalAppTheme.primaryLight}
        size="$5"
        onPress={() => alert("Schedule Viewing")}
        color={rentalAppTheme.primaryLight}
        pressStyle={{
          borderColor: rentalAppTheme.primaryLightPressed,
        }}
        elevation={2}
      >
        <Text
          color={rentalAppTheme.primaryLight}
          fontWeight="bold"
          pressStyle={{ color: rentalAppTheme.primaryLightPressed }}
        >
          Schedule Viewing
        </Text>
      </Button>
    </XStack>
  );

  const AddressSection = () => (
    <Card
      marginVertical="$1"
      marginHorizontal="$3"
      padding="$4"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$gray4"
      elevation={3}
      backgroundColor={rentalAppTheme.backgroundLight}
    >
      <YStack space="$3">
        <H2 size="$6" color={rentalAppTheme.primaryDark}>
          Address
        </H2>
        <Separator marginBottom="$2" />
        {[
          {
            icon: Home,
            text: houseAddress.addressLine1 || "Address line 1 not available",
          },
          {
            icon: Home,
            text: houseAddress.addressLine2,
            conditional: !!houseAddress.addressLine2,
          },
          {
            icon: Home,
            text:
              houseAddress.townCity && houseAddress.county
                ? `${houseAddress.townCity}, ${houseAddress.county}`
                : "Town/City and County not available",
          },
          {
            icon: MapPin,
            text: houseAddress.eircode || "Eircode not available",
          },
        ].map(
          (item, index) =>
            item.conditional !== false && (
              <XStack key={index} space="$3" alignItems="center">
                <item.icon size={20} color="$gray11" />
                <Paragraph size="$4" color="$gray11" flexShrink={1}>
                  {item.text}
                </Paragraph>
              </XStack>
            )
        )}
      </YStack>
    </Card>
  );

  const DescriptionSection = ({ description }) => (
    <Card
      marginVertical="$1"
      marginHorizontal="$3"
      padding="$4"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$gray4"
      elevation={3}
      backgroundColor={rentalAppTheme.backgroundLight}
    >
      <YStack space="$3">
        <H2 size="$6" color={rentalAppTheme.primaryDark}>
          Property Description
        </H2>
        <Separator marginBottom="$2" />
        <Paragraph color="$gray11" size="$4">
          {description || "No description available"}
        </Paragraph>
      </YStack>
    </Card>
  );

  const PropertyDetailsSection = ({ params }) => (
    <Card
      marginVertical="$3"
      marginHorizontal="$3"
      padding="$5"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$gray4"
      backgroundColor={rentalAppTheme.backgroundLight}
      elevation={3}
    >
      <YStack space="$5">
        <H2 size="$7" color={rentalAppTheme.primaryDark} fontWeight="bold">
          Property Details
        </H2>
        <Separator marginBottom="$3" />
        <XStack flexWrap="wrap" gap="$5">
          {[
            {
              icon: Home,
              label: "Property Type",
              value: capitaliseFirstLetter(params.propertyType) || "N/A",
            },
            // {
            //   icon: MapPin,
            //   label: "Distance from University",
            //   value: params.distanceFromUniversity
            //     ? `${params.distanceFromUniversity} km`
            //     : "N/A",
            // },
            {
              icon: Bed,
              label: "Single Bedrooms",
              value: params.singleBedrooms || "N/A",
            },
            {
              icon: Bed,
              label: "Double Bedrooms",
              value: params.doubleBedrooms || "N/A",
            },
            {
              icon: Bath,
              label: "Bathrooms",
              value: params.bathrooms || "N/A",
            },
            {
              icon: Calendar,
              label: "Availability",
              value:
                params.availability === "available_from"
                  ? `Available from ${
                      formatDate(params.availableFrom) || "N/A"
                    }`
                  : params.availability || "N/A",
            },
          ].map((item, index) => (
            <PropertyDetailItem
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </XStack>
      </YStack>
    </Card>
  );

  function PropertyFeature({
    icon: Icon,
    text,
  }: {
    icon: React.ElementType;
    text: string;
  }) {
    return (
      <XStack
        space="$2"
        alignItems="center"
        padding="$2"
        backgroundColor="$gray2"
        borderRadius="$2"
      >
        <Icon size={20} color="$gray11" />
        <Paragraph size="$4" color="$gray11">
          {text}
        </Paragraph>
      </XStack>
    );
  }

  function PropertyDetailItem({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
  }) {
    return (
      <XStack
        space="$3"
        alignItems="center"
        width={250}
        padding="$2"
        backgroundColor="$gray2"
        borderRadius="$2"
      >
        <Icon size={20} color="$gray11" />
        <YStack flexShrink={1}>
          <Paragraph size="$3" color="$gray11">
            {label}
          </Paragraph>
          <Paragraph size="$4" fontWeight="bold" color="$gray12">
            {value}
          </Paragraph>
        </YStack>
      </XStack>
    );
  }

  return (
    <Theme name="blue">
      <NavigationHeader title="Property Details" />
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <YStack>
          <ImageCarousel />
          <YStack padding={isMobile ? "$2" : "$4"} space="$4">
            {/* Property Title and Price */}
            <YStack space="$2">
              <H1
                size="$8"
                color={rentalAppTheme.textDark}
                numberOfLines={2}
                ellipsizeMode="tail"
                paddingLeft="$2"
              >
                {params.shortDescription || "No title available"}
              </H1>
              <XStack alignItems="center" paddingLeft="$2">
                <Euro size={30} color={rentalAppTheme.primaryDark} />
                <H2 size="$9" color={rentalAppTheme.primaryDark}>
                  {`${params.price || "N/A"}/month`}
                </H2>
              </XStack>
            </YStack>

            {/* Quick Property Features */}
            <XStack
              space="$2"
              rowGap="$3"
              marginTop="$3"
              justifyContent="space-between"
              flexWrap="wrap"
              paddingHorizontal="$4"
            >
              <PropertyFeature
                icon={Bed}
                text={`${
                  parseInt(params.singleBedrooms || "4") +
                  parseInt(params.doubleBedrooms || "0")
                } Bed`}
              />
              <PropertyFeature
                icon={Bath}
                text={`${params.bathrooms || "N/A"} Bath`}
              />
              <PropertyFeature
                icon={MapPin}
                text={`${params.distanceFromUniversity || "5"} km from Uni`}
              />
              <PropertyFeature
                icon={Home}
                text={capitaliseFirstLetter(params.propertyType) || "N/A"}
              />
            </XStack>

            <Separator marginVertical="$3" />

            {/* Detailed Sections */}
            <AddressSection />
            <DescriptionSection description={params.description} />
            <PropertyDetailsSection params={params} />
          </YStack>
        </YStack>
      </ScrollView>
      <ActionButtons />
    </Theme>
  );
}
