import React, { useState, useCallback } from "react";
import { KeyboardTypeOptions, ScrollView, Alert } from "react-native";
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
import { rentalAppTheme } from "../../constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { countiesToCities } from "@/constants/irishPlaces";

type PageInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
};

const PageInput = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    error,
  }: PageInputProps) => (
    <YStack space="$2" marginBottom="$4">
      <Text fontSize="$4" fontWeight="600" color={rentalAppTheme.textDark}>
        {label}
      </Text>
      <Input
        value={value || ""}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        borderColor={error ? rentalAppTheme.error : "$gray4"}
        borderWidth={1}
        borderRadius="$6"
        fontSize="$4"
        backgroundColor="white"
        focusStyle={{
          borderColor: rentalAppTheme.primaryLight,
          borderWidth: 2,
        }}
      />
      {error && (
        <XStack space="$2" alignItems="center">
          <Feather name="alert-circle" size={14} color={rentalAppTheme.error} />
          <Text color={rentalAppTheme.error} fontSize="$3">
            {error}
          </Text>
        </XStack>
      )}
    </YStack>
  )
);

type PageTextAreaProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
};

const PageTextArea = React.memo(
  ({ label, value, onChangeText, placeholder, error }: PageTextAreaProps) => (
    <YStack space="$2" marginBottom="$4">
      <Text fontSize="$4" fontWeight="600" color={rentalAppTheme.textDark}>
        {label}
      </Text>
      <TextArea
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        minHeight={120}
        borderColor={error ? rentalAppTheme.error : "$gray4"}
        borderWidth={1}
        borderRadius="$6"
        padding="$3.5"
        fontSize="$4"
        backgroundColor="white"
        focusStyle={{
          borderColor: rentalAppTheme.primaryLight,
          borderWidth: 2,
        }}
      />
      {error && (
        <XStack space="$2" alignItems="center">
          <Feather name="alert-circle" size={14} color={rentalAppTheme.error} />
          <Text color={rentalAppTheme.error} fontSize="$3">
            {error}
          </Text>
        </XStack>
      )}
    </YStack>
  )
);

