import React from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
  Theme,
  Image,
} from "tamagui";
import { usePropertyStore } from "../../store/property.store";
import { Property } from "../../store/interfaces/Property";
import { rentalAppTheme } from "../../constants/Colors";

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  subtitle?: string;
}

interface PropertyItemProps {
  item: Property;
  onPress?: () => void;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ item, onPress }) => {
  const formattedDate = item.lastUpdated
    ? new Date(item.lastUpdated).toLocaleDateString()
    : "";

  const totalRooms = item.singleBedrooms + item.doubleBedrooms;

  return (
    <Card
      bordered
      elevate
      animation="bouncy"
      scale={0.97}
      hoverStyle={{ scale: 1 }}
      pressStyle={{ scale: 0.96 }}
      borderRadius="$6"
      backgroundColor="white"
      marginBottom="$4"
      shadowColor={rentalAppTheme.textDark}
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      onPress={onPress}
    >
      <XStack padding="$4" space="$4">
        {/* Left side: Property Image */}
        {item.images && item.images.length > 0 && (
          <Card
            width={80}
            height={80}
            borderRadius="$4"
            overflow="hidden"
            backgroundColor={rentalAppTheme.backgroundLight}
          >
            <Image
              source={{ uri: item.images[0].uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </Card>
        )}

        {/* Right side: Property Details */}
        <YStack flex={1} space="$2">
          {/* Row 1: Address + Status */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={16}
              fontWeight="bold"
              color={rentalAppTheme.textDark}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.shortDescription || item.houseAddress.addressLine1}
            </Text>
            <Card
              backgroundColor={!item.isRented ? "$green2" : "$red2"}
              borderRadius="$4"
              paddingHorizontal="$2"
              paddingVertical="$1"
            >
              <Text
                fontSize={12}
                color={!item.isRented ? "$green9" : "$red9"}
                fontWeight="500"
              >
                {item.isRented ? "Rented" : "Available"}
              </Text>
            </Card>
          </XStack>

          {/* Row 2: Location */}
          <XStack space="$2" alignItems="center">
            <Feather
              name="map-pin"
              size={14}
              color={rentalAppTheme.textLight}
            />
            <Text
              fontSize={14}
              color={rentalAppTheme.textLight}
              numberOfLines={1}
            >
              {`${item.houseAddress.addressLine1}, ${item.houseAddress.townCity}`}
            </Text>
          </XStack>

          {/* Row 3: Price and Details */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={18}
              color={rentalAppTheme.primaryDark}
              fontWeight="600"
            >
              €{item.price.toLocaleString()}
              <Text fontSize={14} color={rentalAppTheme.textLight}>
                /month
              </Text>
            </Text>
            {/* <XStack space="$2" alignItems="center">
              <Card
                backgroundColor="$gray2"
                borderRadius="$4"
                paddingHorizontal="$2"
                paddingVertical="$1"
              >
                <XStack space="$1" alignItems="center">
                  <Feather
                    name="home"
                    size={12}
                    color={rentalAppTheme.textLight}
                  />
                  <Text fontSize={12} color={rentalAppTheme.textLight}>
                    {totalRooms} {totalRooms === 1 ? "room" : "rooms"}
                  </Text>
                </XStack>
              </Card>
            </XStack> */}
          </XStack>

          {/* Row 4: Last Updated */}
          {formattedDate && (
            <XStack space="$2" alignItems="center" marginTop="$1">
              <Feather
                name="clock"
                size={12}
                color={rentalAppTheme.textLight}
              />
              <Text fontSize={12} color={rentalAppTheme.textLight}>
                Updated {formattedDate}
              </Text>
            </XStack>
          )}
        </YStack>
      </XStack>
    </Card>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
}) => (
  <Card
    elevate
    bordered
    flex={1}
    borderRadius="$6"
    backgroundColor="white"
    padding="$3"
    shadowColor={rentalAppTheme.textDark}
    shadowOffset={{ width: 0, height: 4 }}
    shadowOpacity={0.1}
    shadowRadius={8}
  >
    <YStack space="$2" alignItems="center">
      <XStack space="$2" alignItems="center">
        <Card backgroundColor={`${color}10`} padding="$2" borderRadius="$4">
          <Feather name={icon} size={16} color={color} />
        </Card>
        <Text fontSize={22} fontWeight="bold" color={color}>
          {value}
        </Text>
      </XStack>

      <Text fontSize={14} color={rentalAppTheme.textDark} textAlign="center">
        {title}
      </Text>
      {subtitle && (
        <Text fontSize={12} color={rentalAppTheme.textLight} textAlign="center">
          {subtitle}
        </Text>
      )}
    </YStack>
  </Card>
);

const RevenueCard: React.FC<{ totalRevenue: number }> = ({ totalRevenue }) => (
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
    marginBottom="$4"
    width="100%"
  >
    <YStack space="$2">
      <XStack space="$2" alignItems="center">
        <Card
          backgroundColor={`${rentalAppTheme.primaryLight}10`}
          padding="$2"
          borderRadius="$4"
        >
          <Feather
            name="trending-up"
            size={16}
            color={rentalAppTheme.primaryLight}
          />
        </Card>
        <Text fontSize={16} fontWeight="600" color={rentalAppTheme.textDark}>
          Monthly Revenue
        </Text>
      </XStack>
      <Text fontSize={22} fontWeight="bold" color={rentalAppTheme.primaryDark}>
        €{totalRevenue.toLocaleString()}
        <Text fontSize={16} color={rentalAppTheme.textLight}>
          /month
        </Text>
      </Text>
    </YStack>
  </Card>
);

export default function LandlordDashboardScreen() {
  const router = useRouter();
  const { properties, isLoading, error, fetchLandlordProperties } =
    usePropertyStore();

  React.useEffect(() => {
    fetchLandlordProperties();
  }, []);

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => !p.isRented).length;
  const rentedProperties = properties.filter((p) => p.isRented).length;
  const totalRevenue = properties
    .filter((p) => p.isRented)
    .reduce((sum, p) => sum + p.price, 0);

  const stats = {
    total: totalProperties,
    available: availableProperties,
    rented: rentedProperties,
    totalRevenue: totalRevenue,
  };

  const handlePropertyPress = (item: Property) => {
    router.push({
      pathname: "/screens/ManagePropertyScreen",
      params: {
        id: item._id,
      },
    });
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="red">{error}</Text>
      </YStack>
    );
  }

  return (
    <Theme name="light">
      <YStack
        flex={1}
        backgroundColor={rentalAppTheme.backgroundLight}
        padding="$4"
      >
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <YStack>
            <Text
              fontSize={28}
              fontWeight="bold"
              color={rentalAppTheme.textDark}
            >
              Dashboard
            </Text>
            <Text fontSize={16} color={rentalAppTheme.textLight}>
              Manage your properties
            </Text>
          </YStack>
          <Button
            variant="outlined"
            padding="$2"
            borderWidth={0}
            backgroundColor="$gray2"
            borderRadius="$4"
          >
            <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
          </Button>
        </XStack>

        {/* Statistics */}
        <XStack space="$3" marginBottom="$4">
          <StatCard
            title="Total"
            value={stats.total}
            icon="home"
            color={rentalAppTheme.primaryDark}
          />
          <StatCard
            title="Available"
            value={stats.available}
            icon="check-circle"
            color={rentalAppTheme.primaryLight}
          />
          <StatCard
            title="Rented"
            value={stats.rented}
            icon="key"
            color={rentalAppTheme.accentDarkRed}
          />
        </XStack>

        {/* Revenue Card */}
        <RevenueCard totalRevenue={stats.totalRevenue} />

        {/* Properties Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$3"
          marginTop="$2"
        >
          <Text fontSize={20} fontWeight="600" color={rentalAppTheme.textDark}>
            Your Properties
          </Text>
        </XStack>

        {/* Properties List */}
        {totalProperties === 0 ? (
          <Card
            backgroundColor="$gray2"
            borderRadius="$6"
            padding="$4"
            alignItems="center"
            justifyContent="center"
            flex={1}
            marginBottom="$4"
          >
            <Feather name="home" size={40} color={rentalAppTheme.textLight} />
            <Text
              fontSize={16}
              color={rentalAppTheme.textLight}
              textAlign="center"
              marginTop="$2"
            >
              You haven't listed any properties yet
            </Text>
          </Card>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {properties.map((property) => (
              <PropertyItem
                key={property._id}
                item={property}
                onPress={() => handlePropertyPress(property)}
              />
            ))}
          </ScrollView>
        )}

        {/* Add New Property Button */}
        <Button
          onPress={() => router.push("/screens/ListPropertyScreen")}
          backgroundColor={rentalAppTheme.primaryDark}
          pressStyle={{ backgroundColor: rentalAppTheme.primaryDarkPressed }}
          borderRadius="$6"
          marginTop="$4"
          elevation={4}
        >
          <XStack space="$2" justifyContent="center" alignItems="center">
            <Feather name="plus-circle" size={20} color="white" />
            <Text
              color="white"
              fontSize={16}
              fontWeight="bold"
              textAlign="center"
            >
              List a New Property
            </Text>
          </XStack>
        </Button>
      </YStack>
    </Theme>
  );
}
