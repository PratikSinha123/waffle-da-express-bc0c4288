import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/admin_provider.dart';
import '../../services/notification_service.dart';
import '../../services/supabase_service.dart';

class SettingsScreen extends StatefulWidget {
  final VoidCallback onLogout;
  const SettingsScreen({super.key, required this.onLogout});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late TextEditingController _deliveryFeeController;

  // Stall Schedule Controllers
  late TextEditingController _stallStartDateController;
  late TextEditingController _stallEndDateController;
  late TextEditingController _stallStartTimeController;
  late TextEditingController _stallEndTimeController;

  // Stall Banner Controllers
  late TextEditingController _stallBannerTitleController;
  late TextEditingController _stallBannerSubtitleController;
  late TextEditingController _stallBannerLinkTextController;

  @override
  void initState() {
    super.initState();
    final admin = context.read<AdminProvider>();
    _deliveryFeeController = TextEditingController(text: admin.deliveryFee.toStringAsFixed(0));

    _stallStartDateController = TextEditingController(text: admin.stallStartDate);
    _stallEndDateController = TextEditingController(text: admin.stallEndDate);
    _stallStartTimeController = TextEditingController(text: admin.stallStartTime);
    _stallEndTimeController = TextEditingController(text: admin.stallEndTime);

    _stallBannerTitleController = TextEditingController(text: admin.stallBannerTitle);
    _stallBannerSubtitleController = TextEditingController(text: admin.stallBannerSubtitle);
    _stallBannerLinkTextController = TextEditingController(text: admin.stallBannerLinkText);

    admin.fetchSettings();
  }

