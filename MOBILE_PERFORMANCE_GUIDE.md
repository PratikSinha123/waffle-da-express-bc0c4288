# Mobile Performance Optimization Guide

## Overview
This document outlines performance optimizations for the Flutter admin app to improve battery life, reduce data usage, and enhance user experience.

---

## Current Issues

### 1. Aggressive Polling Timer (2-second interval)
**File**: `waffle_express_admin/lib/providers/admin_provider.dart:112`

**Issue**:
```dart
_pollingTimer = Timer.periodic(const Duration(milliseconds: 2000), (_) {
  _fetchOrdersSilently();      // Every 2 seconds
  _fetchSettingsSilently();    // Every 2 seconds
  _fetchMenuItemsSilently();   // Every 2 seconds
});
```

**Impact**:
- Constant network requests drain battery quickly
- High CPU usage from repeated data fetching
- Unnecessary data usage on metered connections
- Device stays active, preventing sleep

**Recommended Solution**: Implement adaptive polling
```dart
// Increase polling interval when app is in background
const Duration activePollingInterval = Duration(seconds: 3);
const Duration backgroundPollingInterval = Duration(seconds: 30);
```

---

### 2. Multiple Concurrent Fetch Operations

**Issue**:
```dart
_fetchOrdersSilently();
_fetchSettingsSilently();
_fetchMenuItemsSilently();
```

All three are called independently every 2 seconds, causing 6 network requests per 4 seconds.

**Recommended Solution**:
- Batch requests into single API call
- Use Supabase joins/queries to fetch related data in one request
- Implement request debouncing

---

### 3. Lack of Connection State Management

**Issue**: No detection of Wi-Fi vs mobile, or offline state

**Recommended Solution**:
```dart
import 'package:connectivity_plus/connectivity_plus.dart';

// Use connectivity to adjust polling frequency
final connectivity = await Connectivity().checkConnectivity();
if (connectivity == ConnectivityResult.mobile) {
  // Use longer intervals on mobile data
  _pollingInterval = Duration(seconds: 30);
} else if (connectivity == ConnectivityResult.wifi) {
  // Can be more aggressive on Wi-Fi
  _pollingInterval = Duration(seconds: 5);
}
```

---

### 4. Missing Image Optimization

**Issue**: No lazy loading or image caching strategy

**Recommended Solution**:
```dart
// Use cached_network_image package
CachedNetworkImage(
  imageUrl: url,
  placeholder: (context, url) => Placeholder(),
  errorWidget: (context, url, error) => Icon(Icons.error),
  cacheManager: CacheManager.instance,
);
```

---

### 5. No Frame Rate Limiting on UI Updates

**Issue**: Every notifyListeners() can trigger full rebuild

**Recommended Solution**:
```dart
// Implement selective rebuild with Provider scoping
ChangeNotifier.notifyListeners(); // Use this sparingly
// OR use more granular providers:
ListenableProvider<Orders> // Only rebuild when orders change
ListenableProvider<Settings> // Only rebuild when settings change
```

---

## Optimization Recommendations

### Priority 1: Polling Optimization (High Impact)
1. Increase default polling interval from 2s to 10-30s
2. Add lifecycle awareness (pause polling when app backgrounded)
3. Resume polling only when app returns to foreground
4. Implement exponential backoff on failed requests

**Implementation**:
```dart
// In main.dart
@override
void didChangeAppLifecycleState(AppLifecycleState state) {
  if (state == AppLifecycleState.paused) {
    provider.pausePolling();
  } else if (state == AppLifecycleState.resumed) {
    provider.resumePolling();
  }
}
```

### Priority 2: Request Batching (Medium Impact)
1. Combine multiple Supabase queries into single request
2. Implement request deduplication
3. Add request throttling to prevent duplicate calls

**Example**:
```dart
// Instead of 3 separate queries
Future<void> _fetchAllData() async {
  final orders = await _service.fetchOrders();
  final settings = await _service.fetchSettings();
  final menu = await _service.fetchMenuItems();
  // All 3 are fetched in parallel but within one "batch"
}
```

### Priority 3: Connection-Aware Polling (Medium Impact)
1. Add connectivity_plus package
2. Detect connection type (Wi-Fi, mobile, none)
3. Adjust polling frequency based on connection
4. Use aggressive caching on mobile data

### Priority 4: Image & Asset Optimization (Low Impact)
1. Add cached_network_image package
2. Implement network image caching
3. Compress images before display
4. Use placeholder/skeleton loading

---

## Dependencies to Add

```yaml
# pubspec.yaml additions
dependencies:
  connectivity_plus: ^5.0.0
  cached_network_image: ^3.3.0
  app_lifecycle_observer: ^0.1.0
```

---

## Testing & Monitoring

### Battery Impact Testing
1. Use Android Studio Profiler to monitor:
   - Network activity (bytes/sec)
   - CPU usage (%)
   - Battery drain rate (mAh/min)

2. Test scenarios:
   - App in foreground (5 min)
   - App backgrounded (10 min)
   - Network switch (Wi-Fi → mobile)
   - Offline then online

### Metrics to Track
- Avg polling requests per minute
- Battery drain rate (mAh/hour)
- Data usage per hour
- CPU usage % (idle vs active)

---

## Quick Wins (Implement First)

1. **Increase polling interval from 2s to 15s** (~87% battery improvement)
2. **Pause polling when app backgrounded** (~50% background battery improvement)
3. **Add lifecycle observer** (5 min implementation)

---

## Long-term Improvements

1. Implement proper admin authentication role-based access
2. Switch to push notifications instead of polling
3. Use WebSocket for real-time updates instead of HTTP polling
4. Implement offline-first with local caching strategy
5. Add analytics to measure actual battery impact

---

## Implementation Checklist

- [ ] Increase polling interval to 15-30 seconds
- [ ] Add app lifecycle detection (pause/resume polling)
- [ ] Test battery impact with updated intervals
- [ ] Add connectivity detection
- [ ] Adjust polling based on connection type
- [ ] Implement request batching
- [ ] Add image caching
- [ ] Monitor battery drain in production

---

## Related Files

- `waffle_express_admin/lib/providers/admin_provider.dart` - Main polling logic
- `waffle_express_admin/lib/services/supabase_service.dart` - API service
- `waffle_express_admin/pubspec.yaml` - Dependencies
- `waffle_express_admin/lib/main.dart` - App lifecycle
