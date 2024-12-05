import React, { useState, useCallback } from "react";
import { KeyboardTypeOptions, ScrollView } from "react-native";
import {
  YStack,
  XStack,
  Input,
  Button,
  TextArea,
  Text,
  Image,
  Theme,
  Select,
  Adapt,
  Sheet,
  Card,
  Heading,
} from "tamagui";
import { ChevronDown, Check } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import NavigationHeader from "@/components/NavigationHeader";
import { usePropertyStore } from "@/store/property.store";
import { rentalAppTheme } from '../../constants/Colors';

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

export default function ListPropertyScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    price: "",
    availability: false,
    description: "",
    shortDescription: "",
    propertyType: "",
    roomsAvailable: "",
    bathrooms: "",
    distanceFromUniversity: "",
    images: [] as Array<{ id: string; uri: string; name: string; type: string; }>,
    houseAddress: {
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      county: "",
      eircode: "",
    },
    lenderId: "",
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

  const handlePriceChange = useCallback(
    (text: string) => {
      updateFormData("price", text);
    },
    [updateFormData]
  );

  const handleDistanceChange = useCallback(
    (text: string) => {
      updateFormData("distanceFromUniversity", text);
    },
    [updateFormData]
  );

  const handleRoomsAvailableChange = useCallback(
    (text: string) => {
      updateFormData("roomsAvailable", text);
    },
    [updateFormData]
  );

  const handleBathroomsChange = useCallback(
    (text: string) => {
      updateFormData("bathrooms", text);
    },
    [updateFormData]
  );

  const handleAddressLine1Change = useCallback(
    (text: string) => {
      updateAddress("addressLine1", text);
    },
    [updateAddress]
  );

  const handleAddressLine2Change = useCallback(
    (text: string) => {
      updateAddress("addressLine2", text);
    },
    [updateAddress]
  );

  const handleTownCityChange = useCallback(
    (text: string) => {
      updateAddress("townCity", text);
    },
    [updateAddress]
  );

  const handleCountyChange = useCallback(
    (text: string) => {
      updateAddress("county", text);
    },
    [updateAddress]
  );

  const handleEircodeChange = useCallback(
    (text: string) => {
      updateAddress("eircode", text);
    },
    [updateAddress]
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        id: asset.assetId,
        uri: asset.uri,
        name: asset.fileName,
        type: asset.mimeType
      }));
      
      /*const newImages = result.assets.map((asset) => ({
        id: asset.assetId,
        uri: asset.uri,
        Image: asset
      }));*/
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
      <NavigationHeader title="List Property" />
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
                  onChangeText={handlePriceChange}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />

                <PageInput
                  label="Distance from University (km)"
                  value={formData.distanceFromUniversity}
                  onChangeText={handleDistanceChange}
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
                    onValueChange={(value) =>
                      updateFormData("propertyType", value.toLowerCase())
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
                      <Select.Value placeholder="Select type" />
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
                  onChangeText={handleRoomsAvailableChange}
                  placeholder="Enter number"
                  keyboardType="numeric"
                />
                <PageInput
                  label="Bathrooms"
                  value={formData.bathrooms}
                  onChangeText={handleBathroomsChange}
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
                  placeholder="Describe your property in detail..."
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
                  onChangeText={(text) =>
                    updateFormData("shortDescription", text)
                  }
                  placeholder="Brief overview of your property"
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
              <YStack>
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
                    <Feather
                      name="plus"
                      size={24}
                      color={rentalAppTheme.text.secondary}
                    />
                    <Text color={rentalAppTheme.text.secondary} marginTop="$2">
                      Add Photos
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            </Card>

            {/* Location Section */}
            <Card padding="$4" marginBottom="$4">
              <Heading
                size="$6"
                color={rentalAppTheme.textDark}
                marginBottom="$4"
              >
                Location
              </Heading>
              <YStack space="$4">
                <PageInput
                  label="Address Line 1"
                  value={formData.houseAddress.addressLine1}
                  onChangeText={handleAddressLine1Change}
                  placeholder="Street address"
                />
                <PageInput
                  label="Address Line 2"
                  value={formData.houseAddress.addressLine2}
                  onChangeText={handleAddressLine2Change}
                  placeholder="Apartment, suite, etc. (optional)"
                />
                <XStack space="$4">
                  <YStack flex={1}>
                    <PageInput
                      label="City"
                      value={formData.houseAddress.townCity}
                      onChangeText={handleTownCityChange}
                      placeholder="City"
                    />
                  </YStack>
                  <YStack flex={1}>
                    <PageInput
                      label="County"
                      value={formData.houseAddress.county}
                      onChangeText={handleCountyChange}
                      placeholder="County"
                    />
                  </YStack>
                </XStack>
                <PageInput
                  label="Eircode"
                  value={formData.houseAddress.eircode}
                  onChangeText={handleEircodeChange}
                  placeholder="Enter eircode"
                />
              </YStack>
            </Card>

            {/* Submit Button */}
            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{
                backgroundColor: rentalAppTheme.primaryLight,
              }}
              borderRadius="$4"
              marginTop="$4"
              onPress={async () => {
                const propertyStore = usePropertyStore.getState();

                propertyStore.setImages(formData.images);
                propertyStore.setPrice(formData.price);
                propertyStore.setAvailability(formData.availability);
                propertyStore.setDescription(formData.description);
                propertyStore.setShortDescription(formData.shortDescription);
                propertyStore.setPropertyType(formData.propertyType);
                propertyStore.setRoomsAvailable(
                  formData.roomsAvailable
                    ? Number(formData.roomsAvailable)
                    : null
                );
                propertyStore.setBathrooms(
                  formData.bathrooms ? Number(formData.bathrooms) : null
                );
                propertyStore.setDistanceFromUniversity(
                  formData.distanceFromUniversity
                    ? Number(formData.distanceFromUniversity)
                    : null
                );
                propertyStore.setHouseAddress(formData.houseAddress);
                propertyStore.setLenderId(formData.lenderId);

                try {
                  await propertyStore.createProperty();
                  router.replace("/(tabs)");
                } catch (error) {
                  console.error("Failed to create property:", error);
                }
              }}
            >
              <Text
                color="white"
                fontSize="$4"
                fontWeight="bold"
                textAlign="center"
              >
                List Property
              </Text>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
