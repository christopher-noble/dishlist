import { LogoutButton } from '@/src/features/auth/components/logout-button';
import { useAuth } from '@/src/features/auth/context/auth-context';
import { useRequireAuth } from '@/src/features/auth/hooks/use-require-auth';
import { useRecipeStats } from '@/src/features/recipes';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const MAX_WIDTH = 480;
const c = Theme.colors;

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  if (first && last) {
    return `${first}${last}`.toUpperCase();
  }
  return (first || last || '?').toUpperCase();
}

function StatCard({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number;
  onPress?: () => void;
}) {
  const content = (
    <>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.statCard}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.statCard}>{content}</View>;
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: 'person.fill' | 'envelope.fill';
  label: string;
  value: string;
}) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.fieldIconWrap}>
        <IconSymbol name={icon} size={18} color={c.primaryDark} />
      </View>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const { isLoading } = useRequireAuth();
  const { user } = useAuth();
  const { data: statsData, loading: statsLoading } = useRecipeStats();
  const insets = useSafeAreaInsets();
  const stats = statsData?.recipeStats;

  const displayName = useMemo(() => {
    if (!user) {
      return '';
    }
    return `${user.firstName} ${user.lastName}`.trim() || user.primaryEmail;
  }, [user]);

  const initials = useMemo(() => {
    if (!user) {
      return '?';
    }
    return getInitials(user.firstName, user.lastName);
  }, [user]);

  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scrollInner}>
          <LinearGradient
            colors={[...c.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.heroInner}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.heroTitle}>Profile</Text>
              <Text style={styles.heroSubtitle} numberOfLines={1}>
                {displayName}
              </Text>
            </Animated.View>
          </LinearGradient>

          <View style={styles.statsRow}>
            <StatCard
              label="Active recipes"
              value={stats?.activeRecipeCount ?? 0}
            />
            <StatCard
              label="Removed (30 days)"
              value={stats?.archivedLast30DaysCount ?? 0}
              onPress={() => router.push('/recipe/archived')}
            />
          </View>
          {statsLoading ? (
            <ActivityIndicator size="small" color={c.primary} style={styles.statsLoading} />
          ) : null}

          <View style={styles.card}>
            <ProfileField icon="person.fill" label="Name" value={displayName} />
            <View style={styles.divider} />
            <ProfileField icon="envelope.fill" label="Email" value={user.primaryEmail} />
          </View>

          <View style={styles.signOutPanel}>
            <LogoutButton
              variant="pill"
              fullWidth
              prominent
              showIcon
              confirmBeforeLogout
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: c.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollInner: {
    maxWidth: MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  hero: {
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroInner: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 28 : 12,
    paddingBottom: 8,
    gap: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: c.white,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: c.white,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.88)',
    maxWidth: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: -12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: c.surface,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.borderNeutral,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: c.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: c.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  statsLoading: {
    marginBottom: 12,
  },
  card: {
    marginTop: 0,
    marginHorizontal: 20,
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: c.borderNeutral,
    shadowColor: c.black,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  fieldIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: c.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContent: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: c.textWarm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldValue: {
    fontSize: 17,
    fontWeight: '600',
    color: c.text,
  },
  divider: {
    height: 1,
    backgroundColor: c.primaryLight,
    marginVertical: 16,
  },
  signOutPanel: {
    marginTop: 24,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: c.stoneDark,
    borderWidth: 1,
    borderColor: c.stoneBorder,
  },
});
