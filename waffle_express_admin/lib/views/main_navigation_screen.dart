import 'package:flutter/material.dart';
import '../config/theme.dart';
import 'dashboard/dashboard_screen.dart';
import 'orders/orders_screen.dart';
import 'products/products_screen.dart';
import 'customers/customers_screen.dart';
import 'offers/offers_screen.dart';
import 'settings/settings_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  final VoidCallback onLogout;
  const MainNavigationScreen({super.key, required this.onLogout});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  void _setPage(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      DashboardScreen(onNavigate: _setPage),
      const OrdersScreen(),
      const ProductsScreen(),
      const CustomersScreen(),
      const OffersScreen(),
      SettingsScreen(onLogout: widget.onLogout),
    ];

    final isWide = MediaQuery.of(context).size.width >= 800;

    return Scaffold(
      backgroundColor: AppTheme.creamyBackground,
      body: Row(
        children: [
          if (isWide)
            NavigationRail(
              backgroundColor: AppTheme.cardSurface,
              selectedIndex: _currentIndex,
              onDestinationSelected: (int index) {
                setState(() {
                  _currentIndex = index;
                });
              },
              labelType: NavigationRailLabelType.all,
              selectedIconTheme: const IconThemeData(color: AppTheme.primaryAmber),
              selectedLabelTextStyle: const TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.bold, fontSize: 12),
              unselectedIconTheme: const IconThemeData(color: AppTheme.textMuted),
              unselectedLabelTextStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
              destinations: const [
                NavigationRailDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: Text('Dashboard')),
                NavigationRailDestination(icon: Icon(Icons.shopping_bag_outlined), selectedIcon: Icon(Icons.shopping_bag), label: Text('Orders')),
                NavigationRailDestination(icon: Icon(Icons.restaurant_menu_outlined), selectedIcon: Icon(Icons.restaurant_menu), label: Text('Products')),
                NavigationRailDestination(icon: Icon(Icons.people_outline), selectedIcon: Icon(Icons.people), label: Text('Customers')),
                NavigationRailDestination(icon: Icon(Icons.local_offer_outlined), selectedIcon: Icon(Icons.local_offer), label: Text('Offers')),
                NavigationRailDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: Text('Settings')),
              ],
            ),
          Expanded(child: pages[_currentIndex]),
        ],
      ),
      bottomNavigationBar: isWide
          ? null
          : Container(
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: AppTheme.cardBorder, width: 1)),
              ),
              child: BottomNavigationBar(
                currentIndex: _currentIndex,
                onTap: (index) {
                  setState(() {
                    _currentIndex = index;
                  });
                },
                type: BottomNavigationBarType.fixed,
                backgroundColor: AppTheme.cardSurface,
                selectedItemColor: AppTheme.primaryAmber,
                unselectedItemColor: AppTheme.textMuted,
                selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                unselectedLabelStyle: const TextStyle(fontSize: 11),
                items: const [
                  BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
                  BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), activeIcon: Icon(Icons.shopping_bag), label: 'Orders'),
                  BottomNavigationBarItem(icon: Icon(Icons.restaurant_menu_outlined), activeIcon: Icon(Icons.restaurant_menu), label: 'Products'),
                  BottomNavigationBarItem(icon: Icon(Icons.people_outline), activeIcon: Icon(Icons.people), label: 'Customers'),
                  BottomNavigationBarItem(icon: Icon(Icons.local_offer_outlined), activeIcon: Icon(Icons.local_offer), label: 'Offers'),
                  BottomNavigationBarItem(icon: Icon(Icons.settings_outlined), activeIcon: Icon(Icons.settings), label: 'Settings'),
                ],
              ),
            ),
    );
  }
}
