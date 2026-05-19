import { Theme } from '@/constants/theme';
import React, { forwardRef } from 'react';

const c = Theme.colors;
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

type AuthTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: TextInputProps['keyboardType'];
  /** Use for email/name fields only. Password fields set autofill props internally. */
  textContentType?: TextInputProps['textContentType'];
  /** `current-password` for sign-in, `new-password` for sign-up. */
  autoComplete?: TextInputProps['autoComplete'];
  returnKeyType?: TextInputProps['returnKeyType'];
  blurOnSubmit?: boolean;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  enablesReturnKeyAutomatically?: boolean;
};

function isEmailField(
  keyboardType: TextInputProps['keyboardType'],
  textContentType: TextInputProps['textContentType'],
  autoComplete: TextInputProps['autoComplete'] | undefined,
): boolean {
  return (
    keyboardType === 'email-address' ||
    textContentType === 'emailAddress' ||
    textContentType === 'username' ||
    autoComplete === 'email' ||
    autoComplete === 'username'
  );
}

export const AuthTextField = forwardRef<TextInput, AuthTextFieldProps>(
  function AuthTextField(
    {
      label,
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      keyboardType = 'default',
      textContentType = 'none',
      autoComplete,
      returnKeyType,
      blurOnSubmit,
      onSubmitEditing,
      enablesReturnKeyAutomatically = true,
    },
    ref,
  ) {
    const emailField = isEmailField(keyboardType, textContentType, autoComplete);

    const resolvedKeyboardType: TextInputProps['keyboardType'] = secureTextEntry
      ? Platform.OS === 'ios'
        ? 'ascii-capable'
        : 'default'
      : emailField
        ? 'default'
        : keyboardType;

    const resolvedTextContentType: TextInputProps['textContentType'] =
      secureTextEntry
        ? autoComplete === 'new-password'
          ? 'newPassword'
          : 'password'
        : emailField
          ? 'none'
          : textContentType;

    const handleKeyPress: TextInputProps['onKeyPress'] = (event) => {
      if (
        Platform.OS === 'web' &&
        event.nativeEvent.key === 'Enter' &&
        onSubmitEditing
      ) {
        onSubmitEditing();
      }
    };

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          keyboardType={resolvedKeyboardType}
          textContentType={resolvedTextContentType}
          autoComplete={autoComplete}
          autoCorrect={false}
          spellCheck={false}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          onSubmitEditing={onSubmitEditing}
          onKeyPress={handleKeyPress}
          enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
          contextMenuHidden={false}
          importantForAutofill="auto"
          style={styles.input}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: c.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: c.borderNeutral,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: c.text,
    backgroundColor: c.inputBackground,
  },
});
