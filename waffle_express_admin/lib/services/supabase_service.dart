import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/constants.dart';
import '../models/order_model.dart';
import '../models/menu_item_model.dart';
import '../models/offer_model.dart';

class SupabaseService {
  static final SupabaseService instance = SupabaseService._internal();
  SupabaseService._internal();

  SupabaseClient get client => Supabase.instance.client;

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: AppConstants.supabaseUrl,
      anonKey: AppConstants.supabaseAnonKey,
    );
  }

  // --- AUTHENTICATION ---
  Future<AuthResponse> login(String email, String password) async {
    return await client.auth.signInWithPassword(email: email, password: password);
  }

  Future<void> logout() async {
    await client.auth.signOut();
  }

  User? get currentUser => client.auth.currentUser;

  // --- ORDERS ---
  Future<List<OrderModel>> fetchOrders() async {
    final response = await client
        .from('orders')
        .select()
        .order('created_at', ascending: false);
    return (response as List).map((json) => OrderModel.fromJson(json)).toList();
  }

  Future<void> updateOrderStatus(String id, String status) async {
    await client.from('orders').update({'status': status, 'seen': true}).eq('id', id);
  }

  Future<void> markOrderAsSeen(String id) async {
    await client.from('orders').update({'seen': true}).eq('id', id);
  }

  Future<void> deleteOrder(String id) async {
    await client.from('orders').delete().eq('id', id);
  }

  // Realtime Orders Stream
  Stream<List<Map<String, dynamic>>> streamOrders() {
    return client.from('orders').stream(primaryKey: ['id']).order('created_at', ascending: false);
  }

  // --- MENU ITEMS ---
  Future<List<MenuItemModel>> fetchMenuItems() async {
    final response = await client
        .from('menu_items')
        .select()
        .order('sort_order', ascending: true);
    return (response as List).map((json) => MenuItemModel.fromJson(json)).toList();
  }

  Future<void> toggleMenuItemAvailability(String id, bool available) async {
    await client.from('menu_items').update({'available': available}).eq('id', id);
  }

  Future<void> saveMenuItem(MenuItemModel item) async {
    final data = item.toJson();
    await client.from('menu_items').upsert(data);
  }

  Future<void> deleteMenuItem(String id) async {
    await client.from('menu_items').delete().eq('id', id);
  }

  // --- OFFERS ---
  Future<List<OfferModel>> fetchOffers() async {
    final response = await client.from('offers').select().order('created_at', ascending: false);
    return (response as List).map((json) => OfferModel.fromJson(json)).toList();
  }

  Future<void> toggleOfferActive(String id, bool isActive) async {
    await client.from('offers').update({'is_active': isActive}).eq('id', id);
  }

  Future<void> saveOffer(OfferModel offer) async {
    await client.from('offers').upsert(offer.toJson());
  }

  Future<void> deleteOffer(String id) async {
    await client.from('offers').delete().eq('id', id);
  }

  // --- SETTINGS ---
  Future<Map<String, String>> fetchSettings() async {
    try {
      final response = await client.from('settings').select();
      final Map<String, String> map = {};
      for (var item in (response as List)) {
        map[item['key'].toString()] = item['value'].toString();
      }
      return map;
    } catch (_) {
      return {};
    }
  }

  Future<void> updateSetting(String key, String value) async {
    await client.from('settings').upsert({
      'key': key,
      'value': value,
      'updated_at': DateTime.now().toIso8601String(),
    });
  }
}
