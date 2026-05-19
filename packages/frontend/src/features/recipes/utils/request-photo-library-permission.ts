import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

export type PhotoLibraryAccessResult =
  | { granted: true }
  | { granted: false; reason: 'denied' | 'blocked' };

function showPhotoAccessRequiredAlert(): Promise<void> {
  return new Promise((resolve) => {
    Alert.alert(
      'Photo access required',
      'Dishlist needs access to your photos so you can add a recipe image. You can enable this in Settings.',
      [
        { text: 'Not now', style: 'cancel', onPress: () => resolve() },
        {
          text: 'Open Settings',
          onPress: () => {
            void Linking.openSettings();
            resolve();
          },
        },
      ],
    );
  });
}

export async function requestPhotoLibraryAccess(): Promise<PhotoLibraryAccessResult> {
  if (Platform.OS === 'web') {
    return { granted: true };
  }

  const current = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (current.granted) {
    return { granted: true };
  }

  const canRequestNativePermission =
    current.status === ImagePicker.PermissionStatus.UNDETERMINED ||
    (current.status === ImagePicker.PermissionStatus.DENIED && current.canAskAgain);

  if (canRequestNativePermission) {
    const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return requested.granted ? { granted: true } : { granted: false, reason: 'denied' };
  }

  await showPhotoAccessRequiredAlert();
  return { granted: false, reason: 'blocked' };
}
