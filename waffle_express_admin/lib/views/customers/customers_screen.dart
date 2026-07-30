import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/theme.dart';
import '../../providers/admin_provider.dart';

class CustomerInfo {
  final String name;
  final String phone;
  final int totalOrders;
  final double totalSpent;
  final DateTime lastOrderAt;

  CustomerInfo({
    required this.name,
    required this.phone,
    required this.totalOrders,
    required this.totalSpent,
    required this.lastOrderAt,
  });
}

class CustomersScreen extends StatelessWidget {
  const CustomersScreen({super.key});

  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final admin = context.watch<AdminProvider>();

    // Aggregate customers from orders
    final Map<String, CustomerInfo> customerMap = {};
    for (var order in admin.orders) {
      if (order.phone.isEmpty) continue;
      if (customerMap.containsKey(order.phone)) {
        final existing = customerMap[order.phone]!;
        customerMap[order.phone] = CustomerInfo(
          name: existing.name.isNotEmpty ? existing.name : order.customerName,
          phone: order.phone,
          totalOrders: existing.totalOrders + 1,
          totalSpent: existing.totalSpent + order.total,
          lastOrderAt: order.createdAt.isAfter(existing.lastOrderAt) ? order.createdAt : existing.lastOrderAt,
        );
      } else {
        customerMap[order.phone] = CustomerInfo(
          name: order.customerName,
          phone: order.phone,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderAt: order.createdAt,
        );
      }
    }

    final customers = customerMap.values.toList()
      ..sort((a, b) => b.totalSpent.compareTo(a.totalSpent));

    return Scaffold(
      backgroundColor: AppTheme.creamyBackground,
      appBar: AppBar(
        title: const Text('Customer Directory'),
      ),
      body: customers.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.people_outline, size: 54, color: AppTheme.textMuted),
                  const SizedBox(height: 12),
                  Text('No customer history found.', style: TextStyle(color: AppTheme.textMuted, fontSize: 16)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: customers.length,
              itemBuilder: (context, index) {
                final c = customers[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppTheme.primaryAmber.withOpacity(0.15),
                      child: Text(
                        c.name.isNotEmpty ? c.name[0].toUpperCase() : 'C',
                        style: const TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.bold),
                      ),
                    ),
                    title: Text(c.name, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                    subtitle: Text('${c.totalOrders} Orders • Total Spent: ₹${c.totalSpent.toStringAsFixed(0)}',
                        style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                    trailing: IconButton(
                      icon: const Icon(Icons.phone, color: AppTheme.primaryAmber),
                      onPressed: () => _makePhoneCall(c.phone),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
