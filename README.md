# 🌱 Flovey MVP

**Parent-Child Financial Education Mobile App**

An Expo + React Native app that helps children (6-14) learn money management, patience, and beginner investing through task-based rewards, savings goals, and interactive challenges. Parents maintain oversight through approvals, progress tracking, and monthly reports.

---

## ✨ Features (MVP)

### Child Experience
- **Task-to-Reward Flow** - Complete chores/tasks → earn coins → see rewards
- **Savings Goals** - Set targets, track progress with milestones, celebrate wins
- **Patience Challenges** - Hold coins for X days, earn bonuses for delayed gratification
- **Age-Appropriate UI** - Seedling (6-9): emojis + colors | Navigator (10-14): charts + data
- **Investment Simulator** (Navigator only) - Allocate coins to Safe/Growth/Fun funds, watch daily market sim

### Parent Experience
- **Account Linking** - Connect to child profiles, set permissions
- **Task Approval** - Review and approve child task completions
- **Dashboard** - See child activity, earnings, goals, challenges at a glance
- **Monthly Reports** - Comprehensive reports on earnings, goals hit, behavior insights
- **Safety Guardrails** - Spend limits, content filters, DND notifications, GDPR compliance

---

## 🏗️ Tech Stack

- **Framework:** React Native 0.76 + Expo 52
- **Language:** TypeScript
- **State:** Zustand
- **Storage:** Expo Secure Store (tokens), local storage (app state)
- **Build:** Expo EAS (cloud) or local Gradle
- **Platforms:** iOS + Android

---

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/mochadwi/gummy-apps.git
cd gummy-apps
npm install --legacy-peer-deps
```

### Development

Start Expo dev server:

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code for physical device

### Building

**See [BUILD_INSTRUCTIONS.md](docs/BUILD_INSTRUCTIONS.md) for detailed build steps.**

Quick start:

```bash
# Via EAS (recommended)
eas build --platform android --profile=preview

# Local build (requires Java 17 + Android SDK)
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleRelease
```

---

## 📁 Project Structure

```
flovey/
├── src/
│   ├── types/           # Domain models (User, Task, Goal, Challenge, Portfolio, etc.)
│   ├── stores/          # Zustand state stores (auth, task, goal, challenge, portfolio, etc.)
│   ├── services/        # Business logic (auth, task, goal, challenge, portfolio, etc.)
│   ├── hooks/           # React hooks (useAuth)
│   └── components/      # React Native components (NOT IMPLEMENTED - for next phase)
├── docs/
│   ├── UX_SPECIFICATION.md    # Detailed UX flows, age-specific design decisions
│   ├── BETA_CHECKLIST.md      # MVP validation checklist for pilot testing
│   └── BUILD_INSTRUCTIONS.md  # How to build APK/AAB
├── .github/workflows/
│   └── build-android.yml      # GitHub Actions CI/CD for APK/AAB builds
├── app.json               # Expo app configuration
├── eas.json               # EAS build profiles
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── App.tsx               # Root entry point (minimal placeholder)
```

---

## 🎯 MVP Scope

### ✅ Implemented (Closed Tickets)

1. **flovey-9af.1** - UX specification (Seedling & Navigator flows, onboarding, daily loops)
2. **flovey-9af.2** - Parent-child auth & role permissions
3. **flovey-9af.3** - Task-to-reward flow with parent approval
4. **flovey-9af.4** - Savings goals with milestone tracking
5. **flovey-9af.5** - Patience challenge engine (hold-to-earn bonuses)
6. **flovey-9af.6** - Investment simulator (Safe/Growth/Fun funds)
7. **flovey-9af.7** - Safety guardrails & privacy compliance
8. **flovey-9af.8** - Notifications & reminder scheduler
9. **flovey-9af.9** - Parent dashboard & monthly reports
10. **flovey-9af.10** - Analytics & beta pilot checklist

**Status:** 🟢 All 10 tasks closed, 4,500+ LOC, ready for UI implementation & E2E testing

### 📋 Not in MVP (Backlog)

- Real investment integration (MVP is simulation only)
- Sibling collaboration features
- School partnership integrations
- Web platform
- Multi-language support
- Push notification providers (Expo managed)
- Analytics backend (event collection only)

---

## 📚 Documentation

- **[UX_SPECIFICATION.md](docs/UX_SPECIFICATION.md)** - Complete UX flows, age cohorts, edge cases
- **[BETA_CHECKLIST.md](docs/BETA_CHECKLIST.md)** - Pilot testing checklist with success criteria
- **[BUILD_INSTRUCTIONS.md](docs/BUILD_INSTRUCTIONS.md)** - How to build APK, AAB, and publish to Play Store

---

## 🧪 Testing

### MVP Validation

See [BETA_CHECKLIST.md](docs/BETA_CHECKLIST.md) for:
- Onboarding validation
- Core engagement loop testing
- Safety & parental control verification
- Performance benchmarks
- UX quality assessment
- Feedback collection

### Unit Tests (Coming Next Phase)

```bash
npm test
```

### E2E Tests (Coming Next Phase)

```bash
npm run e2e
```

---

## 🔒 Security & Privacy

- ✅ Token storage in secure enclave (iOS Keychain, Android SecureStore)
- ✅ Parent-child relationship verification
- ✅ Activity logging & GDPR compliance
- ✅ No real financial transactions (simulation only)
- ✅ Age-appropriate data handling
- ✅ Parental oversight without surveillance

---

## 📊 Architecture Decisions

### Why Zustand + Local State?

- Lightweight, no boilerplate
- Suitable for MVP without backend complexity
- Easy to migrate to remote API later

### Why Expo?

- OTA updates without App Store submission
- Rapid iteration for MVP
- Easy to eject to bare React Native if needed

### Why Age Cohorts?

- Cognitive differences between 6-9 (concrete) vs 10-14 (formal) operations
- UI/UX adapts to developmental stage
- Engagement strategies differ significantly

---

## 🚦 Next Steps

1. **UI Component Implementation** - Build React Native screens for auth, tasks, goals, challenges, dashboard
2. **Integration Testing** - E2E tests for core flows
3. **Beta Pilot** - 2-3 weeks with 10-15 families per [BETA_CHECKLIST.md](docs/BETA_CHECKLIST.md)
4. **Feedback & Iteration** - Fix bugs, adjust UX based on family feedback
5. **Google Play Release** - Submit AAB to Play Store with metadata
6. **Backend API** - Replace local storage with real API
7. **Analytics** - Wire up event tracking to backend

---

## 📄 License

MIT

---

## 👥 Contributors

- **Product:** UX specification, feature planning
- **Backend/Domain:** Services, stores, business logic
- **Mobile:** React Native, Expo configuration, build pipeline

---

## 📞 Support

Issues & feature requests: [GitHub Issues](https://github.com/mochadwi/gummy-apps/issues)

---

**Built with ❤️ for families learning financial literacy together.**

🌱 *Plant a seed, grow a fortune* 🌱
