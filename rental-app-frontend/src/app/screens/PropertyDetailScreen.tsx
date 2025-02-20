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
  Calendar,
} from "@tamagui/lucide-icons";
import NavigationHeader from "@/components/NavigationHeader";
import { rentalAppTheme } from "@/constants/Colors";
import { Property } from "@/store/interfaces/Property";
import { usePropertyStore } from "@/store/property.store";

export default function PropertyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const media = useMedia();
  const isMobile = !media.gtXs;
  const { width } = useWindowDimensions();

  const { selectedProperty, isLoading, error, fetchPropertyById } =
    usePropertyStore();

  useEffect(() => {
    if (params.id) {
      fetchPropertyById(params.id);
    }
  }, [params.id]);

  const nearestUniversity = selectedProperty?.nearestUniversity;

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
              <XStack position="absolute" bottom="$2" left="$2" right="$2" justifyContent="space-between">
                <Button
                  icon={ChevronLeft}
                  circular
                  size="$3"
                  onPress={() =>
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                  }
                  backgroundColor="rgba(255,255,255,0.7)"
                />
                <Button
                  icon={ChevronRight}
                  circular
                  size="$3"
                  onPress={() =>
                    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                  }
                  backgroundColor="rgba(255,255,255,0.7)"
                />
              </XStack>
            </>
          )}
        </>
      ) : (
        <Stack width="100%" height="100%" backgroundColor="$gray5" alignItems="center" justifyContent="center">
          <Text color="$gray11">No images available</Text>
        </Stack>
      )}
    </Stack>
  );

  return (
    <Theme name="blue">
      <NavigationHeader title="Property Details" />
      <ScrollView style={{ flex: 1, backgroundColor: "white" }} contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack>
          <ImageCarousel />
          <YStack padding={isMobile ? "$2" : "$4"} space="$4">
            <YStack space="$2">
              <H1 size="$8" color={rentalAppTheme.textDark} numberOfLines={2} ellipsizeMode="tail">
                {selectedProperty.shortDescription || "No title available"}
              </H1>
              <XStack alignItems="center">
                <Euro size={30} color={rentalAppTheme.primaryDark} />
                <H2 size="$9" color={rentalAppTheme.primaryDark}>
                  {`${selectedProperty.price || "N/A"}/month`}
                </H2>
              </XStack>
            </YStack>

            <XStack space="$2" flexWrap="wrap">
              <PropertyFeature icon={Bed} text={`${(selectedProperty.singleBedrooms || 0) + (selectedProperty.doubleBedrooms || 0)} Bed`} />
              <PropertyFeature icon={Bath} text={`${selectedProperty.bathrooms || "N/A"} Bath`} />
              {nearestUniversity ? (
                <PropertyFeature
                icon={MapPin}
                text={nearestUniversity
                  ? `${nearestUniversity.name} - ${nearestUniversity.distance} meters away (${nearestUniversity.avgTimeByCar} min by car)`
                  : "No university data available"
                }
              />
              ) : (
                <PropertyFeature icon={MapPin} text="No university nearby" />
              )}
              <PropertyFeature icon={Home} text={capitaliseFirstLetter(selectedProperty.propertyType) || "N/A"} />
            </XStack>

            <Separator marginVertical="$3" />

            <AddressSection address={houseAddress} />
            <DescriptionSection description={selectedProperty.description} />
          </YStack>
        </YStack>
      </ScrollView>
    </Theme>
  );
}

const PropertyFeature = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <XStack space="$2" alignItems="center" padding="$2" backgroundColor="$gray2" borderRadius="$2">
    <Icon size={20} color="$gray11" />
    <Paragraph size="$4" color="$gray11">
      {text}
    </Paragraph>
  </XStack>
);

const AddressSection = ({ address }: { address: Property["houseAddress"] }) => (
  <Card padding="$4" borderRadius="$4" borderWidth={1} borderColor="$gray4" elevation={3} backgroundColor={rentalAppTheme.backgroundLight}>
    <YStack space="$3">
      <H2 size="$6" color={rentalAppTheme.primaryDark}>Address</H2>
      <Separator marginBottom="$2" />
      <Paragraph>{address.addressLine1 || "Address line 1 not available"}</Paragraph>
      {address.addressLine2 && <Paragraph>{address.addressLine2}</Paragraph>}
      <Paragraph>{`${address.townCity}, ${address.county}` || "City & County not available"}</Paragraph>
      <Paragraph>{address.eircode || "Eircode not available"}</Paragraph>
    </YStack>
  </Card>
);

const DescriptionSection = ({ description }: { description: string }) => (
  <Card padding="$4" borderRadius="$4" borderWidth={1} borderColor="$gray4" elevation={3} backgroundColor={rentalAppTheme.backgroundLight}>
    <YStack space="$3">
      <H2 size="$6" color={rentalAppTheme.primaryDark}>Property Description</H2>
      <Paragraph color="$gray11">{description || "No description available"}</Paragraph>
    </YStack>
  </Card>
);
