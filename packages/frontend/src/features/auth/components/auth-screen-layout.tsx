import { BackButton } from '@/components/ui/back-button';
import { Theme } from '@/constants/theme';

const c = Theme.colors;
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScreenLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
};

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
  onBack,
}: AuthScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {onBack ? (
        <View style={styles.navBar}>
          <BackButton onPress={onBack} />
        </View>
      ) : null}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.card}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: c.background,
  },
  navBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: Platform.OS === 'web' ? 8 : 0,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 8,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: c.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: c.textMuted,
    lineHeight: 22,
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: c.borderNeutral,
    shadowColor: c.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
