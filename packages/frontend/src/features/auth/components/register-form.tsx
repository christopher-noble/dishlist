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

import { APP_HOME_HREF, LOGIN_HREF } from '../constants/routes';
import { useAuth } from '../context/auth-context';
import { AuthScreenLayout } from './auth-screen-layout';
import { AuthTextField } from './auth-text-field';

export function RegisterForm() {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
      router.replace(APP_HOME_HREF);
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : 'Unable to create your account. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, firstName, isSubmitting, lastName, password, signUp]);

  return (
    <AuthScreenLayout
      title="Create account"
      subtitle="Register to start building your dish list."
      onBack={() => router.replace(LOGIN_HREF)}
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace(LOGIN_HREF)}>
            <Text style={styles.link}>Sign in</Text>
          </Pressable>
        </View>
      }
    >
      <AuthTextField
        label="First name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Alex"
        autoComplete="given-name"
        textContentType="givenName"
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => lastNameRef.current?.focus()}
      />
      <AuthTextField
        ref={lastNameRef}
        label="Last name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Rivera"
        autoComplete="family-name"
        textContentType="familyName"
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <AuthTextField
        ref={emailRef}
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
        placeholder="At least 8 characters"
        secureTextEntry
        autoComplete="new-password"
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
          <Text style={styles.buttonText}>Create account</Text>
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
