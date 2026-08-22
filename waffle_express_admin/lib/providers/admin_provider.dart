import 'dart:convert';
import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/order_model.dart';
import '../models/menu_item_model.dart';
import '../models/offer_model.dart';
import '../services/notification_service.dart';
import '../services/supabase_service.dart';

class AdminProvider with ChangeNotifier {
  final SupabaseService _service = SupabaseService.instance;

  List<OrderModel> _orders = [];
  Set<String> _knownOrderIds = {};
  bool _seeded = false;
  List<MenuItemModel> _menuItems = [];
  List<OfferModel> _offers = [];
  Map<String, String> _settings = {};

  bool _isLoadingOrders = false;
  bool _isLoadingMenu = false;
  bool _isLoadingOffers = false;
  bool _isLoadingSettings = false;

  RealtimeChannel? _realtimeChannel;
  Timer? _pollingTimer;

  List<OrderModel> get orders => _orders;
  List<MenuItemModel> get menuItems => _menuItems;
  List<OfferModel> get offers => _offers;
  Map<String, String> get settings => _settings;

  bool get isLoadingOrders => _isLoadingOrders;
  bool get isLoadingMenu => _isLoadingMenu;
  bool get isLoadingOffers => _isLoadingOffers;
  bool get isLoadingSettings => _isLoadingSettings;

  bool get isShopOpen => _settings['shop_open'] != 'false' && _settings['shop_status'] != 'closed';
  double get deliveryFee => double.tryParse(_settings['delivery_fee'] ?? '25') ?? 25.0;

  // Pop-Up Stall Settings Getters
  String get stallStartDate => _settings['stall_start_date'] ?? '';
  String get stallEndDate => _settings['stall_end_date'] ?? '';
  String get stallStartTime => _settings['stall_start_time'] ?? '10:00';
  String get stallEndTime => _settings['stall_end_time'] ?? '22:00';
  String get stallBannerTitle => _settings['stall_banner_title'] ?? '🎉 Waffle Da Pop-Up Stall';
  String get stallBannerSubtitle => _settings['stall_banner_subtitle'] ?? 'Come visit us! Fresh waffles, shakes & more 🧇';
  String get stallBannerLinkText => _settings['stall_banner_link_text'] ?? 'View Stall Menu';

  List<String> get stallItemIds {
    try {
      final raw = _settings['stall_items_config'];
      if (raw == null || raw.isEmpty) return [];
      final List parsed = jsonDecode(raw);
      return parsed.map((e) => e['id'].toString()).toList();
    } catch (_) {
      return [];
    }
  }

  void initRealtimeOrders() {
    _isLoadingOrders = true;
    notifyListeners();

    _fetchOrdersSilently().then((_) {
      _isLoadingOrders = false;
      notifyListeners();
    });

    _startRealtimeChannel();
    _startPollingTimer();
  }

  void _startRealtimeChannel() {
    try {
      _realtimeChannel?.unsubscribe();
      _realtimeChannel = _service.client
          .channel('public:orders_and_settings')
          .onPostgresChanges(
            event: PostgresChangeEvent.all,
            schema: 'public',
            table: 'orders',
            callback: (payload) {
              _fetchOrdersSilently();
            },
          )
          .onPostgresChanges(
            event: PostgresChangeEvent.all,
            schema: 'public',
            table: 'settings',
            callback: (payload) {
              _fetchSettingsSilently();
            },
          )
          .onPostgresChanges(
            event: PostgresChangeEvent.all,
            schema: 'public',
            table: 'menu_items',
            callback: (payload) {
              _fetchMenuItemsSilently();
            },
          );

      _realtimeChannel?.subscribe();
    } catch (e) {
      debugPrint('Realtime channel error: $e');
    }
  }

  void _startPollingTimer() {
    _pollingTimer?.cancel();
    // Increased from 2s to 10s interval to reduce battery drain
    // Realtime subscriptions handle urgent updates
    _pollingTimer = Timer.periodic(const Duration(seconds: 10), (_) {
      _fetchOrdersSilently();
      _fetchSettingsSilently();
      _fetchMenuItemsSilently();
    });
  }

