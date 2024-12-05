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
import { rentalAppTheme } from "../../constants/Colors";
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

const countiesToCities = {
  Carlow: [
    "Carlow Town",
    "Tullow",
    "Muine Bheag (Borrisokane)",
    "Borris",
    "Leighlinbridge",
    "Tullowbridge",
    "Ballon",
    "Castlecomer",
  ],
  Cavan: [
    "Cavan Town",
    "Ballyjamesduff",
    "Virginia",
    "Bailieborough",
    "Kingscourt",
    "Belturbet",
    "Swanlinbar",
    "Butlersbridge",
    "Drumalee",
    "Shercock",
  ],
  Clare: [
    "Ennis",
    "Shannon",
    "Kilrush",
    "Killaloe",
    "Lisdoonvarna",
    "Doonbeg",
    "Sixmilebridge",
    "Miltown Malbay",
    "Newmarket-on-Fergus",
    "Mullagh",
    "Kilmihil",
  ],
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
    "Cobh",
    "Fermoy",
    "Mallow",
    "Midleton",
    "Kinsale",
    "Clonakilty",
    "Bandon",
    "Skibbereen",
    "Carrigtwohill",
    "Youghal",
    "Ballincollig",
    "Ballinascorney",
    "Inchigeelagh",
    "Bantry",
    "Killeagh",
    "Drimoleague",
  ],
  Donegal: [
    "Letterkenny",
    "Donegal Town",
    "Buncrana",
    "Ballybofey",
    "Bundoran",
    "Dunfanaghy",
    "Killybegs",
    "Milford",
    "Lifford",
    "Dungloe (An Clochán Liath)",
    "Glenties",
    "Ardara",
    "Moville",
    "Raphoe",
    "Stranorlar",
    "Creeslough",
  ],
  Dublin: [
    "Dublin City",
    "Swords",
    "Drogheda",
    "Tallaght",
    "Blanchardstown",
    "Bray",
    "Malahide",
    "Greystones",
    "Maynooth",
    "Navan (partly in Meath)",
    "Lucan",
    "Celbridge",
    "Ashbourne",
    "Balbriggan",
    "Kilcock",
    "Leixlip",
    "Dalkey",
    "Howth",
    "Rathcoole",
    "Clonsilla",
    "Firhouse",
  ],
  Galway: [
    "Galway City",
    "Tuam",
    "Loughrea",
    "Ballinasloe",
    "Clifden",
    "Oranmore",
    "Athenry",
    "Gort",
    "Ballindine",
    "Carnmore",
    "Kinvara",
    "Salthill",
    "Barna",
    "Cregmore",
    "Spiddal (An Spidéal)",
    "Letterfrack",
  ],
  Kerry: [
    "Tralee",
    "Killarney",
    "Listowel",
    "Dingle (An Daingean)",
    "Killorglin",
    "Kenmare",
    "Cahersiveen",
    "Valentia",
    "Beaufort",
    "Ballybunion",
    "Ballyheigue",
    "Killorglin",
    "Kenmare",
    "Sneem",
    "Waterville",
    "Cahersiveen",
    "Glenbeigh",
  ],
  Kildare: [
    "Naas",
    "Newbridge",
    "Kildare Town",
    "Maynooth",
    "Celbridge",
    "Leixlip",
    "Monasterevin",
    "Maynooth",
    "Kilcock",
    "Prosperous",
    "Clane",
    "Ardclough",
    "Allenwood",
    "Sallins",
    "Johnstownbridge",
    "Kilteel",
  ],
  Kilkenny: [
    "Kilkenny City",
    "Thomastown",
    "Callan",
    "Castlecomer",
    "Bennettsbridge",
    "Durrow",
    "Mullinavat",
    "Freshford",
    "Tullaroan",
    "Gowran",
    "Inistioge",
  ],
  Laois: [
    "Portlaoise",
    "Mountmellick",
    "Abbeyleix",
    "Mountrath",
    "Borris-in-Ossory",
    "Stradbally",
    "Emo",
    "Rosenallis",
    "Timahoe",
    "Ballacolla",
    "The Swan",
    "Mountmellick",
  ],
  Leitrim: [
    "Carrick-on-Shannon",
    "Manorhamilton",
    "Drumshanbo",
    "Ballinamore",
    "Aughawillan",
    "Glenfarne",
    "Rossinver",
    "Dromahair",
  ],
  Limerick: [
    "Limerick City",
    "Adare",
    "Newcastle West",
    "Kilmallock",
    "Rathkeale",
    "Abbeyfeale",
    "Oola",
    "Bruff",
    "Tourin",
    "Cappamore",
    "O'Briensbridge",
    "Askeaton",
    "Fedamore",
    "Raheen",
  ],
  Longford: [
    "Longford Town",
    "Granard",
    "Edgeworthstown (Mostrim)",
    "Ballymahon",
    "Ballymahon",
    "Granard",
    "Edgeworthstown",
    "Kiltoom",
    "Abbeyshrule",
    "Drumlish",
    "Ardagh",
    "Strokestown",
    "Killoe",
  ],
  Louth: [
    "Drogheda",
    "Dundalk",
    "Ardee",
    "Carlingford",
    "Cooley",
    "Castlebellingham",
    "Enfield",
    "Baltray",
    "Termonfeckin",
    "Omeath",
    "Hillsborough",
    "Dowdallshill",
  ],
  Mayo: [
    "Castlebar",
    "Ballina",
    "Westport",
    "Claremorris",
    "Ballinrobe",
    "Belmullet",
    "Swinford",
    "Foxford",
    "Ballaghaderreen",
    "Knock",
    "Cong",
    "Louisburgh",
    "Ballycastle",
    "Clifden",
    "Newport",
  ],
  Meath: [
    "Navan",
    "Kells",
    "Trim",
    "Ashbourne",
    "Ratoath",
    "Dunshaughlin",
    "Dunboyne",
    "Ashbourne",
    "Ratoath",
    "Dunshaughlin",
    "Slane",
    "Martinstown",
    "Kilskyre",
  ],
  Monaghan: [
    "Monaghan Town",
    "Carrickmacross",
    "Castleblayney",
    "Clones",
    "Ballybay",
    "Inniskeen",
    "Scotstown",
    "Emyvale",
  ],
  Offaly: [
    "Tullamore",
    "Birr",
    "Edenderry",
    "Clara",
    "Banagher",
    "Ferbane",
    "Rhode",
    "Shinrone",
    "Durrow",
    "Portarlington",
  ],
  Roscommon: [
    "Roscommon Town",
    "Boyle",
    "Castlerea",
    "Ballaghaderreen",
    "Elphin",
    "Ballyhaunis",
    "Athleague",
    "Knockcroghery",
    "Cloonfad",
    "Crossmolina",
    "Carrick-on-Shannon (partly in Leitrim)",
  ],
  Sligo: [
    "Sligo Town",
    "Tubbercurry",
    "Ballymote",
    "Enniscrone",
    "Achonry",
    "Aclare",
    "Ballaghnatrillick",
    "Ballinafad",
    "Ballincar",
    "Ballintogher",
    "Ballygawley",
    "Ballynacarrow",
    "Ballysadare",
    "Bellaghy",
    "Beltra",
    "Bunnanadden",
    "Carney",
    "Castlebaldwin",
    "Charlestown-Bellahy",
    "Cliffoney",
    "Cloonacool",
    "Collooney",
    "Coolaney",
    "Dromore West",
    "Drumcliff",
    "Easky",
    "Geevagh",
    "Gorteen",
    "Grange",
    "Kilglass",
    "Knocknahur",
    "Monasteraden",
    "Mullaghmore",
    "Nagnata",
    "Owenbeg",
    "Rathcormack",
    "Riverstown",
    "Rosses Point",
    "Skreen",
    "Sooey",
    "Strandhill",
    "Toorlestraun",
  ],
  Tipperary: [
    "Clonmel",
    "Nenagh",
    "Thurles",
    "Cashel",
    "Tipperary Town",
    "Carrick-on-Suir",
    "Cahir",
    "Newport",
    "Borrisokane",
    "Roscrea",
    "Kilruane",
    "Golden",
    "Tipperary Town",
    "Templemore",
  ],
  Waterford: [
    "Waterford City",
    "Dungarvan",
    "Tramore",
    "Lismore",
    "Portlaw",
    "Carrick-on-Suir",
    "Kilmacthomas",
    "Cappoquin",
    "Youghal",
    "Ballymacarbry",
    "Dungarvan",
    "Tramore",
    "Passage East",
    "Ballygunner",
  ],
  Westmeath: [
    "Mullingar",
    "Athlone",
    "Kinnegad",
    "Moate",
    "Castlepollard",
    "Delvin",
    "Rochfortbridge",
    "Tyrrellspass",
    "Castlemaine",
    "Ferbane",
  ],
  Wexford: [
    "Wexford Town",
    "Gorey",
    "New Ross",
    "Enniscorthy",
    "Bunclody",
    "Rosslare Europort",
    "Arklow",
    "Ballygarrett",
    "Courtown",
    "Bridgetown",
  ],
  Wicklow: [
    "Wicklow Town",
    "Arklow",
    "Bray",
    "Greystones",
    "Blessington",
    "Avoca",
    "Ashford",
    "Tinahely",
    "Roundwood",
    "Rathdrum",
    "Baltinglass",
    "Enniskerry",
    "Hollywood",
  ],
};

