import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ListPropertyScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [availability, setAvailability] = useState('');
  const [propertyType, setPropertyType] = useState<'room' | 'whole house'>('room');
  const [rooms, setRooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [distanceFromUniversity, setDistanceFromUniversity] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const propertyData = {
      name,
      description,
      image,
      availability,
      propertyType,
      rooms,
      bathrooms,
      distanceFromUniversity,
      price: Number(price),
    };

    console.log('Property Data:', propertyData);

    router.push('/(tabs)/landlord-dashboard');
  };

  const validateForm = () => {
    const isValid =
      name.trim() !== '' &&
      description.trim() !== '' &&
      image !== null &&
      availability.trim() !== '' &&
      (propertyType === 'room' || propertyType === 'whole house') &&
      rooms !== null &&
      bathrooms !== null &&
      distanceFromUniversity !== null &&
      price.trim() !== '';

    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [name, description, image, availability, propertyType, rooms, bathrooms, distanceFromUniversity, price]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>List a Property</Text>

        {/* Property Name */}
        <TextInput
          style={styles.input}
          placeholder="Property Name"
          value={name}
          onChangeText={setName}
        />

        {/* Property Description */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Image Picker */}
        <Text style={styles.label}>Property Image</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Pick Image</Text>
        </TouchableOpacity>

        {/* Display selected image */}
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        {/* Property Availability */}
        <TextInput
          style={styles.input}
          placeholder="Availability (e.g. Immediate, Next Month)"
          value={availability}
          onChangeText={setAvailability}
        />

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
        <TextInput
          style={styles.input}
          placeholder="Number of Rooms"
          value={rooms ? rooms.toString() : ''}
          onChangeText={(text) => setRooms(Number(text))}
          keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
        />

        {/* Number of Bathrooms */}
        <TextInput
          style={styles.input}
          placeholder="Number of Bathrooms"
          value={bathrooms ? bathrooms.toString() : ''}
          onChangeText={(text) => setBathrooms(Number(text))}
          keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
        />

        {/* Distance from University */}
        <TextInput
          style={styles.input}
          placeholder="Distance from University (in km)"
          value={distanceFromUniversity ? distanceFromUniversity.toString() : ''}
          onChangeText={(text) => setDistanceFromUniversity(Number(text))}
          keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
        />

        {/* Price */}
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
    </View>
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
    marginBottom: 16,
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
