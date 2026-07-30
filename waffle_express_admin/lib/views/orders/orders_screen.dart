import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/constants.dart';
import '../../config/theme.dart';
import '../../models/order_model.dart';
import '../../providers/admin_provider.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatusFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final admin = context.watch<AdminProvider>();

    final filteredOrders = admin.orders.where((order) {
      final query = _searchController.text.toLowerCase();
      final matchesQuery = order.id.toLowerCase().contains(query) ||
          order.customerName.toLowerCase().contains(query) ||
          order.phone.contains(query);
      final matchesStatus = _selectedStatusFilter == 'All' || order.status == _selectedStatusFilter;
      return matchesQuery && matchesStatus;
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.creamyBackground,
      appBar: AppBar(
        title: const Text('Order Management'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => admin.initRealtimeOrders(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  style: const TextStyle(color: AppTheme.textDark),
                  decoration: InputDecoration(
                    hintText: 'Search by Order ID, Name, or Phone...',
                    prefixIcon: const Icon(Icons.search, color: AppTheme.textMuted),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, color: AppTheme.textMuted),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                  ),
                ),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['All', ...AppConstants.orderStatuses].map((status) {
                      final isSelected = _selectedStatusFilter == status;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(status),
                          selected: isSelected,
                          selectedColor: AppTheme.primaryAmber,
                          backgroundColor: AppTheme.cardSurface,
                          side: BorderSide(
                            color: isSelected ? AppTheme.primaryAmber : AppTheme.cardBorder,
                          ),
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : AppTheme.textDark,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            fontSize: 12,
                          ),
                          onSelected: (_) {
                            setState(() {
                              _selectedStatusFilter = status;
                            });
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Orders List
          Expanded(
            child: admin.isLoadingOrders
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryAmber))
                : filteredOrders.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.receipt_long_outlined, size: 54, color: AppTheme.textMuted),
                            const SizedBox(height: 12),
                            Text(
                              'No matching orders found.',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 16),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemCount: filteredOrders.length,
                        itemBuilder: (context, index) {
                          final order = filteredOrders[index];
                          return _OrderCard(order: order);
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

class _OrderCard extends StatefulWidget {
  final OrderModel order;
  const _OrderCard({required this.order});

  @override
  State<_OrderCard> createState() => _OrderCardState();
}

class _OrderCardState extends State<_OrderCard> {
  bool _expanded = false;

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

  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    }
  }

  void _confirmDeleteOrder(BuildContext context, AdminProvider admin, String orderId) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.redAccent),
            SizedBox(width: 8),
            Text('Delete Order?'),
          ],
        ),
        content: Text('Are you sure you want to permanently delete order $orderId? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('CANCEL', style: TextStyle(color: AppTheme.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await admin.deleteOrder(orderId);
              if (mounted) {
                ScaffoldMessenger.of(ctx).showSnackBar(
                  SnackBar(
                    content: Text('Order $orderId deleted successfully'),
                    backgroundColor: Colors.redAccent,
                  ),
                );
              }
            },
            child: const Text('DELETE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final admin = context.read<AdminProvider>();
    final order = widget.order;
    final statusColor = _getStatusColor(order.status);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Column(
        children: [
          // Order Header
          ListTile(
            onTap: () {
              setState(() {
                _expanded = !_expanded;
              });
            },
            leading: CircleAvatar(
              backgroundColor: order.seen ? AppTheme.creamyBackground : AppTheme.primaryAmber.withOpacity(0.15),
              child: Icon(
                Icons.shopping_bag_outlined,
                color: order.seen ? AppTheme.textMuted : AppTheme.primaryAmber,
              ),
            ),
            title: Row(
              children: [
                Text(
                  order.id,
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark),
                ),
                if (!order.seen) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.accentCoral,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'NEW',
                      style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ],
            ),
            subtitle: Text(
              '${order.customerName} • ₹${order.total.toStringAsFixed(0)}',
              style: const TextStyle(color: AppTheme.textMuted),
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    order.status,
                    style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                  onPressed: () => _confirmDeleteOrder(context, admin, order.id),
                  tooltip: 'Delete Order',
                ),
                Icon(
                  _expanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                  color: AppTheme.textMuted,
                ),
              ],
            ),
          ),

          // Expanded Details
          if (_expanded) ...[
            const Divider(color: AppTheme.cardBorder, height: 1),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Customer info & address
                  Row(
                    children: [
                      const Icon(Icons.person_outline, size: 16, color: AppTheme.textMuted),
                      const SizedBox(width: 6),
                      Text(order.customerName, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                      const Spacer(),
                      InkWell(
                        onTap: () => _makePhoneCall(order.phone),
                        child: Row(
                          children: [
                            const Icon(Icons.phone, size: 16, color: AppTheme.primaryAmber),
                            const SizedBox(width: 4),
                            Text(
                              order.phone,
                              style: const TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.location_on_outlined, size: 16, color: AppTheme.textMuted),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          order.address.isEmpty ? 'Store Pickup' : order.address,
                          style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Order items breakdown
                  const Text('Items Ordered:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                  const SizedBox(height: 6),
                  ...order.items.map((item) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${item.quantity}x  ${item.name}',
                              style: const TextStyle(color: AppTheme.textDark, fontSize: 13),
                            ),
                            Text(
                              '₹${(item.price * item.quantity).toStringAsFixed(0)}',
                              style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                            ),
                          ],
                        ),
                      )),
                  const SizedBox(height: 12),
                  const Divider(color: AppTheme.cardBorder),

                  // Update Status Controls
                  const Text('Update Order Status:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: AppConstants.orderStatuses.map((st) {
                      final isCurrent = order.status == st;
                      return OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          backgroundColor: isCurrent ? AppTheme.primaryAmber : Colors.transparent,
                          foregroundColor: isCurrent ? Colors.white : AppTheme.textDark,
                          side: BorderSide(
                            color: isCurrent ? AppTheme.primaryAmber : AppTheme.cardBorder,
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        onPressed: () {
                          admin.updateOrderStatus(order.id, st);
                        },
                        child: Text(st, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Delete Order Button
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.redAccent,
                        side: const BorderSide(color: Colors.redAccent),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      icon: const Icon(Icons.delete_forever, size: 18),
                      label: const Text('DELETE ORDER PERMANENTLY', style: TextStyle(fontWeight: FontWeight.bold)),
                      onPressed: () => _confirmDeleteOrder(context, admin, order.id),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
