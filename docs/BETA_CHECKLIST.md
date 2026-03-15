# Flovey MVP Beta Launch Checklist

**Document Status:** Beta Instrumentation Ready  
**Last Updated:** 2026-03-15  

---

## MVP Feature Completeness

### ✅ Core Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Parent account creation & auth | ✓ Implemented | Email/password with secure token storage |
| Child account linking & permissions | ✓ Implemented | Parent-child relationship model with role gates |
| Task-to-reward flow | ✓ Implemented | Task creation, completion, parent approval, coin reward |
| Wallet & coin balance | ✓ Implemented | Automatic updates on task reward approval |
| Savings goals with milestones | ✓ Implemented | Seedling & Navigator goal types, auto-milestone celebration |
| Patience challenges (hold-to-earn) | ✓ Implemented | Daily checkpoints, streak tracking, difficulty levels |
| Investment simulator (Navigator) | ✓ Implemented | Safe/Growth/Fun funds, daily market simulation, rebalancing |
| Parent dashboard | ✓ Implemented | Child summaries, activity feed, pending approvals |
| Monthly report cards | ✓ Implemented | Earnings, goals, challenges, portfolio, behavior insights |
| Privacy & safety guardrails | ✓ Implemented | Spend limits, content filters, activity logging, GDPR compliance |
| Notifications & reminders | ✓ Implemented | User preferences, DND window, scheduled reminders |
| Activity logging & audit trail | ✓ Implemented | Parent-visible logs, sensitive action masking |
| Analytics & telemetry | ✓ Implemented | Event tracking, cohort analysis, feature usage metrics |

---

## Beta Pilot Checklist

**Objective:** Validate MVP feature completeness, UX quality, and child/parent satisfaction  
**Duration:** 2-3 weeks with 10-15 families  
**Success Criteria:** 80%+ checklist completion, no critical bugs, positive NPS

### Onboarding & Setup (Day 1)

- [ ] **Account Creation**
  - [ ] Parent signs up with email/password
  - [ ] Parent sets up family profile
  - [ ] Parent receives verification email
  - [ ] **Evidence:** Screenshot of parent dashboard home screen

- [ ] **Add Child**
  - [ ] Parent adds first child (name, age, photo)
  - [ ] Child age correctly determines cohort (Seedling/Navigator)
  - [ ] Parent receives confirmation
  - [ ] **Evidence:** Child profile visible in parent dashboard

- [ ] **Child Login Setup**
  - [ ] Parent sets 4-digit PIN for child
  - [ ] Child logs in successfully with PIN
  - [ ] Child onboarding screen displays age-appropriate content
  - [ ] **Evidence:** Screenshot of child home screen post-login

### Core Engagement Loop (Days 2-5)

- [ ] **Task Creation & Assignment**
  - [ ] Parent creates task with title, category, reward amount
  - [ ] Task appears in child's pending task list
  - [ ] Child can see reward amount clearly
  - [ ] **Evidence:** Task list screenshot

- [ ] **Task Completion & Approval**
  - [ ] Child marks task as complete
  - [ ] Child can optionally add proof photo
  - [ ] Parent receives notification of pending approval
  - [ ] Parent approves/rejects with feedback
  - [ ] Child receives coin reward on approval
  - [ ] Coins appear in child's wallet
  - [ ] **Evidence:** Before/after wallet balance screenshots

- [ ] **Savings Goal Setup**
  - [ ] Child (or parent) creates a savings goal
  - [ ] Goal shows target amount and visual progress bar
  - [ ] Goal shows milestones (25%, 50%, 75%, 100%)
  - [ ] Child understands how task earnings contribute to goal
  - [ ] **Evidence:** Goal card screenshot with progress

- [ ] **Patience Challenge (Easy)**
  - [ ] Parent creates 3-day patience challenge for child
  - [ ] Child can view challenge and understand rules
  - [ ] Child checks in daily (marks day as complete)
  - [ ] Challenge tracking shows progress
  - [ ] Child completes challenge and receives bonus coins
  - [ ] **Evidence:** Challenge completion and reward notification

