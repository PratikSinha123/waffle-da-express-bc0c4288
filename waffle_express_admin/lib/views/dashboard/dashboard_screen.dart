import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/admin_provider.dart';

class DashboardScreen extends StatelessWidget {
  final Function(int) onNavigate;
  const DashboardScreen({super.key, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final admin = context.watch<AdminProvider>();

    final totalOrdersCount = admin.orders.length;
    final pendingOrdersCount = admin.orders.where((o) => o.status == 'Order Received' || o.status == 'Preparing').length;
    final totalRevenue = admin.orders
        .where((o) => o.status == 'Delivered')
        .fold(0.0, (sum, o) => sum + o.total);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            child: FilterChip(
              avatar: Icon(
                admin.isShopOpen ? Icons.store : Icons.store_outlined,
                color: admin.isShopOpen ? Colors.green : Colors.red,
                size: 18,
              ),
              label: Text(
                admin.isShopOpen ? 'STORE OPEN' : 'STORE CLOSED',
                style: TextStyle(
                  color: admin.isShopOpen ? Colors.green : Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
              backgroundColor: admin.isShopOpen
                  ? Colors.green.withOpacity(0.12)
                  : Colors.red.withOpacity(0.12),
              side: BorderSide(
                color: admin.isShopOpen ? Colors.green.withOpacity(0.3) : Colors.red.withOpacity(0.3),
              ),
              onSelected: (val) {
                admin.toggleShopStatus(val);
              },
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await admin.fetchMenuItems();
          await admin.fetchSettings();
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Banner - Soft Warm Creamy Gradient
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFEF3C7), Color(0xFFFDE68A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Waffle Da Express 🧇',
                            style: TextStyle(
                              color: Color(0xFF78350F),
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Manage live customer orders, update menu items, and control store operating status.',
                            style: TextStyle(
                              color: Color(0xFF92400E),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(
                      Icons.insights_rounded,
                      size: 48,
                      color: Color(0xFFB45309),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Metric Cards Grid
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: MediaQuery.of(context).size.width > 600 ? 4 : 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.4,
                children: [
                  _MetricCard(
                    title: 'Active Orders',
                    value: '$pendingOrdersCount',
                    icon: Icons.kitchen_outlined,
                    color: AppTheme.warningOrange,
                    onTap: () => onNavigate(1),
                  ),
                  _MetricCard(
                    title: 'Total Revenue',
                    value: '₹${totalRevenue.toStringAsFixed(0)}',
                    icon: Icons.currency_rupee_rounded,
                    color: AppTheme.successGreen,
                  ),
                  _MetricCard(
                    title: 'Total Orders',
                    value: '$totalOrdersCount',
                    icon: Icons.shopping_bag_outlined,
                    color: AppTheme.primaryAmber,
                    onTap: () => onNavigate(1),
                  ),
                  _MetricCard(
                    title: 'Menu Items',
                    value: '${admin.menuItems.length}',
                    icon: Icons.restaurant_menu_outlined,
                    color: AppTheme.accentCoral,
                    onTap: () => onNavigate(2),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Recent Orders Section Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Live Order Queue',
                    style: TextStyle(
                      color: AppTheme.textDark,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  TextButton(
                    onPressed: () => onNavigate(1),
                    child: const Text(
                      'View All',
                      style: TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              if (admin.orders.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: AppTheme.cardSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.cardBorder),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.inbox_outlined, size: 40, color: AppTheme.textMuted),
                      SizedBox(height: 12),
                      Text(
                        'No orders received yet.',
                        style: TextStyle(color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: admin.orders.take(4).length,
                  itemBuilder: (context, index) {
                    final order = admin.orders[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: order.seen
                              ? AppTheme.creamyBackground
                              : AppTheme.primaryAmber.withOpacity(0.15),
                          child: Icon(
                            Icons.shopping_bag_outlined,
                            color: order.seen ? AppTheme.textMuted : AppTheme.primaryAmber,
                            size: 20,
                          ),
                        ),
                        title: Text(
                          '${order.id} • ${order.customerName}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark),
                        ),
                        subtitle: Text(
                          '${order.items.length} items • ₹${order.total.toStringAsFixed(0)}',
                          style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                        ),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _getStatusColor(order.status).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            order.status,
                            style: TextStyle(
                              color: _getStatusColor(order.status),
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        ),
                        onTap: () => onNavigate(1),
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Delivered':
        return const Color(0xFF059669);
      case 'Preparing':
        return const Color(0xFFD97706);
      case 'Order Received':
        return const Color(0xFF2563EB);
      case 'Out for Delivery':
        return const Color(0xFFEA580C);
      default:
        return const Color(0xFFDC2626);
    }
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.cardSurface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.cardBorder),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Icon(icon, color: color, size: 22),
              ],
            ),
            Text(
              value,
              style: const TextStyle(
                color: AppTheme.textDark,
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
