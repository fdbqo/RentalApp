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
import { KeyboardTypeOptions } from "react-native";

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
        borderColor={error ? rentalAppTheme.error : rentalAppTheme.border}
        borderWidth={1}
        borderRadius="$4"
        padding="$3"
        fontSize="$4"
        backgroundColor="transparent"
      />
      {error && (
        <Text color={rentalAppTheme.error} fontSize="$2">
          {error}
        </Text>
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
      <Text
        fontSize="$4"
        fontWeight="500"
        color={rentalAppTheme.text.secondary}
      >
        {label}
      </Text>
      <TextArea
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        minHeight={120}
        borderColor={error ? rentalAppTheme.error : rentalAppTheme.border}
        borderWidth={1}
        borderRadius="$4"
        fontSize="$4"
        backgroundColor="transparent"
      />
      {error && (
        <Text color={rentalAppTheme.error} fontSize="$2">
          {error}
        </Text>
      )}
    </YStack>
  )
);

const propertyTypes = [
  { type: "House" },
  { type: "Apartment" },
  { type: "Shared living" },
];

const availabilityOptions = [{ type: "Available" }, { type: "Not available" }];

const countiesToCities: { [key: string]: string[] } = {
  Carlow: ["Carlow Town", "Tullow", "Muine Bheag", "Hacketstown"],
  Cavan: ["Cavan Town", "Ballyjamesduff", "Virginia", "Bailieborough"],
  Clare: ["Ennis", "Shannon", "Kilrush", "Killaloe", "Lisdoonvarna"],
  Cork: [
    "Cork City",
    "Mallow",
    "Kinsale",
    "Midleton",
    "Clonakilty",
    "Bantry",
    "Youghal",
    "Bandon",
    "Skibbereen",
  ],
  Donegal: [
    "Letterkenny",
    "Donegal Town",
    "Buncrana",
    "Ballybofey",
    "Bundoran",
    "Dunfanaghy",
    "Killybegs",
  ],
  Dublin: ["Dublin City", "Swords", "Drogheda", "Tallaght", "Blanchardstown"],
  Galway: [
    "Galway City",
    "Salthill",
    "Tuam",
    "Loughrea",
    "Ballinasloe",
    "Clifden",
    "Oranmore",
  ],
  Kerry: [
    "Tralee",
    "Killarney",
    "Listowel",
    "Dingle",
    "Killorglin",
    "Kenmare",
    "Cahersiveen",
  ],
  Kildare: [
    "Naas",
    "Newbridge",
    "Kildare Town",
    "Maynooth",
    "Celbridge",
    "Leixlip",
  ],
  Kilkenny: ["Kilkenny City", "Thomastown", "Callan", "Castlecomer"],
  Laois: ["Portlaoise", "Mountmellick", "Abbeyleix", "Mountrath"],
  Leitrim: ["Carrick-on-Shannon", "Manorhamilton", "Drumshanbo", "Ballinamore"],
  Limerick: [
    "Limerick City",
    "Adare",
    "Newcastle West",
    "Kilmallock",
    "Rathkeale",
  ],
  Longford: ["Longford Town", "Granard", "Edgeworthstown", "Ballymahon"],
  Louth: ["Drogheda", "Dundalk", "Ardee", "Carlingford"],
  Mayo: ["Castlebar", "Westport", "Ballina", "Claremorris", "Belmullet"],
  Meath: ["Navan", "Kells", "Trim", "Ashbourne", "Ratoath", "Dunshaughlin"],
  Monaghan: ["Monaghan Town", "Carrickmacross", "Castleblayney", "Clones"],
  Offaly: ["Tullamore", "Birr", "Edenderry", "Clara", "Banagher"],
  Roscommon: ["Roscommon Town", "Boyle", "Castlerea", "Ballaghaderreen"],
  Sligo: ["Sligo Town", "Tubbercurry", "Ballymote", "Enniscrone"],
  Tipperary: [
    "Clonmel",
    "Nenagh",
    "Thurles",
    "Cashel",
    "Tipperary Town",
    "Carrick-on-Suir",
  ],
  Waterford: ["Waterford City", "Dungarvan", "Tramore", "Lismore", "Portlaw"],
  Westmeath: ["Mullingar", "Athlone", "Kinnegad", "Moate"],
  Wexford: ["Wexford Town", "Gorey", "New Ross", "Enniscorthy", "Bunclody"],
  Wicklow: ["Wicklow Town", "Arklow", "Bray", "Greystones", "Blessington"],
  Antrim: ["Belfast", "Lisburn", "Carrickfergus", "Ballymena", "Antrim Town"],
  Armagh: ["Armagh City", "Portadown", "Craigavon", "Lurgan"],
  "Derry (Londonderry)": ["Derry", "Coleraine", "Limavady", "Magherafelt"],
  Down: ["Newry", "Belfast", "Bangor", "Downpatrick", "Holywood"],
  Fermanagh: ["Enniskillen", "Lisnaskea", "Irvinestown"],
  Tyrone: ["Omagh", "Dungannon", "Cookstown", "Strabane"],
};

