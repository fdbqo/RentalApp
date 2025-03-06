import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { usePropertyStore } from "@/store/property.store";
import { Property } from "@/store/interfaces/Property";
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  ScrollView,
  Theme,
  TextArea,
  Image,
  Select,
  Adapt,
  Sheet,
  Card,
  Heading,
} from "tamagui";
import { Feather } from "@expo/vector-icons";
import { rentalAppTheme } from "@/constants/Colors";
import NavigationHeader from "@/components/NavigationHeader";
import * as ImagePicker from "expo-image-picker";
import { ChevronDown, Check } from "@tamagui/lucide-icons";
import { KeyboardTypeOptions, Alert } from "react-native";
import { countiesToCities } from "@/constants/irishPlaces";
import DateTimePicker from "@react-native-community/datetimepicker";

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

const propertyTypes = [
  { type: "House" },
  { type: "Apartment" },
  { type: "Shared living" },
];

const availabilityOptions = [
  { type: "Available Immediately", value: "immediately" },
  { type: "Available From", value: "available_from" },
];

export default function EditPropertyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties, updateProperty } = usePropertyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const property = properties.find((p) => p._id === id);

  const [formData, setFormData] = useState({
    shortDescription: "",
    description: "",
    price: "",
    propertyType: "",
    singleBedrooms: "",
    doubleBedrooms: "",
    bathrooms: "",
    availability: "immediately",
    availableFrom: undefined as string | undefined,
    houseAddress: {
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      county: "",
      eircode: "",
    },
    images: [] as Array<{ id: string; uri: string }>,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (property) {
      setFormData({
        shortDescription: property.shortDescription || "",
        description: property.description || "",
        price: property.price ? property.price.toString() : "",
        propertyType: property.propertyType
          ? property.propertyType.toLowerCase()
          : "",
        singleBedrooms: property.singleBedrooms
          ? property.singleBedrooms.toString()
          : "",
        doubleBedrooms: property.doubleBedrooms
          ? property.doubleBedrooms.toString()
          : "",
        bathrooms: property.bathrooms ? property.bathrooms.toString() : "",
        availability: property.availability || "immediately",
        availableFrom: property.availableFrom || undefined,
        houseAddress: {
          addressLine1: property.houseAddress.addressLine1 || "",
          addressLine2: property.houseAddress.addressLine2 || "",
          townCity: property.houseAddress.townCity || "",
          county: property.houseAddress.county || "",
          eircode: property.houseAddress.eircode || "",
        },
        images: property.images
          ? property.images.map((img, index) => ({
              id: img._id || `${img.uri}-${index}`,
              uri: img.uri,
            }))
          : [],
      });
    }
  }, [property]);

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

  if (!property) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Property not found</Text>
      </YStack>
    );
  }

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

  const availableCities =
    formData.houseAddress.county &&
    countiesToCities[formData.houseAddress.county]
      ? countiesToCities[formData.houseAddress.county]
      : [];

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedProperty = {
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        singleBedrooms: Number(formData.singleBedrooms) || 0,
        doubleBedrooms: Number(formData.doubleBedrooms) || 0,
        bathrooms: Number(formData.bathrooms),
        availability: formData.availability as "immediately" | "available_from",
        availableFrom: formData.availableFrom,
        houseAddress: {
          addressLine1: formData.houseAddress.addressLine1,
          addressLine2: formData.houseAddress.addressLine2 || "",
          townCity: formData.houseAddress.townCity,
          county: formData.houseAddress.county,
          eircode: formData.houseAddress.eircode,
        },
        images: formData.images,
        lastUpdated: new Date().toISOString(),
      };

      await updateProperty(id as string, updatedProperty);
      router.back();
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Error", error.response.data.message);
      } else {
        console.error("Failed to update property:", error);
        Alert.alert("Error", "Failed to update property. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        <NavigationHeader title="Edit Property" />
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

                <YStack space="$4">
                  <PageInput
                    label="Price per Month (€)"
                    value={formData.price}
                    onChangeText={handlePriceChange}
                    placeholder="Enter price"
                    keyboardType="numeric"
                    error={errors.price}
                  />

                  {/* Property Type Select */}
                  <YStack space="$2">
                    <Text
                      fontSize="$4"
                      fontWeight="600"
                      color={rentalAppTheme.textDark}
                    >
                      Property Type
                    </Text>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => {
                        updateFormData("propertyType", value);
                        setErrors((prev) => ({ ...prev, propertyType: "" }));
                      }}
                      disablePreventBodyScroll
                    >
                      <Select.Trigger
                        backgroundColor="white"
                        borderColor={
                          errors.propertyType ? rentalAppTheme.error : "$gray4"
                        }
                        borderWidth={1}
                        borderRadius="$6"
                        padding="$3.5"
                        iconAfter={ChevronDown}
                      >
                        <Select.Value>
                          {formData.propertyType
                            ? propertyTypes.find(
                                (type) =>
                                  type.type.toLowerCase() ===
                                  formData.propertyType
                              )?.type || "Select property type"
                            : "Select property type"}
                        </Select.Value>
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
                      <XStack space="$2" alignItems="center">
                        <Feather
                          name="alert-circle"
                          size={14}
                          color={rentalAppTheme.error}
                        />
                        <Text color={rentalAppTheme.error} fontSize="$3">
                          {errors.propertyType}
                        </Text>
                      </XStack>
                    )}
                  </YStack>

                  {/* Availability Section */}
                  <YStack space="$2">
                    <Text
                      fontSize="$4"
                      fontWeight="600"
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
                        backgroundColor="white"
                        borderColor={
                          errors.availability ? rentalAppTheme.error : "$gray4"
                        }
                        borderWidth={1}
                        borderRadius="$6"
                        padding="$3.5"
                        iconAfter={ChevronDown}
                      >
                        <Select.Value>
                          {formData.availability === "immediately"
                            ? "Available Immediately"
                            : formData.availability === "available_from"
                            ? "Available From"
                            : "Select availability"}
                        </Select.Value>
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
                      <XStack space="$2" alignItems="center">
                        <Feather
                          name="alert-circle"
                          size={14}
                          color={rentalAppTheme.error}
                        />
                        <Text color={rentalAppTheme.error} fontSize="$3">
                          {errors.availability}
                        </Text>
                      </XStack>
                    )}

                    {formData.availability === "available_from" && (
                      <YStack space="$2" marginTop="$2">
                        <Text
                          fontSize="$4"
                          fontWeight="600"
                          color={rentalAppTheme.textDark}
                        >
                          Available From
                        </Text>
                        <Button
                          backgroundColor="white"
                          borderColor="$gray4"
                          borderWidth={1}
                          borderRadius="$6"
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text
                            color={
                              formData.availableFrom &&
                              formData.availableFrom !== "immediately"
                                ? rentalAppTheme.textDark
                                : rentalAppTheme.textLight
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
                                setErrors((prev) => ({
                                  ...prev,
                                  availableFrom: "",
                                }));
                              }
                            }}
                            minimumDate={new Date()}
                          />
                        )}
                        {errors.availableFrom && (
                          <XStack space="$2" alignItems="center">
                            <Feather
                              name="alert-circle"
                              size={14}
                              color={rentalAppTheme.error}
                            />
                            <Text color={rentalAppTheme.error} fontSize="$3">
                              {errors.availableFrom}
                            </Text>
                          </XStack>
                        )}
                      </YStack>
                    )}
                  </YStack>

                  {/* Bedrooms and Bathrooms */}
                  <XStack space="$4">
                    <YStack flex={1}>
                      <PageInput
                        label="Single Bedrooms"
                        value={formData.singleBedrooms}
                        onChangeText={handleSingleBedroomsChange}
                        placeholder="Number"
                        keyboardType="numeric"
                        error={errors.singleBedrooms || errors.bedrooms}
                      />
                    </YStack>
                    <YStack flex={1}>
                      <PageInput
                        label="Double Bedrooms"
                        value={formData.doubleBedrooms}
                        onChangeText={handleDoubleBedroomsChange}
                        placeholder="Number"
                        keyboardType="numeric"
                        error={errors.doubleBedrooms || errors.bedrooms}
                      />
                    </YStack>
                  </XStack>

                  <PageInput
                    label="Bathrooms"
                    value={formData.bathrooms}
                    onChangeText={handleBathroomsChange}
                    placeholder="Number"
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
                    onChangeText={(text) =>
                      updateFormData("shortDescription", text)
                    }
                    placeholder="e.g., Semi-Detached House"
                    error={errors.shortDescription}
                  />
                  <PageTextArea
                    label="Full Description"
                    value={formData.description}
                    onChangeText={(text) => updateFormData("description", text)}
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
                <XStack space="$2" paddingBottom="$4" alignItems="center">
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

                {errors.images && (
                  <XStack space="$2" alignItems="center">
                    <Feather
                      name="alert-circle"
                      size={14}
                      color={rentalAppTheme.error}
                    />
                    <Text color={rentalAppTheme.error} fontSize="$3">
                      {errors.images}
                    </Text>
                  </XStack>
                )}

                <XStack flexWrap="wrap" gap="$4">
                  {formData.images.map((img) => (
                    <YStack key={img.id} position="relative">
                      <Card
                        elevate
                        bordered
                        borderRadius="$4"
                        overflow="hidden"
                        width={150}
                        height={150}
                      >
                        <Image
                          source={{ uri: img.uri }}
                          width={150}
                          height={150}
                          resizeMode="cover"
                        />
                      </Card>
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
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={2}
                    borderRadius="$4"
                    borderStyle="dashed"
                    onPress={pickImage}
                    justifyContent="center"
                    alignItems="center"
                    pressStyle={{
                      backgroundColor: "$gray2",
                    }}
                  >
                    <YStack alignItems="center" space="$2">
                      <Feather
                        name="plus"
                        size={24}
                        color={rentalAppTheme.textLight}
                      />
                      <Text color={rentalAppTheme.textLight}>Add Photos</Text>
                    </YStack>
                  </Button>
                </XStack>
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

                <YStack space="$1">
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

                  <YStack space="$1.5" marginBottom="$4">
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
                        backgroundColor="white"
                        borderColor={
                          errors.county ? rentalAppTheme.error : "$gray4"
                        }
                        borderWidth={1}
                        borderRadius="$6"
                        padding="$3.5"
                        iconAfter={ChevronDown}
                      >
                        <Select.Value>
                          {formData.houseAddress.county || "Select county"}
                        </Select.Value>
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
                            {Object.keys(countiesToCities).map((county, i) => (
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
                            ))}
                          </Select.Group>
                        </Select.Viewport>
                      </Select.Content>
                    </Select>
                    {errors.county && (
                      <XStack space="$2" alignItems="center" marginTop="$1">
                        <Feather
                          name="alert-circle"
                          size={14}
                          color={rentalAppTheme.error}
                        />
                        <Text color={rentalAppTheme.error} fontSize="$3">
                          {errors.county}
                        </Text>
                      </XStack>
                    )}
                  </YStack>

                  <YStack space="$1.5" marginBottom="$4">
                    <Text
                      fontSize="$4"
                      fontWeight="500"
                      color={rentalAppTheme.textDark}
                    >
                      City
                    </Text>
                    <Select
                      value={formData.houseAddress.townCity}
                      onValueChange={(value) =>
                        updateAddress("townCity", value)
                      }
                      disablePreventBodyScroll
                    >
                      <Select.Trigger
                        backgroundColor="white"
                        borderColor={
                          errors.townCity ? rentalAppTheme.error : "$gray4"
                        }
                        borderWidth={1}
                        borderRadius="$6"
                        padding="$3.5"
                        iconAfter={ChevronDown}
                      >
                        <Select.Value>
                          {formData.houseAddress.townCity || "Select city"}
                        </Select.Value>
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
                      {formData.houseAddress.county ? (
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
                      ) : null}
                    </Select>
                    {errors.townCity && (
                      <XStack space="$2" alignItems="center" marginTop="$1">
                        <Feather
                          name="alert-circle"
                          size={14}
                          color={rentalAppTheme.error}
                        />
                        <Text color={rentalAppTheme.error} fontSize="$3">
                          {errors.townCity}
                        </Text>
                      </XStack>
                    )}
                  </YStack>

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
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <XStack space="$2" justifyContent="center" alignItems="center">
              <Feather name="save" size={20} color="white" />
              <Text color="white" fontSize={16} fontWeight="bold">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Text>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </Theme>
  );
}
