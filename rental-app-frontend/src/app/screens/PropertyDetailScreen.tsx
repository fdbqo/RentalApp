import React, { useState } from "react";
import { ScrollView, Dimensions, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { YStack, XStack, Text, Button, Theme, Separator, Card, H1, H2, Paragraph, Stack, Image, useMedia } from "tamagui";
import { Bed, Bath, Home, MapPin, Wifi, Flame, Waves, Utensils, ParkingCircle, Mountain, Calendar, Building, Euro, User, ChevronLeft, ChevronRight, ArrowLeft } from '@tamagui/lucide-icons';
import NavigationHeader from "@/components/NavigationHeader";
import { rentalAppTheme} from '../../constants/Colors';

interface PropertyDetailParams {
  id: string
  _id: string
  shortDescription: string
  price: string
  images: string
  availability: string
  description: string
  propertyType: string
  roomsAvailable: string
  bathrooms: string
  distanceFromUniversity: string
  houseAddress: string
  lenderId: string
  floorArea?: string;
  yearBuilt?: string;
  berRating?: string;
}

export default function PropertyDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<Partial<PropertyDetailParams>>()
  const [activeIndex, setActiveIndex] = useState(0)
  const media = useMedia()
  const isMobile = !media.gtXs

  const images = JSON.parse(params.images || '[]')
  const houseAddress = JSON.parse(params.houseAddress || '{}')
  const { width } = Dimensions.get('window')

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))
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
  )

  const ImageCarousel = () => (
    <Stack width="100%" height={isMobile ? 300 : 400} position="relative">
      <Image
        source={{ uri: images[activeIndex]?.uri }}
        width="100%"
        height="100%"
        resizeMode="cover"
        borderRadius={isMobile ? 0 : "$4"}
      />
      <XStack position="absolute" bottom="$2" left="$2" right="$2" justifyContent="space-between">
        <Button
          icon={ChevronLeft}
          circular
          size="$3"
          onPress={handlePrevious}
          backgroundColor="$backgroundTransparent"
        />
        <Button
          icon={ChevronRight}
          circular
          size="$3"
          onPress={handleNext}
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
    </Stack>
  )

  const ActionButtons = () => (
    <XStack space="$3" padding="$4" backgroundColor="white">
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
  )

  if (isMobile) {
    return (
      <Theme name="blue">
        <YStack flex={1} backgroundColor="white">
          <MobileHeader />
          <ScrollView bounces={false}>
            <ImageCarousel />
            <ActionButtons />
            <YStack padding="$4" space="$4">
              <YStack space="$2">
                <H1 size="$8">{params.shortDescription}</H1>
                <XStack alignItems="center" space="$2">
                  <Euro size={24} color="$blue9" />
                  <H2 size="$9" color="$blue9">{`€${params.price}/month`}</H2>
                </XStack>
              </YStack>

              <XStack flexWrap="wrap" gap="$4">
                <PropertyFeature icon={Bed} text={`${params.roomsAvailable} Bed`} />
                <PropertyFeature icon={Bath} text={`${params.bathrooms} Bath`} />
                <PropertyFeature icon={MapPin} text={`${params.distanceFromUniversity}km from Uni`} />
                <PropertyFeature icon={Building} text={params.propertyType} />
              </XStack>

              <YStack space="$2">
                <H2 size="$6">Address</H2>
                <Separator />
                <XStack space="$2" alignItems="center">
                  <Home size={20} color="$gray11" />
                  <Paragraph size="$4" color="$gray11">
                    {`${houseAddress.addressLine1}`}
                  </Paragraph>
                </XStack>
                {houseAddress.addressLine2 && (
                  <XStack space="$2" alignItems="center">
                    <Home size={20} color="$gray11" />
                    <Paragraph size="$4" color="$gray11">
                      {`${houseAddress.addressLine2}`}
                    </Paragraph>
                  </XStack>
                )}
                <XStack space="$2" alignItems="center">
                  <Building size={20} color="$gray11" />
                  <Paragraph size="$4" color="$gray11">
                    {`${houseAddress.townCity}, ${houseAddress.county}`}
                  </Paragraph>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <MapPin size={20} color="$gray11" />
                  <Paragraph size="$4" color="$gray11">
                    {`${houseAddress.eircode}`}
                  </Paragraph>
                </XStack>
              </YStack>

              <YStack space="$2">
                <H2 size="$6">Property Description</H2>
                <Separator />
                <Paragraph color="$gray11" size="$4">{params.description}</Paragraph>
              </YStack>

              <YStack space="$2">
                <H2 size="$6">Property Details</H2>
                <Separator />
                <XStack flexWrap="wrap" gap="$4">
                  <PropertyDetailItem icon={Building} label="Property Type" value={params.propertyType || ''} />
                  <PropertyDetailItem icon={MapPin} label="Distance from University" value={`${params.distanceFromUniversity} km`} />
                  <PropertyDetailItem icon={Calendar} label="Availability" value={params.availability === 'true' ? "Available" : "Not Available"} />
                  <PropertyDetailItem icon={User} label="Lender ID" value={params.lenderId || ''} />
                  <PropertyDetailItem icon={Bed} label="Bedrooms" value={params.roomsAvailable || ''} />
                  <PropertyDetailItem icon={Bath} label="Bathrooms" value={params.bathrooms || ''} />
                  <PropertyDetailItem icon={Home} label="Floor Area" value={`${params.floorArea || 'N/A'} sqm`} />
                  <PropertyDetailItem icon={Calendar} label="Year Built" value={params.yearBuilt || 'N/A'} />
                  <PropertyDetailItem icon={Flame} label="BER Rating" value={params.berRating || 'N/A'} />
                </XStack>
              </YStack>

              <YStack space="$2">
                <H2 size="$6">Amenities</H2>
                <Separator />
                <XStack flexWrap="wrap" gap="$4">
                  <PropertyFeature icon={Wifi} text="High-Speed WiFi" />
                  <PropertyFeature icon={Flame} text="Central Heating" />
                  <PropertyFeature icon={Waves} text="Laundry Facilities" />
                  <PropertyFeature icon={Utensils} text="Fully Equipped Kitchen" />
                  <PropertyFeature icon={ParkingCircle} text="Parking Available" />
                  <PropertyFeature icon={Mountain} text="Close to Campus" />
                </XStack>
              </YStack>
            </YStack>
          </ScrollView>
        </YStack>
      </Theme>
    )
  }

  return (
    <Theme name="blue">
      <NavigationHeader title="Property Details" />
      <ScrollView>
        <YStack padding="$4" space="$4" backgroundColor="$blue5">
          <Card elevate size="$4" bordered scale={0.95} animation="bouncy">
            <Card.Header padded>
              <XStack space="$6" flexWrap="wrap">
                <YStack width={400} space="$2">
                  <ImageCarousel />
                  <ActionButtons />
                </YStack>

                <YStack flex={1} space="$4" minWidth={300}>
                  <YStack space="$2">
                    <H1 size="$8">{params.shortDescription}</H1>
                    <XStack alignItems="center" space="$2">
                      <Euro size={24} color="$blue9" />
                      <H2 size="$9" color="$blue9">{`${params.price}/month`}</H2>
                    </XStack>
                  </YStack>

                  <XStack space="$6" marginTop="$2">
                    <PropertyFeature icon={Bed} text={`${params.roomsAvailable} Bed`} />
                    <PropertyFeature icon={Bath} text={`${params.bathrooms} Bath`} />
                    <PropertyFeature icon={MapPin} text={`${params.distanceFromUniversity}km from Uni`} />
                    <PropertyFeature icon={Building} text={params.propertyType} />
                  </XStack>

                  <Separator />

                  <YStack space="$2">
                    <H2 size="$6">Address</H2>
                    <Separator />
                    <XStack space="$2" alignItems="center">
                      <Home size={20} color="$gray11" />
                      <Paragraph size="$4" color="$gray11">
                        {`${houseAddress.addressLine1}`}
                      </Paragraph>
                    </XStack>
                    {houseAddress.addressLine2 && (
                      <XStack space="$2" alignItems="center">
                        <Home size={20} color="$gray11" />
                        <Paragraph size="$4" color="$gray11">
                          {`${houseAddress.addressLine2}`}
                        </Paragraph>
                      </XStack>
                    )}
                    <XStack space="$2" alignItems="center">
                      <Building size={20} color="$gray11" />
                      <Paragraph size="$4" color="$gray11">
                        {`${houseAddress.townCity}, ${houseAddress.county}`}
                      </Paragraph>
                    </XStack>
                    <XStack space="$2" alignItems="center">
                      <MapPin size={20} color="$gray11" />
                      <Paragraph size="$4" color="$gray11">
                        {`${houseAddress.eircode}`}
                      </Paragraph>
                    </XStack>
                  </YStack>
                </YStack>
              </XStack>
            </Card.Header>

            <YStack padding="$4" space="$6">
              <YStack space="$2">
                <H2 size="$6">Property Description</H2>
                <Separator />
                <Paragraph color="$gray11" size="$4">{params.description}</Paragraph>
              </YStack>

              <YStack space="$2">
                <H2 size="$6">Property Details</H2>
                <Separator />
                <XStack flexWrap="wrap" gap="$4">
                  <PropertyDetailItem icon={Building} label="Property Type" value={params.propertyType || ''} />
                  <PropertyDetailItem icon={MapPin} label="Distance from University" value={`${params.distanceFromUniversity} km`} />
                  <PropertyDetailItem icon={Calendar} label="Availability" value={params.availability === 'true' ? "Available" : "Not Available"} />
                  <PropertyDetailItem icon={User} label="Lender ID" value={params.lenderId || ''} />
                  <PropertyDetailItem icon={Bed} label="Bedrooms" value={params.roomsAvailable || ''} />
                  <PropertyDetailItem icon={Bath} label="Bathrooms" value={params.bathrooms || ''} />
                  <PropertyDetailItem icon={Home} label="Floor Area" value={`${params.floorArea || 'N/A'} sqm`} />
                  <PropertyDetailItem icon={Calendar} label="Year Built" value={params.yearBuilt || 'N/A'} />
                  <PropertyDetailItem icon={Flame} label="BER Rating" value={params.berRating || 'N/A'} />
                </XStack>
              </YStack>

              <YStack space="$2">
                <H2 size="$6">Amenities</H2>
                <Separator />
                <XStack flexWrap="wrap" gap="$4">
                  <PropertyFeature icon={Wifi} text="High-Speed WiFi" />
                  <PropertyFeature icon={Flame} text="Central Heating" />
                  <PropertyFeature icon={Waves} text="Laundry Facilities" />
                  <PropertyFeature icon={Utensils} text="Fully Equipped Kitchen" />
                  <PropertyFeature icon={ParkingCircle} text="Parking Available" />
                  <PropertyFeature icon={Mountain} text="Close to Campus" />
                </XStack>
              </YStack>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </Theme>
  )
}

function PropertyFeature({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <XStack space="$2" alignItems="center" paddingVertical="$1">
      <Icon size={20} color="$gray11" />
      <Paragraph size="$4" color="$gray11">{text}</Paragraph>
    </XStack>
  )
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
  )
}

