import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import {
  initConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  Product,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { useUserStore } from '@/store/user.store';
import { rentalAppTheme } from '../constants/Colors';
import axios from 'axios';
import { env } from '../../env';

const productIds = [
  'com.rentalapp.topup.small',
  'com.rentalapp.topup.medium',
  'com.rentalapp.topup.large',
];

export function TopUpIAP({ onSuccess }: { onSuccess: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const token = useUserStore((state) => state.token);
  const refreshUserData = useUserStore((state) => state.refreshUserData);

  useEffect(() => {
    const initIAP = async () => {
      try {
        if (Platform.OS === 'ios') {
          await initConnection();
          const products = await getProducts({ skus: productIds });
          setProducts(products);
        }
      } catch (err) {
        console.error('Failed to initialize IAP:', err);
        Alert.alert('Error', 'Failed to initialize in-app purchases');
      }
    };

    initIAP();

    // Set up purchase listeners
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      try {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          await handlePurchaseVerification(receipt);
          await finishTransaction({ purchase });
        }
      } catch (err) {
        console.error('Failed to process purchase:', err);
        Alert.alert('Error', 'Failed to process purchase');
      }
    });

    const purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Error', error.message);
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const handlePurchase = async (productId: string) => {
    try {
      setLoading(true);
      await requestPurchase({ sku: productId });
    } catch (err) {
      console.error('Purchase failed:', err);
      Alert.alert('Error', 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseVerification = async (receipt: string) => {
    try {
      await axios.post(
        `${env.API_URL}/iap/verify-receipt`,
        { receipt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await refreshUserData();
      onSuccess();
      Alert.alert('Success', 'Your balance has been updated!');
    } catch (err) {
      console.error('Receipt verification failed:', err);
      Alert.alert('Error', 'Failed to verify purchase');
    }
  };

  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <YStack space="$4">
      {products.map((product) => (
        <Card
          key={product.productId}
          bordered
          elevate
          padding="$4"
          borderRadius={16}
          backgroundColor="white"
          animation="bouncy"
          scale={0.97}
          hoverStyle={{ scale: 1 }}
          pressStyle={{ scale: 0.96 }}
          onPress={() => handlePurchase(product.productId)}
          disabled={loading}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text
                fontSize={18}
                fontWeight="600"
                color={rentalAppTheme.textDark}
              >
                {product.title}
              </Text>
              <Text
                fontSize={14}
                color={rentalAppTheme.textLight}
              >
                {product.description}
              </Text>
            </YStack>
            <Text
              fontSize={18}
              fontWeight="bold"
              color={rentalAppTheme.primaryDark}
            >
              {product.localizedPrice}
            </Text>
          </XStack>
        </Card>
      ))}
    </YStack>
  );
} 