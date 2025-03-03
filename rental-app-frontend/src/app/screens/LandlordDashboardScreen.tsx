import React from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { YStack, XStack, Text, Button, Card, ScrollView, Theme } from "tamagui";
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
      borderRadius="$4"
      backgroundColor="white"
      marginBottom="$3"
      shadowColor={rentalAppTheme.textDark}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      onPress={onPress}
    >
      <XStack padding="$3" space="$3">
        <YStack flex={1} space="$2">
          {/* Row 1: Address + Availability */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={16}
              fontWeight="bold"
              color={rentalAppTheme.textDark}
            >
              {item.houseAddress.addressLine1}
            </Text>
            <Text
              fontSize={14}
              color={
                !item.isRented
                  ? rentalAppTheme.primaryLight
                  : rentalAppTheme.accentDarkRed
              }
              fontWeight="500"
            >
              {item.isRented
                ? "Rented"
                : item.availableFrom
                  ? `Available from ${new Date(item.availableFrom).toLocaleDateString()}`
                  : "Available Now"}

            </Text>
          </XStack>

          {/* Row 2: City */}
          <XStack space="$2" alignItems="center">
            <Feather name="map-pin" size={14} color={rentalAppTheme.textLight} />
            <Text fontSize={14} color={rentalAppTheme.textLight}>
              {item.houseAddress.townCity}
            </Text>
          </XStack>

        

       
        {/* {item.nearestUniversity && (
          <YStack space="$1">
            <Text fontWeight="600" fontSize={14} color={rentalAppTheme.textDark}>
              Nearest University
            </Text>

            <XStack alignItems="center" space="$2">
              <Feather name="book" size={14} color={rentalAppTheme.textLight} />
              <Text fontSize={14} color={rentalAppTheme.textDark}>
                {item.nearestUniversity.name}
              </Text>
            </XStack>

         
            <XStack space="$2" alignItems="center">
              {!!item.nearestUniversity.distance && (
                <Text fontSize={14} color={rentalAppTheme.textLight}>
                  {(item.nearestUniversity.distance / 1000).toFixed(1)} km
                </Text>
              )}
              {!!item.nearestUniversity.avgTimeByCar && (
                <Text fontSize={14} color={rentalAppTheme.textLight}>
                  • ~{item.nearestUniversity.avgTimeByCar} min by car
                </Text>
              )}
            </XStack>
          </YStack>
        )} */}

          {/* Row 3: Price + Property Type/Rooms */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={15}
              color={rentalAppTheme.primaryDark}
              fontWeight="600"
            >
              €{item.price.toLocaleString()}/month
            </Text>
            <XStack space="$2" alignItems="center">
              <Feather name="home" size={14} color={rentalAppTheme.textLight} />
              <Text fontSize={14} color={rentalAppTheme.textLight}>
                {item.propertyType} • {totalRooms}
                {totalRooms === 1 ? " room" : " rooms"}
              </Text>
              <Text fontSize={14} color={rentalAppTheme.textLight}>
                {item.nearestUniversities[0]?.name} -{" "}
                {item.nearestUniversities[0]?.distance}
              </Text>
            </XStack>
          </XStack>


          {/* Row 5: Last Updated */}
          {formattedDate && (
            <XStack space="$2" alignItems="center">
              <Feather
                name="clock"
                size={12}
                color={rentalAppTheme.textLight}
              />
              <Text fontSize={12} color={rentalAppTheme.textLight}>
                Last updated: {formattedDate}
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
    borderRadius="$4"
    backgroundColor="white"
    padding="$2"
    shadowColor={rentalAppTheme.textDark}
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.1}
    shadowRadius={4}
  >
    <YStack space="$1" alignItems="center">
      <Feather name={icon} size={20} color={color} />
      <Text fontSize={18} fontWeight="bold" color={color}>
        {value}
      </Text>
      <Text fontSize={12} color={rentalAppTheme.textDark}>
        {title}
      </Text>
      {subtitle && (
        <Text fontSize={10} color={rentalAppTheme.textLight}>
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
    borderRadius="$4"
    backgroundColor={rentalAppTheme.primaryLight}
    padding="$2"
    shadowColor={rentalAppTheme.textDark}
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.1}
    shadowRadius={4}
    marginBottom="$4"
    alignSelf="center"
    width="100%"
  >
    <XStack
      alignItems="center"
      justifyContent="space-around"
      space="$5"
      paddingHorizontal="$6"
    >
      <Feather name="dollar-sign" size={24} color="white" />
      <Text fontSize={16} fontWeight="bold" color="white">
        Total Revenue:
      </Text>
      <Text fontSize={16} color="white">
        €{totalRevenue.toLocaleString()}/month
      </Text>
    </XStack>
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
              fontSize={24}
              fontWeight="bold"
              color={rentalAppTheme.textDark}
            >
              Dashboard
            </Text>
            <Text fontSize={14} color={rentalAppTheme.textLight}>
              Manage your properties
            </Text>
          </YStack>
          <XStack space="$2">
            <Button variant="outlined" padding="$2" borderWidth={0}>
              <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
            </Button>
          </XStack>
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

        {/* Total Revenue Card */}
        <RevenueCard totalRevenue={stats.totalRevenue} />

        {/* Properties Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$2"
          marginTop="$2"
        >
          <Text fontSize={18} fontWeight="600" color={rentalAppTheme.textDark}>
            Your Properties
          </Text>
        </XStack>

        {/* Check if there are properties */}
        {totalProperties === 0 ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Text fontSize={14} color={rentalAppTheme.textLight}>
              You have no properties added.
            </Text>
          </YStack>
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
          borderRadius="$4"
          marginTop="$4"
        >
          <Text
            color="white"
            fontSize={16}
            fontWeight="bold"
            textAlign="center"
          >
            List a New Property
          </Text>
        </Button>
      </YStack>
    </Theme>
  );
}
