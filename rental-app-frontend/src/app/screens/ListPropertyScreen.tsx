import React, { useState } from "react";
import { ScrollView } from "react-native";
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
  Separator,
  Adapt,
  Sheet,
} from "tamagui";
import { ChevronDown, ChevronUp, Check, Plus, X as CloseIcon } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import NavigationHeader from "@/components/NavigationHeader";
import { usePropertyStore } from "@/store/property.store";
import { Property } from "@/store/interfaces/Property";


const theme = {
  primary: "#2563eb",
  secondary: "#4b5563",
  background: "#ffffff",
  border: "#e2e8f0",
  error: "#ef4444",
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    light: "#94a3b8",
  },
};

// Define type for PageInput props
interface PageInputProps {
  label: string;
  value: string | number | null;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

export default function ListPropertyScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<Property>({
    price: 0,
    availability: false,
    description: "",
    shortDescription: "",
    propertyType: "",
    roomsAvailable: 0,
    bathrooms: 0,
    distanceFromUniversity: 0,
    images: [],
    houseAddress: {
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      county: "",
      eircode: "",
    },
    lenderId: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAddress = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      houseAddress: {
        ...prev.houseAddress,
        [field]: value,
      },
    }));
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

  const removeImage = (id) => {
    updateFormData(
      "images",
      formData.images.filter((img) => img._id !== id)
    );
  };

  const SectionHeader = ({ title }) => (
    <YStack space="$2" marginTop="$6" marginBottom="$4">
      <Text fontSize="$7" fontWeight="600" color={theme.text.primary}>
        {title}
      </Text>
      <Separator />
    </YStack>
  );
  const propertyTypes = [{type: "House"}, {type: "Apartment"}, {type: "Shared living"}];
  const availabilityOptions = [{type: "Available"}, {type: "Not available"}];

  const PageInput: React.FC<PageInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
  }) => (
    <YStack space="$1" marginBottom="$5">
      <Text fontSize="$4" fontWeight="500" color={theme.text.secondary}>
        {label}
      </Text>
      <Input
        value={value?.toString() || ""}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        borderColor={theme.border}
        borderWidth={1}
        borderRadius="$4"
        padding="$3"
        fontSize="$4"
        backgroundColor="transparent"
      />
    </YStack>
  );
  return (
    <Theme name="light">
      <NavigationHeader title="List Property" />
      <YStack flex={1} backgroundColor={theme.background}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$5" space="$2">
            {/* Main Content */}
            <YStack>
              <XStack space="$4" marginBottom="$5">
                <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color={theme.text.secondary}
                    marginBottom="$2"
                  >
                    Price per Month (€)
                  </Text>
                  <Input
                    value={formData.price?.toString()}
                    onChangeText={(text) =>
                      updateFormData("price", Number(text))
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    borderColor={theme.border}
                    borderWidth={1}
                    borderRadius="$4"
                    padding="$3"
                    fontSize="$4"
                    backgroundColor="transparent"
                  />
                </YStack>
                <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color={theme.text.secondary}
                    marginBottom="$2"
                  >
                    Distance from Uni (km)
                  </Text>
                  <Input
                    value={formData.distanceFromUniversity?.toString()}
                    onChangeText={(text) =>
                      updateFormData("distanceFromUniversity", Number(text))
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    borderColor={theme.border}
                    borderWidth={1}
                    borderRadius="$4"
                    padding="$3"
                    fontSize="$4"
                    backgroundColor="transparent"
                  />
                </YStack>
              </XStack>

              <XStack space="$4" marginBottom="$5">
              <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color={theme.text.secondary}
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
                      borderColor={theme.border}
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

                <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="500"
                    color={theme.text.secondary}
                    marginBottom="$2"
                  >
                    Availability
                  </Text>
                  <Select
                    value={formData.availability ? "available" : "not available"}
                    onValueChange={(value) =>updateFormData("availability", value === "available")}
                    disablePreventBodyScroll
                  >
                    <Select.Trigger
                      backgroundColor="transparent"
                      borderColor={theme.border}
                      borderWidth={1}
                      borderRadius="$4"
                      padding="$3"
                      iconAfter={ChevronDown}
                    >
                      <Select.Value placeholder="Select Availability" />
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
              </XStack>
            </YStack>

            <SectionHeader title="Description" />
            <YStack space="$4" marginBottom="$5">
              <TextArea
                value={formData.description}
                onChangeText={(text) => updateFormData("description", text)}
                placeholder="Describe your property in detail..."
                minHeight={120}
                borderColor={theme.border}
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
                borderColor={theme.border}
                borderWidth={1}
                borderRadius="$4"
                padding="$3"
                fontSize="$4"
                backgroundColor="transparent"
              />
            </YStack>

            <SectionHeader title="Photos" />
            <YStack marginBottom="$6">
              <XStack flexWrap="wrap" gap="$4">
                {formData.images.map((img) => (
                  <YStack key={img._id} position="relative">
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
                      backgroundColor={theme.error}
                      onPress={() => removeImage(img._id)}
                    />
                  </YStack>
                ))}
                <Button
                  width={150}
                  height={150}
                  backgroundColor="transparent"
                  borderColor={theme.border}
                  borderWidth={2}
                  borderRadius="$4"
                  borderStyle="dashed"
                  onPress={pickImage}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Feather name="plus" size={24} color={theme.text.secondary} />
                  <Text color={theme.text.secondary} marginTop="$2">
                    Add Photos
                  </Text>
                </Button>
              </XStack>
            </YStack>

            <SectionHeader title="Location" />
            <YStack space="$4">
              <PageInput
                label="Address Line 1"
                value={formData.houseAddress.addressLine1}
                onChangeText={(text) => updateAddress("addressLine1", text)}
                placeholder="Street address"
              />

              <PageInput
                label="Address Line 2"
                value={formData.houseAddress.addressLine2}
                onChangeText={(text) => updateAddress("addressLine2", text)}
                placeholder="Apartment, suite, etc. (optional)"
              />

              <XStack space="$4">
                <YStack flex={1}>
                  <PageInput
                    label="City"
                    value={formData.houseAddress.townCity}
                    onChangeText={(text) => updateAddress("townCity", text)}
                    placeholder="City"
                  />
                </YStack>
                <YStack flex={1}>
                  <PageInput
                    label="County"
                    value={formData.houseAddress.county}
                    onChangeText={(text) => updateAddress("county", text)}
                    placeholder="County"
                  />
                </YStack>
              </XStack>

              <PageInput
                label="Eircode"
                value={formData.houseAddress.eircode}
                onChangeText={(text) => updateAddress("eircode", text)}
                placeholder="Enter eircode"
              />
            </YStack>

            {formData.propertyType === "house" && (
              <>
                <SectionHeader title="Property Details" />
                <XStack space="$4" marginBottom="$6">
                  <YStack flex={1}>
                    <PageInput
                      label="Bedrooms"
                      value={formData.roomsAvailable}
                      onChangeText={(text) =>
                        updateFormData("roomsAvailable", Number(text))
                      }
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </YStack>
                  <YStack flex={1}>
                    <PageInput
                      label="Bathrooms"
                      value={formData.bathrooms}
                      onChangeText={(text) =>
                        updateFormData("bathrooms", Number(text))
                      }
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </YStack>
                </XStack>
              </>
            )}

            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
              borderRadius="$4"
              marginTop="$4"
              onPress={async () => {
                const propertyStore = usePropertyStore.getState();
                
                propertyStore.setImages(formData.images);
                propertyStore.setPrice(formData.price.toString());
                propertyStore.setAvailability(formData.availability);
                propertyStore.setDescription(formData.description);
                propertyStore.setShortDescription(formData.shortDescription);
                propertyStore.setPropertyType(formData.propertyType);
                propertyStore.setRoomsAvailable(formData.roomsAvailable);
                propertyStore.setBathrooms(formData.bathrooms);
                propertyStore.setDistanceFromUniversity(formData.distanceFromUniversity);
                propertyStore.setHouseAddress(formData.houseAddress);
                propertyStore.setLenderId(formData.lenderId);
                
                try {
                  await propertyStore.createProperty();
                  router.push("/screens/LandlordDashboardScreen");
                } catch (error) {
                  console.error('Failed to create property:', error);
                }
              }}
            >
              <Text
                color="white"
                fontSize={16}
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
