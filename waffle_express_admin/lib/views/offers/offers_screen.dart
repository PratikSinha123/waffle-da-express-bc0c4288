import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/offer_model.dart';
import '../../providers/admin_provider.dart';

class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key});

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AdminProvider>().fetchOffers();
    });
  }

  void _showOfferDialog([OfferModel? offer]) {
    showDialog(
      context: context,
      builder: (ctx) => _OfferFormDialog(offer: offer),
    );
  }

  @override
  Widget build(BuildContext context) {
    final admin = context.watch<AdminProvider>();

    return Scaffold(
      backgroundColor: AppTheme.creamyBackground,
      appBar: AppBar(
        title: const Text('Discounts & Offers'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryAmber,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.local_offer),
        label: const Text('Add Offer', style: TextStyle(fontWeight: FontWeight.bold)),
        onPressed: () => _showOfferDialog(),
      ),
      body: admin.isLoadingOffers
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryAmber))
          : admin.offers.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.local_offer_outlined, size: 54, color: AppTheme.textMuted),
                      const SizedBox(height: 12),
                      Text('No active discount codes.', style: TextStyle(color: AppTheme.textMuted, fontSize: 16)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: admin.offers.length,
                  itemBuilder: (context, index) {
                    final offer = admin.offers[index];
                    final discountText = offer.discountPercent != null
                        ? '${offer.discountPercent!.toStringAsFixed(0)}% OFF'
                        : '₹${offer.discountFlat?.toStringAsFixed(0) ?? 0} OFF';

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryAmber.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.local_offer, color: AppTheme.primaryAmber),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: AppTheme.creamyBackground,
                                          borderRadius: BorderRadius.circular(6),
                                          border: Border.all(color: AppTheme.cardBorder),
                                        ),
                                        child: Text(
                                          offer.code,
                                          style: const TextStyle(
                                            fontFamily: 'Monospace',
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.primaryAmber,
                                            fontSize: 13,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        discountText,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: AppTheme.accentCoral,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    offer.title,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark),
                                  ),
                                  if (offer.description.isNotEmpty)
                                    Text(
                                      offer.description,
                                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                                    ),
                                ],
                              ),
                            ),
                            Switch(
                              value: offer.isActive,
                              activeTrackColor: AppTheme.primaryAmber.withOpacity(0.4),
                              activeThumbColor: AppTheme.primaryAmber,
                              onChanged: (val) {
                                admin.toggleOfferActive(offer.id, val);
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                              onPressed: () {
                                admin.deleteOffer(offer.id);
                              },
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}

class _OfferFormDialog extends StatefulWidget {
  final OfferModel? offer;
  const _OfferFormDialog({this.offer});

  @override
  State<_OfferFormDialog> createState() => _OfferFormDialogState();
}

class _OfferFormDialogState extends State<_OfferFormDialog> {
  final _formKey = GlobalKey<FormState>();
  late String _code;
  late String _title;
  late String _description;
  double? _discountPercent;
  double? _discountFlat;

  @override
  void initState() {
    super.initState();
    _code = widget.offer?.code ?? '';
    _title = widget.offer?.title ?? '';
    _description = widget.offer?.description ?? '';
    _discountPercent = widget.offer?.discountPercent;
    _discountFlat = widget.offer?.discountFlat;
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.offer != null;
    return AlertDialog(
      backgroundColor: AppTheme.cardSurface,
      title: Text(
        isEditing ? 'Edit Coupon Offer' : 'Create New Offer',
        style: const TextStyle(color: AppTheme.textDark, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                initialValue: _code,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Coupon Code (e.g. WAFFLE50)'),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                onSaved: (v) => _code = v!.toUpperCase(),
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: _title,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Offer Title'),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                onSaved: (v) => _title = v!,
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: _description,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Description'),
                onSaved: (v) => _description = v ?? '',
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: _discountPercent?.toString() ?? '',
                keyboardType: TextInputType.number,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Discount Percentage (%)'),
                onSaved: (v) => _discountPercent = double.tryParse(v ?? ''),
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: _discountFlat?.toString() ?? '',
                keyboardType: TextInputType.number,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Flat Discount Amount (₹)'),
                onSaved: (v) => _discountFlat = double.tryParse(v ?? ''),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel', style: TextStyle(color: AppTheme.textMuted)),
        ),
        ElevatedButton(
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              _formKey.currentState!.save();
              final offer = OfferModel(
                id: widget.offer?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
                code: _code,
                title: _title,
                description: _description,
                discountPercent: _discountPercent,
                discountFlat: _discountFlat,
                isActive: widget.offer?.isActive ?? true,
                validUntil: widget.offer?.validUntil ?? DateTime.now().add(const Duration(days: 30)),
              );
              context.read<AdminProvider>().saveOffer(offer);
              Navigator.pop(context);
            }
          },
          child: Text(isEditing ? 'Save Changes' : 'Create Offer'),
        ),
      ],
    );
  }
}
