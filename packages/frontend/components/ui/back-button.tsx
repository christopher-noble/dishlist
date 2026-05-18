import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

type BackButtonProps = {
  onPress?: () => void;
};

export function BackButton({ onPress }: BackButtonProps) {
  const handlePress = onPress ?? (() => router.back());

  return (
    <Pressable
      onPress={handlePress}
      style={styles.backButton}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <IconSymbol name="chevron.left" size={24} color="#000" weight="semibold" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton:
    Platform.OS === 'web'
      ? ({
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        } as object)
      : {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
});
