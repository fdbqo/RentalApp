import React, { useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePropertyStore } from '@/store/property.store';
import { Property } from '@/store/interfaces/Property';
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  ScrollView,
  Theme,
  Form,
  TextArea,
  Image,
  Select,
} from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { rentalAppTheme } from '@/constants/Colors';
import NavigationHeader from '@/components/NavigationHeader';
import * as ImagePicker from "expo-image-picker";
import { ChevronDown, Check } from "@tamagui/lucide-icons";
import { Adapt, Sheet, Card, Heading } from "tamagui";
import { KeyboardTypeOptions } from "react-native";

type PageInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
};

const PageInput = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
  }: PageInputProps) => (
    <YStack space="$2" marginBottom="$4">
      <Text
        fontSize="$4"
        fontWeight="500"
        color={rentalAppTheme.text.secondary}
      >
        {label}
      </Text>
      <Input
        value={value || ""}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        borderColor={rentalAppTheme.border}
        borderWidth={1}
        borderRadius="$4"
        padding="$3"
        fontSize="$4"
        backgroundColor="transparent"
      />
    </YStack>
  )
);

export default function EditPropertyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties, updateProperty } = usePropertyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
   const property = properties.find(p => p._id === id);

  const [formData, setFormData] = useState({
    shortDescription: property?.shortDescription || '',
    description: property?.description || '',
    price: property?.price.toString() || '',
    propertyType: property?.propertyType || '',
    roomsAvailable: property?.roomsAvailable.toString() || '',
    bathrooms: property?.bathrooms.toString() || '',
    distanceFromUniversity: property?.distanceFromUniversity.toString() || '',
    availability: property?.availability || false,
    houseAddress: {
      addressLine1: property?.houseAddress.addressLine1 || '',
      addressLine2: property?.houseAddress.addressLine2 || '',
      townCity: property?.houseAddress.townCity || '',
      county: property?.houseAddress.county || '',
      eircode: property?.houseAddress.eircode || '',
    },
    images: property?.images || [],
  });

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateAddress = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      houseAddress: {
        ...prev.houseAddress,
        [field]: value,
      },
    }));
  }, []);

  if (!property) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Property not found</Text>
      </YStack>
    );
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const updatedProperty: Partial<Property> = {
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        roomsAvailable: Number(formData.roomsAvailable),
        bathrooms: Number(formData.bathrooms),
        distanceFromUniversity: Number(formData.distanceFromUniversity),
        availability: formData.availability,
        houseAddress: {
          addressLine1: formData.houseAddress.addressLine1,
          addressLine2: formData.houseAddress.addressLine2 || '',
          townCity: formData.houseAddress.townCity,
          county: formData.houseAddress.county,
          eircode: formData.houseAddress.eircode,
        },
        images: formData.images,
        lastUpdated: new Date().toISOString()
      };

      await updateProperty(id as string, updatedProperty);
      router.back();
    } catch (error) {
      console.error('Failed to update property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        id: Date.now().toString(),
        uri: asset.uri,
      }));
      updateFormData("images", [...formData.images, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    updateFormData(
      "images",
      formData.images.filter((img) => img.id !== id)
    );
  };
  const propertyTypes = [
    { type: "House" },
    { type: "Apartment" },
    { type: "Shared living" },
  ];
  const availabilityOptions = [
    { type: "Available" },
    { type: "Not available" },
  ];
  return (
    <Theme name="light">
      <NavigationHeader title="Edit Property" />
      <YStack flex={1} backgroundColor={rentalAppTheme.background}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" paddingBottom="$8" space="$4">
            {/* Property Details Section */}
            <Card padding="$4" marginBottom="$4">
              <Heading
                size="$6"
                color={rentalAppTheme.textDark}
                marginBottom="$4"
              >
                Property Details
              </Heading>
              <YStack space="$1">
                <PageInput
                  label="Price per Month (€)"
                  value={formData.price}
                  onChangeText={(text) => updateFormData("price", text)}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />
                <PageInput
                  label="Distance from University (km)"
                  value={formData.distanceFromUniversity}
                  onChangeText={(text) => updateFormData("distanceFromUniversity", text)}
                  placeholder="Enter distance"
                  keyboardType="numeric"
                />
                <YStack marginBottom="$4">
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color={rentalAppTheme.text.secondary}
                    marginBottom="$2"
                  >
                    Property Type
                  </Text>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => updateFormData("propertyType", value.toLowerCase())}
                    disablePreventBodyScroll
                  >
                    <Select.Trigger
                      backgroundColor="transparent"
                      borderColor={rentalAppTheme.border}
                      borderWidth={1}
                      borderRadius="$4"
                      padding="$3"
                      iconAfter={ChevronDown}
                    >
                      <Select.Value placeholder="Select property type" />
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
                    <Select.Content>
                      <Select.Viewport>
                        <Select.Group>
                          <Select.Label>Property Type</Select.Label>
                          {propertyTypes.map((item, i) => (
                            <Select.Item
                              index={i}
                              key={item.type}
                              value={item.type.toLowerCase()}
                            >
                              <Select.ItemText>{item.type}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>
                    </Select.Content>
                  </Select>
                </YStack>
                <YStack marginBottom="$4">
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color={rentalAppTheme.text.secondary}
                    marginBottom="$2"
                  >
                    Availability
                  </Text>
                  <Select
                    value={
                      formData.availability
                        ? "available"
                        : formData.availability === false
                        ? "not available"
                        : undefined
                    }
                    onValueChange={(value) =>
                      updateFormData("availability", value === "available")
                    }
                    disablePreventBodyScroll
                  >
                    <Select.Trigger
                      backgroundColor="transparent"
                      borderColor={rentalAppTheme.border}
                      borderWidth={1}
                      borderRadius="$4"
                      padding="$3"
                      iconAfter={ChevronDown}
                    >
                      <Select.Value placeholder="Select availability" />
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
                    <Select.Content>
                      <Select.Viewport>
                        <Select.Group>
                          <Select.Label>Availability</Select.Label>
                          {availabilityOptions.map((item, i) => (
                            <Select.Item
                              index={i}
                              key={item.type}
                              value={item.type.toLowerCase()}
                            >
                              <Select.ItemText>{item.type}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>
                    </Select.Content>
                  </Select>
                </YStack>
                <PageInput
                  label="Bedrooms"
                  value={formData.roomsAvailable}
                  onChangeText={(text) => updateFormData("roomsAvailable", text)}
                  placeholder="Enter number"
                  keyboardType="numeric"
                />

                <PageInput
                  label="Bathrooms"
                  value={formData.bathrooms}
                  onChangeText={(text) => updateFormData("bathrooms", text)}
                  placeholder="Enter number"
                  keyboardType="numeric"
                />
              </YStack>
            </Card>

            {/* Description Section */}
            <Card padding="$4" marginBottom="$4">
              <Heading
                size="$6"
                color={rentalAppTheme.textDark}
                marginBottom="$4"
              >
                Description
              </Heading>
              <YStack space="$4">
                <TextArea
                  value={formData.description}
                  onChangeText={(text) => updateFormData("description", text)}
                  placeholder="Full Description"
                  minHeight={120}
                  borderColor={rentalAppTheme.border}
                  borderWidth={1}
                  borderRadius="$4"
                  padding="$3"
                  fontSize="$4"
                  backgroundColor="transparent"
                />
                <Input
                  value={formData.shortDescription}
                  onChangeText={(text) => updateFormData("shortDescription", text)}
                  placeholder="Short Description"
                  borderColor={rentalAppTheme.border}
                  borderWidth={1}
                  borderRadius="$4"
                  padding="$3"
                  fontSize="$4"
                  backgroundColor="transparent"
                />
              </YStack>
            </Card>

            {/* Photos Section */}
            <Card padding="$4" marginBottom="$4">
              <Heading
                size="$6"
                color={rentalAppTheme.textDark}
                marginBottom="$4"
              >
                Photos
              </Heading>
              <XStack flexWrap="wrap" gap="$4">
                {formData.images.map((img) => (
                  <YStack key={img.id} position="relative">
                    <Image
                      source={{ uri: img.uri }}
                      width={150}
                      height={150}
                      borderRadius="$4"
                    />
                    <Button
                      size="$3"
                      circular
                      icon={<Feather name="x" size={16} color="white" />}
                      position="absolute"
                      top={-8}
                      right={-8}
                      backgroundColor={rentalAppTheme.error}
                      onPress={() => removeImage(img.id)}
                    />
                  </YStack>
                ))}
                <Button
                  width={150}
                  height={150}
                  backgroundColor="transparent"
                  borderColor={rentalAppTheme.border}
                  borderWidth={2}
                  borderRadius="$4"
                  borderStyle="dashed"
                  onPress={pickImage}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Feather name="plus" size={24} color={rentalAppTheme.text.secondary} />
                  <Text color={rentalAppTheme.text.secondary} marginTop="$2">
                    Add Photos
                  </Text>
                </Button>
              </XStack>
            </Card>

            {/* Address Section */}
            <Card padding="$4" marginBottom="$4">
              <Heading
                size="$6"
                color={rentalAppTheme.textDark}
                marginBottom="$4"
              >
                Address
              </Heading>
              <YStack space="$4">
                <PageInput
                  label="Address Line 1"
                  value={formData.houseAddress.addressLine1}
                  onChangeText={(text) => updateAddress("addressLine1", text)}
                  placeholder="Address Line 1"
                />
                <PageInput
                  label="Address Line 2"
                  value={formData.houseAddress.addressLine2}
                  onChangeText={(text) => updateAddress("addressLine2", text)}
                  placeholder="Address Line 2"
                />
                <PageInput
                  label="Town/City"
                  value={formData.houseAddress.townCity}
                  onChangeText={(text) => updateAddress("townCity", text)}
                  placeholder="Town/City"
                />
                <PageInput
                  label="County"
                  value={formData.houseAddress.county}
                  onChangeText={(text) => updateAddress("county", text)}
                  placeholder="County"
                />
                <PageInput
                  label="Eircode"
                  value={formData.houseAddress.eircode}
                  onChangeText={(text) => updateAddress("eircode", text)}
                  placeholder="Eircode"
                />
              </YStack>
            </Card>

            {/* Submit Button */}
            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
              borderRadius="$4"
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <XStack alignItems="center" space="$2">
                <Feather name="save" size={20} color="white" />
                <Text color="white" fontSize={16} fontWeight="bold">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Text>
              </XStack>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}