  Future<void> _fetchOrdersSilently() async {
    try {
      final freshOrders = await _service.fetchOrders();

      if (!_seeded) {
        // Initial load - store existing order IDs without spamming notifications
        _seeded = true;
        _knownOrderIds = freshOrders.map((o) => o.id).toSet();
        _orders = freshOrders;
        notifyListeners();
        return;
      }

      // Check for any NEW order ID that was not in _knownOrderIds!
      for (var newOrder in freshOrders) {
        if (!_knownOrderIds.contains(newOrder.id)) {
          _knownOrderIds.add(newOrder.id);
          debugPrint('NEW ORDER DETECTED FOR NOTIFICATION: ${newOrder.id}');
          NotificationService.instance.showOrderNotification(newOrder);
        }
      }

      final currentKey = _orders.map((o) => '${o.id}_${o.status}_${o.seen}').join('|');
      final freshKey = freshOrders.map((o) => '${o.id}_${o.status}_${o.seen}').join('|');
      if (currentKey != freshKey) {
        _orders = freshOrders;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Silent order fetch error: $e');
    }
  }

  Future<void> _fetchSettingsSilently() async {
    try {
      final freshSettings = await _service.fetchSettings();
      _settings = freshSettings;
      notifyListeners();
    } catch (_) {}
  }

  Future<void> _fetchMenuItemsSilently() async {
    try {
      final freshItems = await _service.fetchMenuItems();
      final currentKey = _menuItems.map((i) => '${i.id}_${i.available}_${i.price}').join('|');
      final freshKey = freshItems.map((i) => '${i.id}_${i.available}_${i.price}').join('|');
      if (currentKey != freshKey) {
        _menuItems = freshItems;
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> fetchMenuItems() async {
    _isLoadingMenu = true;
    notifyListeners();
    try {
      _menuItems = await _service.fetchMenuItems();
    } catch (e) {
      debugPrint('Error fetching menu items: $e');
    } finally {
      _isLoadingMenu = false;
      notifyListeners();
    }
  }

  Future<void> fetchOffers() async {
    _isLoadingOffers = true;
    notifyListeners();
    try {
      _offers = await _service.fetchOffers();
    } catch (e) {
      debugPrint('Error fetching offers: $e');
    } finally {
      _isLoadingOffers = false;
      notifyListeners();
    }
  }

  Future<void> fetchSettings() async {
    _isLoadingSettings = true;
    notifyListeners();
    try {
      _settings = await _service.fetchSettings();
    } catch (e) {
      debugPrint('Error fetching settings: $e');
    } finally {
      _isLoadingSettings = false;
      notifyListeners();
    }
  }

  // --- ACTIONS ---
  Future<void> updateOrderStatus(String id, String status) async {
    await _service.updateOrderStatus(id, status);
    await _fetchOrdersSilently();
  }

  Future<void> deleteOrder(String id) async {
    await _service.deleteOrder(id);
    _orders.removeWhere((o) => o.id == id);
    _knownOrderIds.remove(id);
    notifyListeners();
  }

  Future<void> toggleMenuItemAvailability(String id, bool available) async {
    final idx = _menuItems.indexWhere((item) => item.id == id);
    if (idx != -1) {
      _menuItems[idx] = _menuItems[idx].copyWith(available: available);
      notifyListeners();
      await _service.toggleMenuItemAvailability(id, available);
    }
  }

  Future<void> saveMenuItem(MenuItemModel item) async {
    await _service.saveMenuItem(item);
    await fetchMenuItems();
  }

  Future<void> deleteMenuItem(String id) async {
    await _service.deleteMenuItem(id);
    _menuItems.removeWhere((item) => item.id == id);
    notifyListeners();
  }

  Future<void> toggleOfferActive(String id, bool isActive) async {
    await _service.toggleOfferActive(id, isActive);
    await fetchOffers();
  }

  Future<void> saveOffer(OfferModel offer) async {
    await _service.saveOffer(offer);
    await fetchOffers();
  }

  Future<void> deleteOffer(String id) async {
    await _service.deleteOffer(id);
    _offers.removeWhere((o) => o.id == id);
    notifyListeners();
  }

  Future<void> toggleShopStatus(bool open) async {
    final openVal = open ? 'true' : 'false';
    final statusVal = open ? 'open' : 'closed';
    _settings['shop_open'] = openVal;
    _settings['shop_status'] = statusVal;
    notifyListeners();
    await _service.updateSetting('shop_open', openVal);
    await _service.updateSetting('shop_status', statusVal);
  }

  Future<void> updateDeliveryFee(double fee) async {
    _settings['delivery_fee'] = fee.toString();
    notifyListeners();
    await _service.updateSetting('delivery_fee', fee.toString());
  }

  // --- POP-UP STALL MANAGEMENT ACTIONS ---
  Future<void> updateStallSchedule({
    required String startDate,
    required String endDate,
    required String startTime,
    required String endTime,
  }) async {
    _settings['stall_start_date'] = startDate;
    _settings['stall_end_date'] = endDate;
    _settings['stall_start_time'] = startTime;
    _settings['stall_end_time'] = endTime;
    notifyListeners();

    await Future.wait([
      _service.updateSetting('stall_start_date', startDate),
      _service.updateSetting('stall_end_date', endDate),
      _service.updateSetting('stall_start_time', startTime),
      _service.updateSetting('stall_end_time', endTime),
    ]);
  }

  Future<void> updateStallBanner({
    required String title,
    required String subtitle,
    required String linkText,
  }) async {
    _settings['stall_banner_title'] = title;
    _settings['stall_banner_subtitle'] = subtitle;
    _settings['stall_banner_link_text'] = linkText;
    notifyListeners();

    await Future.wait([
      _service.updateSetting('stall_banner_title', title),
      _service.updateSetting('stall_banner_subtitle', subtitle),
      _service.updateSetting('stall_banner_link_text', linkText),
    ]);
  }

  Future<void> toggleStallItem(String itemId) async {
    final currentList = stallItemIds;
    final List<Map<String, dynamic>> updatedConfig = [];

    if (currentList.contains(itemId)) {
      for (var id in currentList) {
        if (id != itemId) updatedConfig.add({'id': id});
      }
    } else {
      for (var id in currentList) {
        updatedConfig.add({'id': id});
      }
      updatedConfig.add({'id': itemId});
    }

    final jsonStr = jsonEncode(updatedConfig);
    _settings['stall_items_config'] = jsonStr;
    notifyListeners();
    await _service.updateSetting('stall_items_config', jsonStr);
  }

  @override
  void dispose() {
    _realtimeChannel?.unsubscribe();
    _pollingTimer?.cancel();
    super.dispose();
  }
}
