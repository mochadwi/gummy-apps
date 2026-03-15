# Flovey MVP - Build Instructions

## Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli eas-cli`
- Android SDK (for local builds) or use EAS (cloud builds)
- Java 17+ (for local Gradle builds)

## Option 1: Build APK/AAB via EAS (Recommended)

### Setup

```bash
cd flovey
npm install --legacy-peer-deps
eas login  # Login with your Expo account
eas init   # Initialize EAS project
```

### Build Preview APK

```bash
eas build --platform android --profile=preview
```

This creates a debug APK for testing.

### Build Production AAB

```bash
eas build --platform android --profile=production
```

This creates an Android App Bundle for Google Play Store submission.

**Output:** Builds are downloaded automatically or available in your EAS dashboard.

---

## Option 2: Local Build (Requires Java 17 + Android SDK)

### Setup

```bash
cd flovey
npm install --legacy-peer-deps
npx expo prebuild --platform android --clean
```

### Build APK

```bash
cd android
./gradlew assembleRelease
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

### Build AAB

```bash
cd android
./gradlew bundleRelease
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## Option 3: Expo Managed Development Build

### Build Development Client

```bash
eas build --platform android --profile=preview --dev-client
```

Then run:

```bash
eas build:run --platform android
```

This creates a customizable development app for testing with live reload.

---

## Testing the APK

### Installation

```bash
adb install path/to/app-release.apk
```

Or drag and drop into Android emulator.

### Running

App appears as "Flovey" in your app drawer. Launch and verify:
- ✅ Splashscreen shows "🌱 Flovey"
- ✅ Home screen renders "Parent-Child Money Learning App MVP"
- ✅ App is responsive

---

## Production Release Checklist

Before submitting to Google Play:

- [ ] Bump version in `app.json` (e.g., `"version": "0.1.0"`)
- [ ] Update `versionCode` in `app.json` (increment by 1 each release)
- [ ] Test APK on multiple Android devices (API 26+)
- [ ] Create release notes
- [ ] Generate signed AAB with key from Google Play console
- [ ] Upload to Google Play internal testing → closed testing → production

### Update Version

```json
{
  "expo": {
    "version": "0.1.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

---

## Troubleshooting

### "Java 17 not found"

Install Java 17:

```bash
brew install openjdk@17
export JAVA_HOME=/usr/libexec/java_home -v 17
```

### "Gradle daemon crashed"

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### "Module not found"

```bash
npm install --legacy-peer-deps
cd android && ./gradlew build
```

### "Cannot find SDK"

Ensure Android SDK is installed via Android Studio > SDK Manager, or set:

```bash
export ANDROID_SDK_ROOT=~/Android/sdk
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build APK

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install --legacy-peer-deps
      - run: npx expo prebuild --platform android --clean
      - run: cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v3
        with:
          name: apk
          path: android/app/build/outputs/apk/release/app-release.apk
```

---

## App Submission to Google Play Store

1. **Create Google Play Console account:** https://play.google.com/console
2. **Upload AAB:** Release > Production > Upload AAB (requires signing)
3. **Fill store listing:** Description, screenshots, privacy policy
4. **Content rating:** Complete Google Play content rating questionnaire
5. **Release:** Create release and roll out to production

### Signing APK/AAB

Generate keystore:

```bash
keytool -genkey -v -keystore ~/flovey-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias flovey-key
```

Then configure `android/app/build.gradle`:

```gradle
signingConfigs {
  release {
    storeFile file('path/to/flovey-release-key.keystore')
    storePassword System.getenv("KEYSTORE_PASSWORD")
    keyAlias System.getenv("KEY_ALIAS")
    keyPassword System.getenv("KEY_PASSWORD")
  }
}
buildTypes {
  release {
    signingConfig signingConfigs.release
  }
}
```

---

## Next Steps

After successful APK build:

1. ✅ Test on Android 6.0+ (API 23+)
2. ✅ Verify all core flows (auth, tasks, goals, challenges)
3. ✅ Check battery, memory, performance
4. ✅ Gather beta feedback from families
5. ✅ Iterate and rebuild

See `docs/BETA_CHECKLIST.md` for MVP validation steps.