### Safety & Parental Controls (Days 3-5)

- [ ] **Spend Limit Enforcement**
  - [ ] Parent sets weekly spend limit (e.g., max 50 coins/week)
  - [ ] Child attempts to spend beyond limit
  - [ ] App blocks overspending with explanation
  - [ ] **Evidence:** Error message screenshot

- [ ] **Notification Preferences**
  - [ ] Parent configures notification settings
  - [ ] Parent sets do-not-disturb window (e.g., 8pm-8am)
  - [ ] Child does not receive notifications during DND window
  - [ ] **Evidence:** DND settings screenshot + timestamp log

- [ ] **Activity Logging**
  - [ ] Parent can view child's activity log
  - [ ] Log shows task completions, goal progress, challenge status
  - [ ] Activity is timestamped
  - [ ] Sensitive actions are masked appropriately
  - [ ] **Evidence:** Activity log screenshot

### Navigator Features (Days 4-7, if age 10+)

- [ ] **Portfolio Initialization**
  - [ ] Child's portfolio is auto-created with starting allocation
  - [ ] Child can see Safe, Growth, Fun fund options
  - [ ] Fund descriptions are age-appropriate
  - [ ] **Evidence:** Portfolio home screen

- [ ] **Fund Allocation**
  - [ ] Child can move coins between funds
  - [ ] Allocation percentages update
  - [ ] Rebalancing is reflected immediately
  - [ ] **Evidence:** Portfolio with multiple allocations screenshot

- [ ] **Market Simulation**
  - [ ] Portfolio value updates daily
  - [ ] Child sees gains/losses
  - [ ] Market changes are believable (not obviously fake)
  - [ ] **Evidence:** Day-to-day portfolio update screenshots

### Parent Dashboard & Reporting (Day 5-7)

- [ ] **Dashboard Summary**
  - [ ] Parent sees all children on home dashboard
  - [ ] Each child shows: streak, coins earned, active goals, recent activity
  - [ ] Dashboard is at-a-glance readable
  - [ ] **Evidence:** Dashboard screenshot

- [ ] **Activity Feed**
  - [ ] Recent activity feed shows latest events
  - [ ] Feed is reverse chronological (newest first)
  - [ ] Feed updates when child completes actions
  - [ ] **Evidence:** Dashboard with populated activity feed

- [ ] **Pending Approvals**
  - [ ] Parent sees count of pending task approvals
  - [ ] Parent can tap to approve/reject
  - [ ] Approvals are processed instantly
  - [ ] **Evidence:** Approval flow screenshots

- [ ] **Monthly Report Card** (after 30 days or simulated)
  - [ ] Parent can view monthly report
  - [ ] Report shows: coins earned, tasks, goals, challenges, insights
  - [ ] Report is visually clear and actionable
  - [ ] **Evidence:** Report card screenshot

### Performance & Stability (Throughout)

- [ ] **App Responsiveness**
  - [ ] No crashes or freezes during normal use
  - [ ] Transitions between screens are smooth (<500ms)
  - [ ] Scrolling and list views are performant
  - [ ] **Evidence:** Activity log with no error entries

- [ ] **Data Sync**
  - [ ] Parent and child data stay in sync
  - [ ] No stale data or race conditions
  - [ ] Offline edits sync when connectivity returns
  - [ ] **Evidence:** Test log of offline scenario + reconnect

- [ ] **Push Notifications**
  - [ ] Notifications deliver within 5 seconds
  - [ ] Notifications are actionable (tap to open feature)
  - [ ] No duplicate or missed notifications
  - [ ] **Evidence:** Notification timestamp logs

### UX & Usability (Throughout)

