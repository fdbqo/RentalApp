import React, { useState } from "react";
import { ScrollView } from "react-native";
import {
  YStack,
  XStack,
  Input,
  Button,
  TextArea,
  Text,
  Card,
  Image,
  Theme,
  Select,
  Adapt,
  Sheet,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { KeyboardTypeOptions } from "react-native";

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

export default function ListPropertyScreen() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [availability, setAvailability] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [images, setImages] = useState<{ id: string, imageUrl: string }[]>([]);
  const [houseAddress, setHouseAddress] = useState({
    houseNumber: "",
    addressLine1: "",
    addressLine2: "",
    townCity: "",
    county: "",
    eircode: "",
  });
  const [rooms, setRooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [distanceFromUniversity, setDistanceFromUniversity] = useState<number | null>(null);
  const [customAvailability, setCustomAvailability] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([
        ...images,
        ...result.assets.map((asset) => ({
          id: Date.now().toString(),
          imageUrl: asset.uri,
        })),
      ]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleSubmit = async () => {
    console.log({
      name,
      price,
      availability,
      description,
      shortDescription,
      propertyType,
      images,
      houseAddress,
      rooms,
      bathrooms,
      distanceFromUniversity,
    });
    router.push("/screens/LandlordDashboardScreen");
  };

  const validateForm = () => {
    return (
      name.trim() !== "" &&
      price > 0 &&
      availability !== "" &&
      description.trim() !== "" &&
      shortDescription.trim() !== "" &&
      propertyType !== "" &&
      images.length > 0 &&
      houseAddress.townCity.trim() !== "" &&
      distanceFromUniversity !== null
    );
  };

  const isFormValid = validateForm();

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default" as KeyboardTypeOptions,
  }) => (
    <YStack space="$2" marginBottom="$4">
      <Text fontSize={16} fontWeight="600" color={rentalAppTheme.textDark}>
        {label}
      </Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        backgroundColor="white"
        borderColor={rentalAppTheme.primaryLight}
        borderWidth={1}
        borderRadius="$4"
        padding="$3"
      />
    </YStack>
  );

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight} padding="$4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$6">
            <Text fontSize={24} fontWeight="bold" color={rentalAppTheme.textDark}>
              List a Property
            </Text>
            <Feather name="x" size={24} color={rentalAppTheme.textDark} onPress={() => router.back()} />
          </XStack>

          <Card
            elevate
            bordered
            animation="bouncy"
            scale={0.97}
            hoverStyle={{ scale: 1 }}
            pressStyle={{ scale: 0.96 }}
            borderRadius="$4"
            backgroundColor="white"
            marginBottom="$4"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
            padding="$4"
          >
            <InputField
              label="Property Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter property name"
            />

            <InputField
              label="Price"
              value={price.toString()}
              onChangeText={(text) => setPrice(Number(text))}
              placeholder="Enter price"
              keyboardType="numeric"
            />

            <YStack space="$2" marginBottom="$4">
              <Text fontSize={16} fontWeight="600" color={rentalAppTheme.textDark}>
                Availability
              </Text>
              <Select
                value={availability}
                onValueChange={(value) => {
                  setAvailability(value);
                  if (value !== "custom") setCustomAvailability("");
                }}
              >
                <Select.Trigger
                  width="100%"
                  iconAfter={() => (
                    <Feather
                      name="chevron-down"
                      size={20}
                      color={rentalAppTheme.primaryLight}
                    />
                  )}
                  backgroundColor="white"
                  borderColor={rentalAppTheme.primaryLight}
                  borderWidth={1}
                >
                  <Select.Value placeholder="Select availability" />
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
                  <Select.Item index={0} value="now">
                    <Select.ItemText>Available Now</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={1} value="custom">
                    <Select.ItemText>Custom Date</Select.ItemText>
                  </Select.Item>
                </Select.Content>
              </Select>
              {availability === "custom" && (
                <Input
                  value={customAvailability}
                  onChangeText={setCustomAvailability}
                  placeholder="Enter custom availability"
                  marginTop="$2"
                />
              )}
            </YStack>

            <YStack space="$2" marginBottom="$4">
              <Text fontSize={16} fontWeight="600" color={rentalAppTheme.textDark}>
                Description
              </Text>
              <TextArea
                value={description}
                onChangeText={setDescription}
                placeholder="Enter property description"
                numberOfLines={4}
                backgroundColor="white"
                borderColor={rentalAppTheme.primaryLight}
                borderWidth={1}
                borderRadius="$4"
                padding="$3"
              />
            </YStack>

            <InputField
              label="Short Description"
              value={shortDescription}
              onChangeText={setShortDescription}
              placeholder="Enter short description"
            />

            <YStack space="$2" marginBottom="$4">
              <Text fontSize={16} fontWeight="600" color={rentalAppTheme.textDark}>
                Property Type
              </Text>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <Select.Trigger
                  width="100%"
                  iconAfter={() => (
                    <Feather
                      name="chevron-down"
                      size={20}
                      color={rentalAppTheme.primaryLight}
                    />
                  )}
                  backgroundColor="white"
                  borderColor={rentalAppTheme.primaryLight}
                  borderWidth={1}
                >
                  <Select.Value placeholder="Select property type" />
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
                  <Select.Item index={0} value="room">
                    <Select.ItemText>Room</Select.ItemText>
                  </Select.Item>
                  <Select.Item index={1} value="house">
                    <Select.ItemText>Whole House</Select.ItemText>
                  </Select.Item>
                </Select.Content>
              </Select>
            </YStack>

            {/* Image Upload Section */}
            <YStack space="$2" marginBottom="$4">
              <Text fontSize={16} fontWeight="600" color={rentalAppTheme.textDark}>
                Property Images
              </Text>
              <XStack flexWrap="wrap" space="$2">
                {(images || []).map((img) => (
                  <YStack key={img.id} width={100} height={100} marginBottom="$2">
                    <Image
                      source={{ uri: img.imageUrl }}
                      width={100}
                      height={100}
                      borderRadius="$2"
                    />
                    <Button
                      size="$2"
                      circular
                      icon={<Feather name="x" size={16} color="white" />}
                      position="absolute"
                      top={-10}
                      right={-10}
                      onPress={() => removeImage(img.id)}
                    />
                  </YStack>
                ))}
                <Button
                  size="$6"
                  circular
                  icon={<Feather name="plus" size={24} color="white" />}
                  backgroundColor={rentalAppTheme.primaryLight}
                  onPress={pickImage}
                />
              </XStack>
            </YStack>

            {/* Property Address Section */}
            <YStack space="$2" marginBottom="$4">
              <Text fontSize={16} fontWeight="600" color={rentalAppTheme.textDark}>
                Property Address
              </Text>
              <InputField
                label="House Number"
                value={houseAddress.houseNumber}
                onChangeText={(text) =>
                  setHouseAddress({ ...houseAddress, houseNumber: text })
                }
                placeholder="Enter house number"
              />
              <InputField
                label="Address Line 1"
                value={houseAddress.addressLine1}
                onChangeText={(text) =>
                  setHouseAddress({ ...houseAddress, addressLine1: text })
                }
                placeholder="Enter address line 1"
              />
              <InputField
                label="Address Line 2"
                value={houseAddress.addressLine2}
                onChangeText={(text) =>
                  setHouseAddress({ ...houseAddress, addressLine2: text })
                }
                placeholder="Enter address line 2"
              />
              <InputField
                label="Town/City"
                value={houseAddress.townCity}
                onChangeText={(text) =>
                  setHouseAddress({ ...houseAddress, townCity: text })
                }
                placeholder="Enter town or city"
              />
              <InputField
                label="County"
                value={houseAddress.county}
                onChangeText={(text) =>
                  setHouseAddress({ ...houseAddress, county: text })
                }
                placeholder="Enter county"
              />
              <InputField
                label="Eircode"
                value={houseAddress.eircode}
                onChangeText={(text) =>
                  setHouseAddress({ ...houseAddress, eircode: text })
                }
                placeholder="Enter eircode"
              />
            </YStack>

            {propertyType === "house" && (
              <>
                <InputField
                  label="Number of Rooms"
                  value={rooms ? rooms.toString() : ""}
                  onChangeText={(text) => setRooms(Number(text))}
                  placeholder="Enter number of rooms"
                  keyboardType="numeric"
                />
                <InputField
                  label="Number of Bathrooms"
                  value={bathrooms ? bathrooms.toString() : ""}
                  onChangeText={(text) => setBathrooms(Number(text))}
                  placeholder="Enter number of bathrooms"
                  keyboardType="numeric"
                />
              </>
            )}

            <InputField
              label="Distance from University (in km)"
              value={distanceFromUniversity ? distanceFromUniversity.toString() : ""}
              onChangeText={(text) => setDistanceFromUniversity(Number(text))}
              placeholder="Enter distance from university"
              keyboardType="numeric"
            />

            <Button
              onPress={handleSubmit}
              disabled={!isFormValid}
              backgroundColor={isFormValid ? rentalAppTheme.primaryDark : rentalAppTheme.primaryLight}
              color="white"
              borderRadius="$4"
              padding="$3"
              marginTop="$4"
            >
              <Text color="white" fontSize={16} fontWeight="bold" textAlign="center">
                List Property
              </Text>
            </Button>
          </Card>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
