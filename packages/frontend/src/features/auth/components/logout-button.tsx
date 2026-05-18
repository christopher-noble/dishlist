import { IconSymbol } from '@/components/ui/icon-symbol';
import { Theme } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useLogoutAction } from '../hooks/use-logout-action';

const c = Theme.colors;

type LogoutButtonProps = {
  variant?: 'text' | 'pill';
  showIcon?: boolean;
  fullWidth?: boolean;
  prominent?: boolean;
  confirmBeforeLogout?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LogoutButton({
  variant = 'pill',
  showIcon = true,
  fullWidth = false,
  prominent = false,
  confirmBeforeLogout = false,
  style,
}: LogoutButtonProps) {
  const { requestLogout, isSubmitting } = useLogoutAction({ confirmBeforeLogout });

  const button = (
    <Pressable
      onPress={requestLogout}
      disabled={isSubmitting}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      style={({ pressed }) => [
        variant === 'pill' ? styles.pill : styles.base,
        prominent && variant === 'pill' && styles.pillProminent,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        style,
      ]}
    >
      {isSubmitting ? (
        <ActivityIndicator
          color={variant === 'pill' ? c.white : c.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {showIcon && variant === 'pill' ? (
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={20}
              color={c.white}
            />
          ) : null}
          <Text style={[styles.label, variant === 'pill' && styles.pillLabel]}>
            Log out
          </Text>
        </View>
      )}
    </Pressable>
  );

  if (fullWidth) {
    return <View style={styles.fullWidthWrapper}>{button}</View>;
  }

  return button;
}

const styles = StyleSheet.create({
  fullWidthWrapper: {
    width: '100%',
  },
  base: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  pill: {
    backgroundColor: c.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillProminent: {
    backgroundColor: c.accent,
    borderWidth: 2,
    borderColor: c.destructiveBorder,
    shadowColor: c.black,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.88,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    color: c.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  pillLabel: {
    color: c.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