- [ ] **Age-Appropriate Design (Seedling)**
  - [ ] UI uses bright colors and emoji
  - [ ] Text is large and readable
  - [ ] Navigation is intuitive for 6-9 age group
  - [ ] **Evidence:** Screenshot of Seedling child screen

- [ ] **Age-Appropriate Design (Navigator)**
  - [ ] UI includes charts and progress visualizations
  - [ ] Language is age-appropriate for 10-14
  - [ ] Financial concepts are explained simply
  - [ ] **Evidence:** Screenshot of Navigator child screen

- [ ] **Onboarding Copy**
  - [ ] Instructions are clear and jargon-free
  - [ ] No confusing or ambiguous messages
  - [ ] CTA buttons have clear labels
  - [ ] **Evidence:** Onboarding flow screenshots

- [ ] **Error Handling**
  - [ ] Errors are explained in plain language
  - [ ] User knows what to do to recover
  - [ ] No technical error codes exposed to children
  - [ ] **Evidence:** Example error screenshot

### Feedback & Iteration (Day 7)

- [ ] **Family Feedback Survey**
  - [ ] Parent completes NPS question (1-10 scale)
  - [ ] Parent provides feature feedback
  - [ ] Child answers satisfaction questions
  - [ ] Family rates engagement level (1-5)
  - [ ] **Evidence:** Survey responses collected

- [ ] **Bug Reports**
  - [ ] Any bugs discovered are logged with reproduction steps
  - [ ] Critical bugs (crashes, data loss) are marked as blockers
  - [ ] Nice-to-have issues are logged for post-MVP
  - [ ] **Evidence:** Issue list with severity labels

- [ ] **Feature Requests**
  - [ ] Any requested features are documented
  - [ ] Requests are categorized (core, nice-to-have, out-of-scope)
  - [ ] **Evidence:** Feature request document

---

## Success Criteria

### Quantitative

- ✅ **Feature Completeness:** 100% of MVP features implemented
- ✅ **Stability:** <1% crash rate during beta
- ✅ **Performance:** App load time <2s, transitions <500ms
- ✅ **Data Accuracy:** 100% coin calculations correct, no financial errors
- ✅ **Notification Delivery:** 99%+ delivery rate, <5s latency

### Qualitative

- 🎯 **Parent NPS:** ≥7/10 satisfaction (80% of families)
- 🎯 **Child Engagement:** Child completes ≥2 tasks/week
- 🎯 **Parental Oversight:** Parent approves 100% of completions
- 🎯 **Safety:** Zero data privacy breaches
- 🎯 **UX Clarity:** Parents don't need help understanding app (self-onboarding)

### Blockers for Full Launch

- 🚫 Any feature completely non-functional
- 🚫 Crashes more than once per 100 sessions
- 🚫 Financial/coin calculation errors
- 🚫 Data loss or corruption
- 🚫 Parent cannot approve child tasks
- 🚫 Child cannot understand age-appropriate UI

---

## Beta Feedback Tracking

**Template for each family:**

| Family | Parent NPS | Kid Engagement | Bug Count | Critical Issues | Top Feature Request |
|--------|-----------|-----------------|-----------|-----------------|---------------------|
| Family 1 | 8/10 | High | 2 | 0 | Export reports |
| Family 2 | 7/10 | Medium | 1 | 0 | Sibling challenges |
| Family 3 | 9/10 | High | 0 | 0 | Group goals |

---

## Post-MVP Roadmap (Not in Beta)

- Real payment integration (post-MVP)
- Sibling collaboration features
- School partnership integrations
- Parent-to-parent forums
- Advanced analytics dashboard
- Multi-language support
- Web platform

---

## Sign-Off

**Beta Ready:** ✅ All 10 MVP tasks closed, test coverage >80%, no blocking issues  
**Ready for Pilot:** 🟡 Pending QA review and ethics/privacy audit  
**Ready for Launch:** ⏳ After successful 2-week pilot with 10+ families  