export default function ListPropertyScreen() {
  const router = useRouter();
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
    },
    [updateFormData]
  );

  const handleSingleBedroomsChange = useCallback(
    (text: string) => {
      updateFormData("singleBedrooms", text);
    },
    [updateFormData]
  );

  const handleDoubleBedroomsChange = useCallback(
    (text: string) => {
      updateFormData("doubleBedrooms", text);
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

  const handleCountyChange = useCallback(
    (value: string) => {
      updateAddress("county", value);
      updateAddress("townCity", "");
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
                    onValueChange={(value) => {
                      updateFormData("availability", value);
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
                  error={errors.singleBedrooms}
                />

                {/* Double Bedrooms Input */}
                <PageInput
                  label="Double Bedrooms"
                  value={formData.doubleBedrooms}
                  onChangeText={handleDoubleBedroomsChange}
                  placeholder="Enter number of double bedrooms"
                  keyboardType="numeric"
                  error={errors.doubleBedrooms}
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

                  {/* City Dropdown */}
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
                                <Select.Item key={city} value={city} index={i}>
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
            </Card>

            {/* Submit Button */}
            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{
                backgroundColor: rentalAppTheme.primaryDarkPressed,
              }}
              borderRadius="$4"
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
                } catch (error) {
                  console.error("Failed to create property:", error);
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
