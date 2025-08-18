import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, spacing } from '@/constants/Colors';

export default function CollectorAuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // Create user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_profiles').insert({
            user_id: user.id,
            email: user.email,
            role: 'garbage_collector',
          });
        }
      }
      router.replace('/(collector)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Garbage Collector</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          error={errors.email}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />

        {!isLogin && (
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
            error={errors.confirmPassword}
          />
        )}

        <Button
          title={isLogin ? 'Sign In' : 'Sign Up'}
          onPress={handleAuth}
          loading={loading}
          size="lg"
        />

        <Button
          title={isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          onPress={() => setIsLogin(!isLogin)}
          variant="outline"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray600,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
});