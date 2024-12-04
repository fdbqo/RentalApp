import React, { useState, useEffect } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
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
} from 'tamagui';
import { Euro, Bed, Bath, MapPin, Home, ChevronLeft, ChevronRight, ArrowLeft, Calendar, User } from '@tamagui/lucide-icons';
import NavigationHeader from "@/components/NavigationHeader";

interface Image {
  id: string;
  uri: string;
}

interface Property {
  _id?: string;
  price: number;
  isRented: boolean;
  availability: string;
  availableFrom?: string;
  description: string;
  shortDescription: string;
  propertyType: string;
  singleBedrooms: number;
  doubleBedrooms: number;
  bathrooms: number;
  distanceFromUniversity: number;
  images: Image[];
  houseAddress: {
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    eircode: string;
  };
  lenderId: string;
  lastUpdated?: string;
}

type PropertyParams = {
  [K in keyof Property]: string;
};

export default function PropertyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<PropertyParams>();
  const [activeIndex, setActiveIndex] = useState(0);
  const media = useMedia();
  const isMobile = !media.gtXs;

  const images: Image[] = JSON.parse(params.images || '[]');
  const houseAddress = JSON.parse(params.houseAddress || '{}');
  
  const { width } = useWindowDimensions();

  const capitaliseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('default', { month: 'short', day: 'numeric' })
    return formattedDate.length > 8 ? `${formattedDate.slice(0, 8)}...` : formattedDate
  }

  const MobileHeader = () => (
    <XStack 
      backgroundColor="white" 
      paddingVertical="$4" 
      paddingHorizontal="$4" 
      alignItems="center"
      borderBottomColor="$gray5"
      borderBottomWidth={1}
    >
      <Button
        icon={ArrowLeft}
        size="$3"
        circular
        onPress={() => router.back()}
        backgroundColor="transparent"
      />
      <Text fontSize="$6" fontWeight="bold" flex={1} textAlign="center">
        Property Details
      </Text>
      <Stack width={35} />
    </XStack>
  );

  const ImageCarousel = () => (
    <Stack width="100%" height={isMobile ? 300 : 400} position="relative">
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
                  onPress={() => setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))}
                  backgroundColor="$backgroundTransparent"
                />
                <Button
                  icon={ChevronRight}
                  circular
                  size="$3"
                  onPress={() => setActiveIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))}
                  backgroundColor="$backgroundTransparent"
                />
              </XStack>
              <XStack justifyContent="center" space="$2" position="absolute" bottom="$2" left={0} right={0}>
                {images.map((_, index) => (
                  <Stack
                    key={index}
                    width={8}
                    height={8}
                    borderRadius={4}
                    backgroundColor={index === activeIndex ? '$blue9' : '$gray5'}
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
      space="$3" 
      paddingVertical="$4"
      paddingHorizontal={isMobile ? 0 : "$4"}
      backgroundColor="white"
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      borderTopWidth={1}
      borderTopColor="$gray5"
    >
      <Button 
        flex={1} 
        backgroundColor="$blue8"
        size="$4"
        onPress={() => alert("Contact Landlord")}
      >
        <Text color="white">Contact Landlord</Text>
      </Button>
      <Button 
        flex={1} 
        variant="outlined" 
        borderColor="$blue9"
        size="$4"
        onPress={() => alert("Schedule Viewing")}
      >
        <Text color="$blue9">Schedule Viewing</Text>
      </Button>
    </XStack>
  );

  const AddressSection = () => (
    <YStack space="$2">
      <H2 size="$6">Address</H2>
      <Separator />
      <XStack space="$2" alignItems="center">
        <Home size={20} color="$gray11" />
        <Paragraph size="$4" color="$gray11">
          {houseAddress.addressLine1 || 'Address line 1 not available'}
        </Paragraph>
      </XStack>
      {houseAddress.addressLine2 && (
        <XStack space="$2" alignItems="center">
          <Home size={20} color="$gray11" />
          <Paragraph size="$4" color="$gray11">
            {houseAddress.addressLine2}
          </Paragraph>
        </XStack>
      )}
      <XStack space="$2" alignItems="center">
        <Home size={20} color="$gray11" />
        <Paragraph size="$4" color="$gray11">
          {houseAddress.townCity && houseAddress.county
            ? `${houseAddress.townCity}, ${houseAddress.county}`
            : 'Town/City and County not available'}
        </Paragraph>
      </XStack>
      <XStack space="$2" alignItems="center">
        <MapPin size={20} color="$gray11" />
        <Paragraph size="$4" color="$gray11">
          {houseAddress.eircode || 'Eircode not available'}
        </Paragraph>
      </XStack>
    </YStack>
  );

  const DescriptionSection = ({ description }) => (
    <YStack space="$2">
      <H2 size="$6">Property Description</H2>
      <Separator />
      <Paragraph color="$gray11" size="$4">{description || 'No description available'}</Paragraph>
    </YStack>
  );

  const PropertyDetailsSection = ({ params }) => (
    <YStack space="$2">
      <H2 size="$6">Property Details</H2>
      <Separator />
      <XStack flexWrap="wrap" gap="$4">
        <PropertyDetailItem icon={Home} label="Property Type" value={capitaliseFirstLetter(params.propertyType) || 'N/A'} />
        <PropertyDetailItem icon={MapPin} label="Distance from University" value={params.distanceFromUniversity ? `${params.distanceFromUniversity} km` : 'N/A'} />
        <PropertyDetailItem icon={User} label="Lender ID" value={params.lenderId || 'N/A'} />
        <PropertyDetailItem icon={Bed} label="Single Bedrooms" value={params.singleBedrooms || 'N/A'} />
        <PropertyDetailItem icon={Bed} label="Double Bedrooms" value={params.doubleBedrooms || 'N/A'} />
        <PropertyDetailItem icon={Bath} label="Bathrooms" value={params.bathrooms || 'N/A'} />
        <PropertyDetailItem 
          icon={Calendar} 
          label="Availability" 
          value={
            params.availability === 'available_from' 
              ? `Available from ${formatDate(params.availableFrom) || 'N/A'}` 
              : (params.availability || 'N/A')
          } 
        />
        <PropertyDetailItem icon={Home} label="Rented" value={params.isRented === 'true' ? 'Yes' : 'No'} />
      </XStack>
    </YStack>
  );

  function PropertyFeature({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
    return (
      <XStack space="$2" alignItems="center" paddingVertical="$1">
        <Icon size={20} color="$gray11" />
        <Paragraph size="$4" color="$gray11">{text}</Paragraph>
      </XStack>
    );
  }

  function PropertyDetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
      <XStack space="$2" alignItems="center" width={250}>
        <Icon size={20} color="$gray11" />
        <YStack>
          <Paragraph size="$4" color="$gray11">{label}</Paragraph>
          <Paragraph size="$4" fontWeight="bold" color="$gray12">{value}</Paragraph>
        </YStack>
      </XStack>
    );
  }

  return (
    <Theme name="blue">
      {isMobile ? <MobileHeader /> : <NavigationHeader title="Property Details" />}
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <YStack space={isMobile ? 0 : "$4"}>
          <ImageCarousel />
          <YStack padding={isMobile ? "$2" : "$4"} space="$4">
            <YStack space="$2">
              <H1 size="$8">{params.shortDescription || 'No title available'}</H1>
              <XStack alignItems="center" space="$2">
                <Euro size={30} color="$blue9" />
                <H2 size="$9" color="$blue9">{`${params.price || 'N/A'} / month`}</H2>
              </XStack>
            </YStack>

            <XStack space="$6" marginTop="$2">
              <PropertyFeature icon={Bed} text={`${parseInt(params.singleBedrooms || '0') + parseInt(params.doubleBedrooms || '0')} Bed`} />
              <PropertyFeature icon={Bath} text={`${params.bathrooms || 'N/A'} Bath`} />
              <PropertyFeature icon={MapPin} text={`${params.distanceFromUniversity || 'N/A'}km from Uni`} />
              <PropertyFeature icon={Home} text={capitaliseFirstLetter(params.propertyType) || 'N/A'} />
            </XStack>

            <Separator />

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

