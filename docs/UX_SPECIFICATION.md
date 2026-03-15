# Flovey MVP - UX & Learning Journey Specification

## Executive Summary

Flovey is a parent-child financial education mobile app targeting two age cohorts (6-9, 10-14) with mission-driven engagement loops. Children learn money management through task-to-reward flows, savings goals, and patience challenges. Parents maintain oversight through a dashboard, reminders, and progress reporting.

---

## Platform & Architecture

**Target Platform:** iOS + Android (React Native + Expo)
**Offline Support:** Core flows with eventual sync
**Minimum Touch Targets:** 48px (thumb-zone optimized)
**Navigation:** Tab-based (child) + Stack (parent)

---

## Age Cohort Strategy: 6-9 vs 10-14

### Age 6-9 ("Seedling" Cohort)
- **Cognitive:** Concrete operations, instant gratification bias, early number sense
- **Engagement:** Bright colors, emoji, celebration loops, daily streaks
- **Learning Focus:** Cause-effect (task→reward), object permanence (savings), patience in small doses (1-7 day challenges)
- **Vocabulary:** "Coins," "Treasure," "Magic Plant," "Helpers"
- **Parent Role:** High oversight (all actions require approval or monitoring)

### Age 10-14 ("Navigator" Cohort)
- **Cognitive:** Formal operations emerging, future planning, peer awareness
- **Engagement:** Progress milestones, peer achievements, strategic planning UI
- **Learning Focus:** Time-value, opportunity cost, compound growth simulation
- **Vocabulary:** "Balance," "Portfolio," "Dividends," "Investment"
- **Parent Role:** Guardrails + autonomy (approve goal categories, monitor summaries)

---

## Onboarding Journey

### Phase 1: Family Account Setup (Parent-Led, ~5 minutes)

**Screen Sequence:**

1. **Welcome Screen**
   - Parent role: Create account
   - Biometric or PIN setup
   - Visual: Single parent illustration (diverse representation)

2. **Child Registration**
   - Parent adds 1+ children (age, name, photo)
   - Age determines cohort + feature set
   - Confirm parental custody/relationship

3. **Quick Setup Checklist**
   - Set weekly reminder preferences
   - Set financial goal template (savings bucket, investment simulation)
   - Confirm first task category

4. **Confirm Ready State**
   - Parent Dashboard preview
   - Child "Daily Loop" preview
   - Share access option (co-parent)

### Phase 2: Child Onboarding (Child-Led, ~3 minutes, post-parent setup)

**Seedling (6-9):**
1. "Welcome to Your Treasure Journey!"
2. Mascot intro (animated character)
3. Collect your first coins (tap-to-reward demo)
4. Set up first savings goal (picture-based if age <8)

**Navigator (10-14):**
1. "Let's Build Your Fortune"
2. Quick portfolio overview (3 simple funds: Safe, Growth, Fun)
3. Complete first task to earn coins
4. Check portfolio simulator

---

## Daily Child Loop

### Seedling (6-9) - Momentum Focus

```
┌─────────────────────────────────────────┐
│  YOUR TREASURE JOURNEY                  │
├─────────────────────────────────────────┤
│  🔥 3-Day Streak!                       │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ YOUR TASKS (2 waiting)              │ │
│  ├────────────────────────────────────┤ │
│  │ ☑ Make Your Bed         → 2 coins  │ │
│  │ ☑ Practice Reading      → 3 coins  │ │
│  │ ○ Clean Lunch Trash     → 1 coin   │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ SPECIAL TODAY                       │ │
│  ├────────────────────────────────────┤ │
│  │ 🎁 Patience Game (5min) → 5 coins  │ │
│  │    or tap [PLAY]                    │ │
│  └────────────────────────────────────┘ │
│                                         │
│  📊 TREASURE POT: 28 coins              │
│  GOAL: 50 coins (56% ▓▓▓░░░)            │
│                                         │
│                    [COLLECT] [GOALS]    │
│                                         │
└─────────────────────────────────────────┘
```

**Key Flows:**
- **Task Completion:** Tap task → confirm with photo or parent → +coins + celebration animation
- **Collect Coins:** Review day's activity → tap [COLLECT] → coin tally
- **Goals:** Visual progress bar, celebrate milestones (25%, 50%, 100%)
- **Patience Game Notification:** "Your patience game is ready! 🎮" (1x/day opt-in)

### Navigator (10-14) - Strategy Focus

