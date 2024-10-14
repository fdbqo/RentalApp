import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ListPropertyScreen() {
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<'room' | 'whole house'>('room');
  const [numberOfRooms, setNumberOfRooms] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Function to pick images
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  const handleSubmit = () => {
    const propertyData = {
      address,
      description,
      images,
      propertyType,
      numberOfRooms: propertyType === 'whole house' ? numberOfRooms : 1,
      price,
    };

    console.log('Property Data:', propertyData);

    router.push('/(tabs)/landlord-dashboard');
  };

  // Validation function to check if all fields are filled in
  const validateForm = () => {
    const isValid =
      address.trim() !== '' &&
      description.trim() !== '' &&
      images.length > 0 &&
      (propertyType === 'room' || (propertyType === 'whole house' && numberOfRooms !== null)) &&
      price.trim() !== '';

    setIsFormValid(isValid);
  };

  // Trigger validation whenever form inputs change
  useEffect(() => {
    validateForm();
  }, [address, description, images, propertyType, numberOfRooms, price]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>List a Property</Text>

        <TextInput
          style={styles.input}
          placeholder="Property Address"
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Image Picker */}
        <Text style={styles.label}>Images</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
          <Text style={styles.imageButtonText}>Pick Images</Text>
        </TouchableOpacity>

        {/* Display selected images */}
        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((imageUri, index) => (
              <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
            ))}
          </ScrollView>
        )}

        {/* Property Type */}
        <Text style={styles.label}>Property Type</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.typeButton, propertyType === 'room' && styles.selectedButton]}
            onPress={() => setPropertyType('room')}
          >
            <Text style={[styles.buttonText, propertyType === 'room' && styles.selectedText]}>Room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, propertyType === 'whole house' && styles.selectedButton]}
            onPress={() => setPropertyType('whole house')}
          >
            <Text style={[styles.buttonText, propertyType === 'whole house' && styles.selectedText]}>Whole House</Text>
          </TouchableOpacity>
        </View>

        {/* Number of Rooms */}
        {propertyType === 'whole house' && (
          <TextInput
            style={styles.input}
            placeholder="Number of Rooms"
            value={numberOfRooms ? numberOfRooms.toString() : ''}
            onChangeText={(text) => setNumberOfRooms(Number(text))}
            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !isFormValid && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
