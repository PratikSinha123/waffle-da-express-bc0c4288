import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
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

  @override
  void initState() {
    super.initState();
    _checkInitialAuth();
  }

  void _checkInitialAuth() {
    final user = SupabaseService.instance.currentUser;
    setState(() {
      _isLoggedIn = user != null;
    });
  }

  @override
  Widget build(BuildContext context) {
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
                onLogout: () {
                  setState(() {
                    _isLoggedIn = false;
                  });
                },
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