```
┌─────────────────────────────────────────┐
│  PORTFOLIO & TASKS                      │
├─────────────────────────────────────────┤
│  📈 Portfolio Value: $127.35             │
│     ↑ +$2.15 today (Market Sim)         │
│                                         │
│  Allocations:                           │
│  🛡️ Safe (40%) - $50.94                │
│  📊 Growth (45%) - $57.31               │
│  🎯 Fun (15%) - $19.10                  │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ YOUR EARNINGS (this week)           │ │
│  ├────────────────────────────────────┤ │
│  │ ✓ Math Tutoring (30min) → $2.50    │ │
│  │ ✓ Yard Work (1hr)      → $5.00    │ │
│  │ ○ Babysit Sister       → $3.00    │ │
│  │                                     │ │
│  │ 🏆 Streak: 8 days (bonus +$0.25)   │ │
│  └────────────────────────────────────┘ │
│                                         │
│            [EARN] [INVEST]              │
│                                         │
└─────────────────────────────────────────┘
```

**Key Flows:**
- **Task Completion:** Tap → time tracking or photo proof → $amount + portfolio +update
- **Portfolio View:** Real-time allocation pie, brief market context ("Safe funds: 2.1% APY est.")
- **Invest Coins:** "Move coins → Safe/Growth/Fun" with simple rationale prompts
- **Goals Dashboard:** Track savings goals + investment milestones side-by-side

---

## Patience Challenges

### Concept
"Patience games" are engagement hooks that reward delayed gratification. Child agrees to NOT spend coins for X days, then receives bonus.

### Seedling (6-9) Variants

| Challenge | Duration | Reward | Engagement | Messaging |
|-----------|----------|--------|------------|-----------|
| **Daily Delay** | Until bedtime | +1 bonus coin | Low friction | "Don't spend before bed!" |
| **Weekend Wait** | 2 days | +3 bonus coins | Social (family viewing) | "Make it to Sunday!" |
| **Week Warrior** | 7 days | +10 bonus coins | High celebration | "One WHOLE week!" 🎉 |

**UI:** Timeline view with day checkboxes, daily reminder notification, celebration video on completion.

### Navigator (10-14) Variants

| Challenge | Duration | Condition | Reward | Learning |
|-----------|----------|-----------|--------|----------|
| **Reinvestment** | 14 days | Dividends auto-reinvest | +2% bonus | Compound growth |
| **Volatility Ride** | 7 days | Hold through -10% dip | +$X recovery bonus | Market psychology |
| **Dividend Farmer** | 30 days | Only collect dividends | +5% total return | Passive income concept |

**UI:** Portfolio lock view, daily market update notifications, projected returns calculation.

---

## Savings Goals

### Goal Types & Milestones

**Seedling (6-9):**
- Picture-based goals (toy, game, experience)
- Tangible timescales (1 week, 2 weeks, 1 month)
- Celebration at 25%, 50%, 75%, 100%

**Navigator (10-14):**
- Named goals (bike, console, trip fund, first investment)
- Mixed funding (coins earned + allowance + bonuses)
- Goal analytics (days to completion, growth rate)

### Goal Creation Flow

```
PARENT CREATES GOAL (Seedling):
  1. Picture upload (toy, activity, etc.)
  2. Name ("New Skateboard")
  3. Target amount (30 coins)
  4. Reward (physical item or experience)
  → Shared with child, child can add tasks to earn

CHILD CREATES GOAL (Navigator):
  1. Name & category (savings, investment, experience)
  2. Target amount & deadline
  3. Funding strategy (weekly tasks, bonus challenges)
  4. Parent approves before tracked
```

---

## Investment Simulation (Navigator Only)

### Core Mechanics

**Fund Portfolios:**
- **Safe Fund:** 2.1% APY (bonds, savings)
- **Growth Fund:** 8.5% APY avg (stocks, simulated)
- **Fun Fund:** 12% APY avg (high-volatility, fun assets)

**Market Simulation:**
- Daily updates (real or pseudo-random for MVP)
- Show +/- value changes
- No real money involved (educational only)

### Interaction Flows

1. **Rebalance:** Drag coins between funds
2. **Learn:** Tap fund → explanation of assets + historical context
3. **Challenges:** "Hold Growth Fund through -10% dip" → unlock achievements
4. **Performance Report:** Weekly summary vs. benchmarks

---

## Parent Dashboard

### Key Views