  @override
  Widget build(BuildContext context) {
    final admin = context.watch<AdminProvider>();

    return Scaffold(
      backgroundColor: AppTheme.creamyBackground,
      appBar: AppBar(
        title: const Text('Store & Stall Settings'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Store Status Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          admin.isShopOpen ? Icons.storefront : Icons.storefront_outlined,
                          color: admin.isShopOpen ? AppTheme.successGreen : Colors.red,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Main Shop Status',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                              ),
                              Text(
                                admin.isShopOpen ? 'Store is open for customer orders' : 'Store is currently closed',
                                style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                        Switch(
                          value: admin.isShopOpen,
                          activeTrackColor: Colors.green.withOpacity(0.4),
                          activeThumbColor: Colors.green,
                          onChanged: (val) {
                            admin.toggleShopStatus(val);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Notification Tester Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.notifications_active_outlined, color: AppTheme.primaryAmber),
                        SizedBox(width: 8),
                        Text(
                          'Push Notification System',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Test your phone status bar notification banner & order chime:',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.notifications_active),
                        label: const Text('TRIGGER TEST NOTIFICATION BANNER'),
                        onPressed: () async {
                          final messenger = ScaffoldMessenger.of(context);
                          await NotificationService.instance.showTestNotification();
                          if (mounted) {
                            messenger.showSnackBar(
                              const SnackBar(content: Text('Test notification banner sent! Check top of your phone screen.')),
                            );
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Pop-Up Stall Schedule Manager
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.event_outlined, color: AppTheme.primaryAmber),
                        SizedBox(width: 8),
                        Text(
                          'Pop-Up Stall Event Schedule',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Set start/end dates & times to activate the Pop-Up Banner & Menu on waffleda.in:',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                    ),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _stallStartDateController,
                            style: const TextStyle(color: AppTheme.textDark),
                            decoration: const InputDecoration(
                              labelText: 'Start Date (YYYY-MM-DD)',
                              hintText: '2026-03-17',
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _stallEndDateController,
                            style: const TextStyle(color: AppTheme.textDark),
                            decoration: const InputDecoration(
                              labelText: 'End Date (YYYY-MM-DD)',
                              hintText: '2026-03-18',
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _stallStartTimeController,
                            style: const TextStyle(color: AppTheme.textDark),
                            decoration: const InputDecoration(
                              labelText: 'Start Time (HH:MM)',
                              hintText: '10:00',
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _stallEndTimeController,
                            style: const TextStyle(color: AppTheme.textDark),
                            decoration: const InputDecoration(
                              labelText: 'End Time (HH:MM)',
                              hintText: '22:00',
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          admin.updateStallSchedule(
                            startDate: _stallStartDateController.text.trim(),
                            endDate: _stallEndDateController.text.trim(),
                            startTime: _stallStartTimeController.text.trim(),
                            endTime: _stallEndTimeController.text.trim(),
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Pop-Up Stall Schedule updated!')),
                          );
                        },
                        child: const Text('SAVE STALL SCHEDULE'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Pop-Up Stall Banner Announcement Settings
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.campaign_outlined, color: AppTheme.accentCoral),
                        SizedBox(width: 8),
                        Text(
                          'Pop-Up Stall Banner Announcement',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    TextField(
                      controller: _stallBannerTitleController,
                      style: const TextStyle(color: AppTheme.textDark),
                      decoration: const InputDecoration(
                        labelText: 'Banner Title',
                        hintText: '🎉 Waffle Da Pop-Up Stall',
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _stallBannerSubtitleController,
                      style: const TextStyle(color: AppTheme.textDark),
                      decoration: const InputDecoration(
                        labelText: 'Banner Subtitle',
                        hintText: 'Come visit us! Fresh waffles, shakes & more 🧇',
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _stallBannerLinkTextController,
                      style: const TextStyle(color: AppTheme.textDark),
                      decoration: const InputDecoration(
                        labelText: 'Button Link Text',
                        hintText: 'View Stall Menu',
                      ),
                    ),
                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          admin.updateStallBanner(
                            title: _stallBannerTitleController.text.trim(),
                            subtitle: _stallBannerSubtitleController.text.trim(),
                            linkText: _stallBannerLinkTextController.text.trim(),
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Stall Banner announcement updated!')),
                          );
                        },
                        child: const Text('UPDATE BANNER ANNOUNCEMENT'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Featured Stall Items Selection
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.check_box_outlined, color: AppTheme.primaryAmber),
                        SizedBox(width: 8),
                        Text(
                          'Select Featured Stall Products',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Check the items to include on the special Pop-Up Stall Menu:',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                    ),
                    const SizedBox(height: 12),
                    if (admin.menuItems.isEmpty)
                      const Text('No menu items loaded.', style: TextStyle(color: AppTheme.textMuted))
                    else
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: admin.menuItems.length,
                        itemBuilder: (context, index) {
                          final item = admin.menuItems[index];
                          final isSelected = admin.stallItemIds.contains(item.id);
                          return CheckboxListTile(
                            title: Text(item.name, style: const TextStyle(color: AppTheme.textDark, fontWeight: FontWeight.w600)),
                            subtitle: Text('₹${item.price.toStringAsFixed(0)} • ${item.category}',
                                style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                            value: isSelected,
                            activeColor: AppTheme.primaryAmber,
                            onChanged: (_) {
                              admin.toggleStallItem(item.id);
                            },
                          );
                        },
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Delivery Fee Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Delivery Fee Configuration',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Standard delivery fee applied to customer checkout orders:',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _deliveryFeeController,
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: AppTheme.textDark),
                            decoration: const InputDecoration(
                              prefixText: '₹ ',
                              labelText: 'Delivery Fee (₹)',
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          onPressed: () {
                            final fee = double.tryParse(_deliveryFeeController.text);
                            if (fee != null) {
                              admin.updateDeliveryFee(fee);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Delivery fee updated successfully!')),
                              );
                            }
                          },
                          child: const Text('Update'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Logout Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.redAccent,
                  side: const BorderSide(color: Colors.redAccent),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.logout),
                label: const Text('LOGOUT FROM ADMIN', style: TextStyle(fontWeight: FontWeight.bold)),
                onPressed: () async {
                  await SupabaseService.instance.logout();
                  widget.onLogout();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
