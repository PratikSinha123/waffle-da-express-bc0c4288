import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'config/theme.dart';
import 'providers/admin_provider.dart';
import 'services/notification_service.dart';
import 'services/supabase_service.dart';
import 'views/auth/login_screen.dart';
import 'views/main_navigation_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseService.initialize();
  await NotificationService.instance.initialize();
  runApp(const WaffleExpressAdminApp());
}

class WaffleExpressAdminApp extends StatefulWidget {
  const WaffleExpressAdminApp({super.key});

  @override
  State<WaffleExpressAdminApp> createState() => _WaffleExpressAdminAppState();
}

class _WaffleExpressAdminAppState extends State<WaffleExpressAdminApp> {
  bool _isLoggedIn = false;
  bool _checkingAuth = true;

  @override
  void initState() {
    super.initState();
    _checkInitialAuth();
  }

  Future<void> _checkInitialAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final persistentLoggedIn = prefs.getBool('is_admin_logged_in') ?? false;
    final supabaseUser = SupabaseService.instance.currentUser != null;

    setState(() {
      _isLoggedIn = persistentLoggedIn || supabaseUser;
      _checkingAuth = false;
    });
  }

  Future<void> _handleLogout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('is_admin_logged_in', false);
    setState(() {
      _isLoggedIn = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_checkingAuth) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const Scaffold(
          backgroundColor: AppTheme.creamyBackground,
          body: Center(
            child: CircularProgressIndicator(color: AppTheme.primaryAmber),
          ),
        ),
      );
    }

    return ChangeNotifierProvider(
      create: (_) => AdminProvider()
        ..initRealtimeOrders()
        ..fetchMenuItems()
        ..fetchOffers()
        ..fetchSettings(),
      child: MaterialApp(
        title: 'Waffle Da Express Admin',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: _isLoggedIn
            ? MainNavigationScreen(
                onLogout: _handleLogout,
              )
            : LoginScreen(
                onLoginSuccess: () {
                  setState(() {
                    _isLoggedIn = true;
                  });
                },
              ),
      ),
    );
  }
}
