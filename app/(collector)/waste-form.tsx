import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Picker } from '@/components/ui/Picker';
import { Card } from '@/components/ui/Card';
import { Colors, spacing } from '@/constants/Colors';
import { WASTE_TYPES } from '@/constants/WasteTypes';
import { Camera, Upload } from 'lucide-react-native';

export default function WasteFormScreen() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString(),
    wasteType: '',
    weight: '',
    colonyName: '',
    imageUri: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const wasteTypeOptions = WASTE_TYPES.map(type => ({
    label: type,
    value: type,
  }));

  const colonyOptions = [
    { label: 'Green Valley Colony', value: 'Green Valley Colony' },
    { label: 'Sunrise Apartments', value: 'Sunrise Apartments' },
    { label: 'Palm Grove Society', value: 'Palm Grove Society' },
    { label: 'Rose Garden Complex', value: 'Rose Garden Complex' },
    { label: 'Metro Heights', value: 'Metro Heights' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.wasteType) {
      newErrors.wasteType = 'Waste type is required';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!formData.colonyName) {
      newErrors.colonyName = 'Colony name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('waste_submissions').insert({
        collector_id: user?.id,
        date_time: formData.dateTime,
        waste_type: formData.wasteType,
        weight: Number(formData.weight),
        colony_name: formData.colonyName,
        image_url: formData.imageUri,
      });

      if (error) throw error;

      Alert.alert('Success', 'Waste form submitted successfully!');
      
      // Reset form
      setFormData({
        dateTime: new Date().toISOString(),
        wasteType: '',
        weight: '',
        colonyName: '',
        imageUri: '',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Submit Waste Collection</Text>
        <Text style={styles.subtitle}>Fill out the waste collection form</Text>
      </View>

      <Card>
        <Text style={styles.formTitle}>Waste Collection Details</Text>
        
        <Input
          label="Date & Time"
          value={new Date(formData.dateTime).toLocaleString()}
          onChangeText={() => {}}
          placeholder="Current date and time"
        />

        <Picker
          label="Waste Type"
          value={formData.wasteType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, wasteType: value }))}
          options={wasteTypeOptions}
          placeholder="Select waste type"
          error={errors.wasteType}
        />

        <Input
          label="Weight (kg)"
          value={formData.weight}
          onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
          placeholder="Enter weight in kg"
          keyboardType="numeric"
          error={errors.weight}
        />

        <Picker
          label="Colony Name"
          value={formData.colonyName}
          onValueChange={(value) => setFormData(prev => ({ ...prev, colonyName: value }))}
          options={colonyOptions}
          placeholder="Select colony"
          error={errors.colonyName}
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>Waste Image</Text>
          
          {formData.imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: formData.imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
                <Camera color={Colors.primary} size={24} />
                <Text style={styles.imagePickerText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Upload color={Colors.secondary} size={24} />
                <Text style={styles.imagePickerText}>Upload Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Button
          title="Submit Waste Form"
          onPress={handleSubmit}
          loading={loading}
          size="lg"
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray600,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: spacing.lg,
  },
  imageSection: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: spacing.sm,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  changeImageButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  changeImageText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imagePickerButton: {
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: Colors.gray300,
    borderRadius: 8,
    borderStyle: 'dashed',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  imagePickerText: {
    fontSize: 14,
    color: Colors.gray600,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
});