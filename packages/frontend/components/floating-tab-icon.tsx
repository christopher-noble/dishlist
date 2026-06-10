import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface FloatingTabIconProps {
  focused: boolean;
  activeColor: string;
  children: React.ReactNode;
}

export function FloatingTabIcon({ focused, activeColor, children }: FloatingTabIconProps) {
  return (
    <View style={[styles.wrap, focused && { backgroundColor: `${activeColor}18` }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { transition: 'background-color 0.2s ease' as const }
      : {}),
  },
});