export default function ListPropertyScreen() {
  const router = useRouter();
  const isLoading = usePropertyStore((state) => state.isLoading);
  const [formData, setFormData] = useState({
    price: "",
    availability: "immediately",
    availableFrom: null as string | null,
    description: "",
    shortDescription: "",
    propertyType: "",
    singleBedrooms: "",
    doubleBedrooms: "",
    bathrooms: "",
    images: [] as Array<{ id: string; uri: string }>,
    houseAddress: {
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      county: "",
      eircode: "",
    },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      setErrors((prev) => ({ ...prev, price: "" }));
    },
    [updateFormData]
  );

  const handleSingleBedroomsChange = useCallback(
    (text: string) => {
      updateFormData("singleBedrooms", text);
      setErrors((prev) => ({
        ...prev,
        singleBedrooms: "",
        bedrooms: "",
      }));
    },
    [updateFormData]
  );

  const handleDoubleBedroomsChange = useCallback(
    (text: string) => {
      updateFormData("doubleBedrooms", text);
      setErrors((prev) => ({
        ...prev,
        doubleBedrooms: "",
        bedrooms: "",
      }));
    },
    [updateFormData]
  );

  const handleBathroomsChange = useCallback(
    (text: string) => {
      updateFormData("bathrooms", text);
      setErrors((prev) => ({ ...prev, bathrooms: "" }));
    },
    [updateFormData]
  );

  const handleAddressLine1Change = useCallback(
    (text: string) => {
      updateAddress("addressLine1", text);
      setErrors((prev) => ({ ...prev, addressLine1: "" }));
    },
    [updateAddress]
  );

  const handleAddressLine2Change = useCallback(
    (text: string) => {
      updateAddress("addressLine2", text);
    },
    [updateAddress]
  );

  const handleCountyChange = useCallback(
    (value: string) => {
      updateAddress("county", value);
      updateAddress("townCity", "");
      setErrors((prev) => ({ ...prev, county: "" }));
    },
    [updateAddress]
  );

  const handleEircodeChange = useCallback(
    (text: string) => {
      updateAddress("eircode", text);
      setErrors((prev) => ({ ...prev, eircode: "" }));
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
        id: Date.now().toString() + Math.random().toString(),
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
    { type: "Available Immediately", value: "immediately" },
    { type: "Available From", value: "available_from" },
  ];

  const availableCities =
    formData.houseAddress.county &&
    countiesToCities[formData.houseAddress.county]
      ? countiesToCities[formData.houseAddress.county]
      : [];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Please select a property type";
    }

    if (!formData.availability) {
      newErrors.availability = "Please select availability";
    }

    if (formData.availability === "available_from") {
      if (!formData.availableFrom) {
        newErrors.availableFrom = "Please select an availability date";
      } else {
        const selectedDate = new Date(formData.availableFrom);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.availableFrom = "Availability date cannot be in the past";
        }
      }
    }

    if (!formData.singleBedrooms && !formData.doubleBedrooms) {
      newErrors.bedrooms = "Please enter at least one bedroom.";
    }

    if (formData.singleBedrooms && isNaN(Number(formData.singleBedrooms))) {
      newErrors.singleBedrooms =
        "Please enter a valid number of single bedrooms.";
    }

    if (formData.doubleBedrooms && isNaN(Number(formData.doubleBedrooms))) {
      newErrors.doubleBedrooms =
        "Please enter a valid number of double bedrooms.";
    }

    if (!formData.bathrooms || isNaN(Number(formData.bathrooms))) {
      newErrors.bathrooms = "Please enter number of bathrooms";
    }

    if (!formData.shortDescription || formData.shortDescription.length > 20) {
      newErrors.shortDescription =
        "Brief overview must be 20 characters or less";
    }

    if (!formData.description) {
      newErrors.description = "Please enter a full description";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Please add at least one photo";
    }

    if (!formData.houseAddress.addressLine1) {
      newErrors.addressLine1 = "Please enter address line 1";
    }

    if (!formData.houseAddress.county) {
      newErrors.county = "Please select a county";
    }

    if (!formData.houseAddress.townCity) {
      newErrors.townCity = "Please select a city";
    }

    const eircodeRegex = /^[AC-FHKNPRTV-Y]\d{2}\s?[AC-FHKNPRTV-Y0-9]{4}$/i;
    if (
      !formData.houseAddress.eircode ||
      !eircodeRegex.test(formData.houseAddress.eircode)
    ) {
      newErrors.eircode = "Please enter a valid Irish Eircode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        <NavigationHeader title="List Property" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" space="$4">
            {/* Property Details Section */}
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
              <YStack space="$4">
                <XStack space="$2" alignItems="center">
                  <Card
                    backgroundColor={`${rentalAppTheme.primaryDark}10`}
                    padding="$2"
                    borderRadius="$4"
                  >
                    <Feather
                      name="home"
                      size={20}
                      color={rentalAppTheme.primaryDark}
                    />
                  </Card>
                  <Text
                    fontSize="$6"
                    fontWeight="bold"
                    color={rentalAppTheme.textDark}
                  >
                    Property Details
                  </Text>
                </XStack>

                <YStack space="$1">
                  <PageInput
                    label="Price per Month (€)"
                    value={formData.price}
                    onChangeText={handlePriceChange}
                    placeholder="Enter price"
                    keyboardType="numeric"
                    error={errors.price}
                  />

                  <YStack space="$1.5" marginBottom="$4">
                    <Text
                      fontSize="$4"
                      fontWeight="500"
                      color={rentalAppTheme.textDark}
                    >
                      Property Type
                    </Text>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => {
                        updateFormData("propertyType", value.toLowerCase());
                        setErrors((prev) => ({ ...prev, propertyType: "" }));
                      }}
                      disablePreventBodyScroll
                    >
                      <Select.Trigger
                        backgroundColor="transparent"
                        borderColor={
                          errors.propertyType
                            ? rentalAppTheme.error
                            : rentalAppTheme.border
                        }
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
                    {errors.propertyType && (
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.propertyType}
                      </Text>
                    )}
                  </YStack>

                  {/* Availability Section */}
                  <YStack space="$1.5" marginBottom="$4">
                    <Text
                      fontSize="$4"
                      fontWeight="500"
                      color={rentalAppTheme.textDark}
                    >
                      Availability
                    </Text>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => {
                        updateFormData("availability", value);
                        setErrors((prev) => ({
                          ...prev,
                          availability: "",
                          availableFrom: "",
                        }));
                        if (value === "available_from") {
                          setShowDatePicker(true);
                        } else if (value === "immediately") {
                          updateFormData("availableFrom", "immediately");
                        }
                      }}
                      disablePreventBodyScroll
                    >
                      <Select.Trigger
                        backgroundColor="transparent"
                        borderColor={
                          errors.availability
                            ? rentalAppTheme.error
                            : rentalAppTheme.border
                        }
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
                                key={item.value}
                                value={item.value}
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
                    {errors.availability && (
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.availability}
                      </Text>
                    )}

                    {/* Date Picker for "Available From" */}
                    {formData.availability === "available_from" && (
                      <YStack space="$2" marginTop="$4">
                        <Text
                          fontSize="$4"
                          fontWeight="500"
                          color={rentalAppTheme.text.secondary}
                          marginBottom="$2"
                        >
                          Available From
                        </Text>
                        <Button
                          backgroundColor={rentalAppTheme.border}
                          borderRadius="$4"
                          padding="$3"
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text
                            color={
                              formData.availableFrom &&
                              formData.availableFrom !== "immediately"
                                ? "black"
                                : rentalAppTheme.text.secondary
                            }
                          >
                            {formData.availableFrom &&
                            formData.availableFrom !== "immediately"
                              ? formData.availableFrom
                              : "Select Date"}
                          </Text>
                        </Button>
                        {showDatePicker && (
                          <DateTimePicker
                            value={
                              formData.availableFrom &&
                              formData.availableFrom !== "immediately"
                                ? new Date(formData.availableFrom)
                                : new Date()
                            }
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              setShowDatePicker(false);
                              if (selectedDate) {
                                const formattedDate = selectedDate
                                  .toISOString()
                                  .split("T")[0];
                                updateFormData("availableFrom", formattedDate);
                              }
                            }}
                            minimumDate={new Date()}
                          />
                        )}
                        {errors.availableFrom && (
                          <Text color={rentalAppTheme.error} fontSize="$2">
                            {errors.availableFrom}
                          </Text>
                        )}
                      </YStack>
                    )}
                  </YStack>

                  {/* Single Bedrooms Input */}
                  <PageInput
                    label="Single Bedrooms"
                    value={formData.singleBedrooms}
                    onChangeText={handleSingleBedroomsChange}
                    placeholder="Enter number of single bedrooms"
                    keyboardType="numeric"
                    error={errors.singleBedrooms || errors.bedrooms}
                  />

                  {/* Double Bedrooms Input */}
                  <PageInput
                    label="Double Bedrooms"
                    value={formData.doubleBedrooms}
                    onChangeText={handleDoubleBedroomsChange}
                    placeholder="Enter number of double bedrooms"
                    keyboardType="numeric"
                    error={errors.doubleBedrooms || errors.bedrooms}
                  />

                  <PageInput
                    label="Bathrooms"
                    value={formData.bathrooms}
                    onChangeText={handleBathroomsChange}
                    placeholder="Enter number of bathrooms"
                    keyboardType="numeric"
                    error={errors.bathrooms}
                  />
                </YStack>
              </YStack>
            </Card>

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
              <YStack space="$4">
                <XStack space="$2" alignItems="center">
                  <Card
                    backgroundColor={`${rentalAppTheme.primaryDark}10`}
                    padding="$2"
                    borderRadius="$4"
                  >
                    <Feather
                      name="file-text"
                      size={20}
                      color={rentalAppTheme.primaryDark}
                    />
                  </Card>
                  <Text
                    fontSize="$6"
                    fontWeight="bold"
                    color={rentalAppTheme.textDark}
                  >
                    Description
                  </Text>
                </XStack>
                <YStack space="$2">
                  <PageInput
                    label="Brief Overview"
                    value={formData.shortDescription}
                    onChangeText={(text) => {
                      updateFormData("shortDescription", text);
                      setErrors((prev) => ({ ...prev, shortDescription: "" }));
                    }}
                    placeholder="e.g., Semi-Detached House"
                    error={errors.shortDescription}
                  />
                  <PageTextArea
                    label="Full Description"
                    value={formData.description}
                    onChangeText={(text) => {
                      updateFormData("description", text);
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    placeholder="Describe your property in detail..."
                    error={errors.description}
                  />
                </YStack>
              </YStack>
            </Card>

            {/* Images Section */}
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
              <YStack space="$4">
                <XStack space="$2" alignItems="center">
                  <Card
                    backgroundColor={`${rentalAppTheme.primaryDark}10`}
                    padding="$2"
                    borderRadius="$4"
                  >
                    <Feather
                      name="image"
                      size={20}
                      color={rentalAppTheme.primaryDark}
                    />
                  </Card>
                  <Text
                    fontSize="$6"
                    fontWeight="bold"
                    color={rentalAppTheme.textDark}
                  >
                    Images
                  </Text>
                </XStack>
                <YStack>
                  {errors.images && (
                    <Text
                      color={rentalAppTheme.error}
                      fontSize="$2"
                      marginBottom="$2"
                    >
                      {errors.images}
                    </Text>
                  )}
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
                      borderColor={
                        errors.images
                          ? rentalAppTheme.error
                          : rentalAppTheme.border
                      }
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
                      <Text
                        color={rentalAppTheme.text.secondary}
                        marginTop="$2"
                      >
                        Add Photos
                      </Text>
                    </Button>
                  </XStack>
                </YStack>
              </YStack>
            </Card>

            {/* Location Section */}
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
              <YStack space="$4">
                <XStack space="$2" alignItems="center">
                  <Card
                    backgroundColor={`${rentalAppTheme.primaryDark}10`}
                    padding="$2"
                    borderRadius="$4"
                  >
                    <Feather
                      name="map-pin"
                      size={20}
                      color={rentalAppTheme.primaryDark}
                    />
                  </Card>
                  <Text
                    fontSize="$6"
                    fontWeight="bold"
                    color={rentalAppTheme.textDark}
                  >
                    Location
                  </Text>
                </XStack>
                <YStack space="$2">
                  <PageInput
                    label="Address Line 1"
                    value={formData.houseAddress.addressLine1}
                    onChangeText={handleAddressLine1Change}
                    placeholder="Street address"
                    error={errors.addressLine1}
                  />
                  <PageInput
                    label="Address Line 2"
                    value={formData.houseAddress.addressLine2}
                    onChangeText={handleAddressLine2Change}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                  <XStack space="$4">
                    {/* County Dropdown */}
                    <YStack space="$1.5" flex={1}>
                      <Text
                        fontSize="$4"
                        fontWeight="500"
                        color={rentalAppTheme.textDark}
                      >
                        County
                      </Text>
                      <Select
                        value={formData.houseAddress.county}
                        onValueChange={handleCountyChange}
                        disablePreventBodyScroll
                      >
                        <Select.Trigger
                          backgroundColor="transparent"
                          borderColor={
                            errors.county
                              ? rentalAppTheme.error
                              : rentalAppTheme.border
                          }
                          borderWidth={1}
                          borderRadius="$4"
                          padding="$3"
                          iconAfter={ChevronDown}
                        >
                          <Select.Value placeholder="Select county" />
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
                              <Select.Label>County</Select.Label>
                              {Object.keys(countiesToCities).map(
                                (county, i) => (
                                  <Select.Item
                                    key={county}
                                    value={county}
                                    index={i}
                                  >
                                    <Select.ItemText>{county}</Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                      <Check size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                )
                              )}
                            </Select.Group>
                          </Select.Viewport>
                        </Select.Content>
                      </Select>
                      {errors.county && (
                        <Text color={rentalAppTheme.error} fontSize="$2">
                          {errors.county}
                        </Text>
                      )}
                    </YStack>

                    {/* City Dropdown */}
                    <YStack space="$1.5" flex={1} marginBottom="$4">
                      <Text
                        fontSize="$4"
                        fontWeight="500"
                        color={rentalAppTheme.textDark}
                      >
                        City
                      </Text>
                      <Select
                        value={formData.houseAddress.townCity}
                        onValueChange={(value) => {
                          updateAddress("townCity", value);
                          setErrors((prev) => ({ ...prev, townCity: "" }));
                        }}
                        disablePreventBodyScroll
                      >
                        <Select.Trigger
                          backgroundColor="transparent"
                          borderColor={
                            errors.townCity
                              ? rentalAppTheme.error
                              : rentalAppTheme.border
                          }
                          borderWidth={1}
                          borderRadius="$4"
                          padding="$3"
                          iconAfter={ChevronDown}
                        >
                          <Select.Value
                            placeholder={
                              formData.houseAddress.county
                                ? "Select city"
                                : "Select county first"
                            }
                          />
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
                              <Select.Label>City</Select.Label>
                              {availableCities.length > 0 ? (
                                availableCities.map((city, i) => (
                                  <Select.Item
                                    key={city}
                                    value={city}
                                    index={i}
                                  >
                                    <Select.ItemText>{city}</Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                      <Check size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                ))
                              ) : (
                                <Select.Item value="" disabled index={0}>
                                  <Select.ItemText>
                                    No cities available
                                  </Select.ItemText>
                                </Select.Item>
                              )}
                            </Select.Group>
                          </Select.Viewport>
                        </Select.Content>
                      </Select>
                      {errors.townCity && (
                        <Text color={rentalAppTheme.error} fontSize="$2">
                          {errors.townCity}
                        </Text>
                      )}
                    </YStack>
                  </XStack>
                  <PageInput
                    label="Eircode"
                    value={formData.houseAddress.eircode}
                    onChangeText={handleEircodeChange}
                    placeholder="Enter eircode"
                    error={errors.eircode}
                  />
                </YStack>
              </YStack>
            </Card>
          </YStack>
        </ScrollView>

        {/* Fixed Bottom Button */}
        <YStack
          padding="$4"
          backgroundColor={rentalAppTheme.backgroundLight}
          borderTopWidth={1}
          borderTopColor="$gray4"
          marginBottom="$3"
        >
          <Button
            backgroundColor={rentalAppTheme.primaryDark}
            pressStyle={{ backgroundColor: rentalAppTheme.primaryDarkPressed }}
            borderRadius="$6"
            size="$5"
            elevation={4}
            onPress={async () => {
              if (!validateForm()) {
                return;
              }

              const propertyStore = usePropertyStore.getState();

              propertyStore.setImages(formData.images);
              propertyStore.setPrice(formData.price);
              propertyStore.setAvailability(
                formData.availability as "immediately" | "available_from"
              );
              propertyStore.setIsRented(false);
              propertyStore.setAvailability(formData.availability);
              propertyStore.setAvailableFrom(formData.availableFrom ?? "");
              propertyStore.setDescription(formData.description);
              propertyStore.setShortDescription(formData.shortDescription);
              propertyStore.setPropertyType(formData.propertyType);
              propertyStore.setSingleBedrooms(
                Number(formData.singleBedrooms) || 0
              );
              propertyStore.setDoubleBedrooms(
                Number(formData.doubleBedrooms) || 0
              );
              propertyStore.setBathrooms(
                formData.bathrooms ? Number(formData.bathrooms) : null
              );
              propertyStore.setHouseAddress(formData.houseAddress);

              try {
                await propertyStore.createProperty();
                router.replace("/(tabs)");
              } catch (error: any) {
                if (error.response?.data?.message) {
                  if (
                    error.response.data.message.includes("Insufficient balance")
                  ) {
                    Alert.alert(
                      "Insufficient Balance",
                      `You don't have enough balance to list this property. The listing fee is €${(
                        Number(formData.price) * 0.03
                      ).toFixed(2)}. Please top up your balance to continue.`,
                      [
                        {
                          text: "View Balance",
                          onPress: () => router.push("/(tabs)/profile"),
                        },
                        { text: "OK", style: "cancel" },
                      ]
                    );
                  } else {
                    Alert.alert("Error", error.response.data.message);
                  }
                } else {
                  console.error("Failed to create property:", error);
                  Alert.alert(
                    "Error",
                    "Failed to create property. Please try again."
                  );
                }
              }
            }}
            disabled={isLoading}
          >
            <XStack space="$2" justifyContent="center" alignItems="center">
              <Feather name="plus-circle" size={20} color="white" />
              <Text color="white" fontSize={16} fontWeight="bold">
                {isLoading
                  ? "Listing property..."
                  : `List Property for €${(
                      Number(formData.price) * 0.03
                    ).toFixed(2)} for 30 days`}
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </Theme>
  );
}