export default function EditPropertyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties, updateProperty } = usePropertyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const property = properties.find((p) => p._id === id);

  const [formData, setFormData] = useState({
    shortDescription: "",
    description: "",
    price: "",
    propertyType: "",
    roomsAvailable: "",
    bathrooms: "",
    availability: "",
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
        propertyType: property.propertyType || "",
        roomsAvailable: property.roomsAvailable
          ? property.roomsAvailable.toString()
          : "",
        bathrooms: property.bathrooms ? property.bathrooms.toString() : "",
        availability: property.availability ? "available" : "not available",
        houseAddress: {
          addressLine1: property.houseAddress.addressLine1 || "",
          addressLine2: property.houseAddress.addressLine2 || "",
          townCity: property.houseAddress.townCity || "",
          county: property.houseAddress.county || "",
          eircode: property.houseAddress.eircode || "",
        },
        images: property.images
          ? property.images.map((img, index) => ({
              id: img.id || `${img.uri}-${index}`,
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

    if (!formData.roomsAvailable || isNaN(Number(formData.roomsAvailable))) {
      newErrors.roomsAvailable = "Please enter number of bedrooms";
    }

    if (!formData.bathrooms || isNaN(Number(formData.bathrooms))) {
      newErrors.bathrooms = "Please enter number of bathrooms";
    }

    if (!formData.shortDescription) {
      newErrors.shortDescription = "Please enter a brief overview";
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

    if (!formData.houseAddress.eircode) {
      newErrors.eircode = "Please enter an eircode";
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

      const updatedProperty: Partial<Property> = {
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        roomsAvailable: Number(formData.roomsAvailable),
        bathrooms: Number(formData.bathrooms),
        availability: formData.availability === "available",
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
    } catch (error) {
      console.error("Failed to update property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  error={errors.price}
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
                  {errors.propertyType && (
                    <Text color={rentalAppTheme.error} fontSize="$2">
                      {errors.propertyType}
                    </Text>
                  )}
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
                    value={formData.availability}
                    onValueChange={(value) =>
                      updateFormData("availability", value)
                    }
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
                  {errors.availability && (
                    <Text color={rentalAppTheme.error} fontSize="$2">
                      {errors.availability}
                    </Text>
                  )}
                </YStack>

                <PageInput
                  label="Bedrooms"
                  value={formData.roomsAvailable}
                  onChangeText={(text) =>
                    updateFormData("roomsAvailable", text)
                  }
                  placeholder="Enter number"
                  keyboardType="numeric"
                  error={errors.roomsAvailable}
                />

                <PageInput
                  label="Bathrooms"
                  value={formData.bathrooms}
                  onChangeText={(text) => updateFormData("bathrooms", text)}
                  placeholder="Enter number"
                  keyboardType="numeric"
                  error={errors.bathrooms}
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
                {formData.images.map((img, index) => (
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
            </Card>

            {/* Address Section */}
            <Card padding="$4" marginBottom="$4">
              <Heading
                size="$6"
                color={rentalAppTheme.textDark}
                marginBottom="$4"
              >
                Location
              </Heading>
              <YStack space="$2">
                <PageInput
                  label="Address Line 1"
                  value={formData.houseAddress.addressLine1}
                  onChangeText={(text) => updateAddress("addressLine1", text)}
                  placeholder="Street address"
                  error={errors.addressLine1}
                />
                <PageInput
                  label="Address Line 2"
                  value={formData.houseAddress.addressLine2}
                  onChangeText={(text) => updateAddress("addressLine2", text)}
                  placeholder="Apartment, suite, etc. (optional)"
                />
                <XStack space="$4">
                  {/* County Dropdown */}
                  <YStack flex={1}>
                    <Text
                      fontSize="$4"
                      fontWeight="500"
                      color={rentalAppTheme.text.secondary}
                      marginBottom="$2"
                    >
                      County
                    </Text>
                    <Select
                      value={formData.houseAddress.county}
                      onValueChange={(value) => {
                        updateAddress("county", value);
                        updateAddress("townCity", "");
                      }}
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
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.county}
                      </Text>
                    )}
                  </YStack>

                  <YStack flex={1} marginBottom="$4">
                    <Text
                      fontSize="$4"
                      fontWeight="500"
                      color={rentalAppTheme.text.secondary}
                      marginBottom="$2"
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
                        <Select.Value>
                          {formData.houseAddress.townCity
                            ? formData.houseAddress.townCity
                            : "Select city"}
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
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.townCity}
                      </Text>
                    )}
                  </YStack>
                </XStack>
                <PageInput
                  label="Eircode"
                  value={formData.houseAddress.eircode}
                  onChangeText={(text) => updateAddress("eircode", text)}
                  placeholder="Enter eircode"
                  error={errors.eircode}
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
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Text>
              </XStack>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
