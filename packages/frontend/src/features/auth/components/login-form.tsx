import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Theme } from '@/constants/theme';
import { ApiError } from '@/src/shared/api/client';

const c = Theme.colors;

import { APP_HOME_HREF } from '../constants/routes';
import { useAuth } from '../context/auth-context';
import { AuthScreenLayout } from './auth-screen-layout';
import { AuthTextField } from './auth-text-field';

export function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signIn({ email: email.trim(), password });
      router.replace(APP_HOME_HREF);
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : 'Unable to sign in. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, isSubmitting, password, signIn]);

  return (
    <AuthScreenLayout
      title="Welcome back"
      subtitle="Sign in to manage your recipes."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New here? </Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.link}>Create an account</Text>
          </Pressable>
        </View>
      }
    >
      <AuthTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoComplete="email"
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <AuthTextField
        ref={passwordRef}
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
        autoComplete="current-password"
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={handleSubmit}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={c.white} />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </Pressable>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: c.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: c.white,
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: c.destructive,
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: c.textMuted,
  },
  link: {
    color: c.primary,
    fontWeight: '600',
  },
});