**Quick Summary** (Home Tab)
```
┌─────────────────────────────────────┐
│  CHILDREN SUMMARY                   │
├─────────────────────────────────────┤
│                                     │
│  Emma (Age 8)                       │
│  🎯 Streak: 5 days ✨              │
│  💰 Treasure Pot: 28/50 coins      │
│  📊 Top Task: Make Bed (12x)        │
│  ⏰ Last Activity: 2 hours ago      │
│  [DETAILS] [SEND TASK]              │
│                                     │
│  Leo (Age 12)                       │
│  🎯 Streak: 12 days ✨              │
│  💰 Portfolio: $157.23 (+$2.15)    │
│  📊 Fav. Fund: Growth 48%           │
│  ⏰ Last Activity: 30 min ago       │
│  [DETAILS] [SEND TASK]              │
│                                     │
└─────────────────────────────────────┘
```

**Deep Dive** (Per Child)
- Task history (completed, pending, expired)
- Earnings summary (weekly/monthly)
- Goal progress & timeline
- Patience challenge status
- Portfolio performance (Navigator only)
- Notification & reminder settings

**Reporting** (Analytics Tab)
- Monthly earnings trend
- Task completion rate
- Goal achievement milestones
- Patience challenge streaks
- Spending behavior (if spending features added post-MVP)

---

## Reminders & Notifications

### Parent Settings

| Feature | Frequency Options | Default |
|---------|-------------------|---------|
| **Task Pending Alert** | Never / 1x daily / 2x daily | 1x daily (5pm) |
| **Daily Digest** | Off / Morning / Evening | Off |
| **Goal Progress** | Weekly / Monthly | Weekly |
| **Patience Challenge Reminder** | 1x daily / 3x daily | 1x daily (9am) |

### Child Notifications (Seedling 6-9)

- "Your task is waiting!" (task assignment)
- "Great job today! 🌟" (end-of-day check-in)
- "Ready for your patience game?" (special challenges)
- "You unlocked 50 coins! 🎉" (milestone)

### Child Notifications (Navigator 10-14)

- "New task available: $X" (task alert)
- "Your portfolio updated: +$X" (market simulation)
- "Patience challenge starting!" (challenge invite)
- "You hit your goal! 🏆" (goal completion)

---

## Safety & Privacy Guardrails

### Data Collection (Minimal for MVP)

**Collected:**
- Child name, age, cohort
- Task completions & timestamps
- Savings goal progress
- Portfolio simulation state

**NOT Collected:**
- Photos of children (task proof uses parent verification)
- Location data
- Device identifiers beyond session tokens

### Parental Controls

1. **Age-Gating:** Features unlock at recommended ages
2. **Spend Limits:** Parent can cap task-earning per week
3. **Content Filtering:** Parent approves all task categories
4. **Notification Control:** Parent disables individual child notifications
5. **Account Linking:** Parent-child relationship verified at setup

### Monitoring & Reporting

- Parent cannot spy on child input (education not surveillance)
- Parent sees aggregated progress, not keystroke-level data
- Deleted tasks/goals removed from all analytics

---

## Edge Cases & Error States

### Network Connectivity

- **Offline Task Completion:** Save locally, sync on reconnect
- **Offline Portfolio View:** Show last-cached values with "offline" badge
- **Sync Conflict:** Parent value wins; child notified of change

### Invalid States

- **Expired Task:** Removes from active list, archives to history
- **Parent Deletes Goal:** Refund coins, notify child with reason
- **Duplicate Task Assignment:** Prevent, show warning

### Accessibility

- **All Interactive Elements:** ≥48px touch targets
- **Text Contrast:** WCAG AA compliance
- **Readable Fonts:** iOS Dynamic Type, Android large text support
- **VoiceOver/TalkBack:** Alt text on all icons, semantic structure

---

## Acceptance Criteria Met

✅ **Onboarding flows** defined for parent setup & child intro  
✅ **Daily loops** specified for both age cohorts  
✅ **Task-to-reward flow** documented  
✅ **Patience challenges** designed with mechanic details  
✅ **Savings goals** outlined with milestones  
✅ **Investment simulation** scoped (Navigator only)  
✅ **Parent dashboard** wireframed with key views  
✅ **Reminders & notifications** scheduled  
✅ **Safety & privacy guardrails** listed  
✅ **Edge cases** documented  
✅ **Age-based differentiation** applied throughout (6-9 vs 10-14)  

---

## Next Steps

1. **flovey-9af.2:** Implement parent-child auth & permissions
2. **flovey-9af.3:** Build reward flow (task completion, coin logic)
3. **flovey-9af.4:** Implement savings goals with progress tracking
4. **flovey-9af.5:** Build patience challenges subsystem
5. **flovey-9af.6:** Implement investment simulation (Navigator only)
