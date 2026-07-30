import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/menu_item_model.dart';
import '../../providers/admin_provider.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AdminProvider>().fetchMenuItems();
    });
  }

  void _showProductDialog([MenuItemModel? item]) {
    showDialog(
      context: context,
      builder: (ctx) => _ProductFormDialog(item: item),
    );
  }

  @override
  Widget build(BuildContext context) {
    final admin = context.watch<AdminProvider>();

    final categories = ['All', ...admin.menuItems.map((e) => e.category).toSet()];

    final filteredItems = admin.menuItems.where((item) {
      final query = _searchController.text.toLowerCase();
      final matchesQuery = item.name.toLowerCase().contains(query) || item.description.toLowerCase().contains(query);
      final matchesCategory = _selectedCategory == 'All' || item.category == _selectedCategory;
      return matchesQuery && matchesCategory;
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.creamyBackground,
      appBar: AppBar(
        title: const Text('Menu & Products'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: AppTheme.primaryAmber),
            onPressed: () => _showProductDialog(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryAmber,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Add Product', style: TextStyle(fontWeight: FontWeight.bold)),
        onPressed: () => _showProductDialog(),
      ),
      body: Column(
        children: [
          // Search & Category Filter
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  style: const TextStyle(color: AppTheme.textDark),
                  decoration: InputDecoration(
                    hintText: 'Search products by name or description...',
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
                    children: categories.map((cat) {
                      final isSelected = _selectedCategory == cat;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: isSelected,
                          selectedColor: AppTheme.primaryAmber,
                          backgroundColor: AppTheme.cardSurface,
                          side: BorderSide(color: isSelected ? AppTheme.primaryAmber : AppTheme.cardBorder),
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : AppTheme.textDark,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          onSelected: (_) {
                            setState(() {
                              _selectedCategory = cat;
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

          // Products List
          Expanded(
            child: admin.isLoadingMenu
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryAmber))
                : filteredItems.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.restaurant_menu, size: 54, color: AppTheme.textMuted),
                            const SizedBox(height: 12),
                            Text(
                              'No menu items found.',
                              style: TextStyle(color: AppTheme.textMuted, fontSize: 16),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: filteredItems.length,
                        itemBuilder: (context, index) {
                          final item = filteredItems[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Row(
                                children: [
                                  // Veg/NonVeg Indicator
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                        color: item.isVeg ? AppTheme.successGreen : Colors.red,
                                        width: 1.5,
                                      ),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Icon(
                                      Icons.circle,
                                      size: 10,
                                      color: item.isVeg ? AppTheme.successGreen : Colors.red,
                                    ),
                                  ),
                                  const SizedBox(width: 12),

                                  // Info
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.name,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                            color: AppTheme.textDark,
                                          ),
                                        ),
                                        if (item.description.isNotEmpty) ...[
                                          const SizedBox(height: 4),
                                          Text(
                                            item.description,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                                          ),
                                        ],
                                        const SizedBox(height: 6),
                                        Text(
                                          '₹${item.price.toStringAsFixed(0)}',
                                          style: const TextStyle(
                                            color: AppTheme.primaryAmber,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  // Availability Switch
                                  Column(
                                    children: [
                                      Switch(
                                        value: item.available,
                                        activeTrackColor: AppTheme.primaryAmber.withOpacity(0.4),
                                        activeThumbColor: AppTheme.primaryAmber,
                                        onChanged: (val) {
                                          admin.toggleMenuItemAvailability(item.id, val);
                                        },
                                      ),
                                      Text(
                                        item.available ? 'Available' : 'Sold Out',
                                        style: TextStyle(
                                          color: item.available ? AppTheme.successGreen : Colors.red,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),

                                  IconButton(
                                    icon: const Icon(Icons.edit_outlined, color: AppTheme.textMuted),
                                    onPressed: () => _showProductDialog(item),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

class _ProductFormDialog extends StatefulWidget {
  final MenuItemModel? item;
  const _ProductFormDialog({this.item});

  @override
  State<_ProductFormDialog> createState() => _ProductFormDialogState();
}

class _ProductFormDialogState extends State<_ProductFormDialog> {
  final _formKey = GlobalKey<FormState>();
  late String _name;
  late String _description;
  late double _price;
  late String _category;
  late bool _isVeg;
  late bool _available;

  @override
  void initState() {
    super.initState();
    _name = widget.item?.name ?? '';
    _description = widget.item?.description ?? '';
    _price = widget.item?.price ?? 0.0;
    _category = widget.item?.category ?? 'Waffles';
    _isVeg = widget.item?.isVeg ?? true;
    _available = widget.item?.available ?? true;
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.item != null;
    return AlertDialog(
      backgroundColor: AppTheme.cardSurface,
      title: Text(
        isEditing ? 'Edit Product' : 'Add New Product',
        style: const TextStyle(color: AppTheme.textDark, fontWeight: FontWeight.bold),
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                initialValue: _name,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Product Name'),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                onSaved: (v) => _name = v!,
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
                initialValue: _price > 0 ? _price.toString() : '',
                keyboardType: TextInputType.number,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Price (₹)'),
                validator: (v) => v == null || double.tryParse(v) == null ? 'Invalid price' : null,
                onSaved: (v) => _price = double.parse(v!),
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: _category,
                style: const TextStyle(color: AppTheme.textDark),
                decoration: const InputDecoration(labelText: 'Category (e.g. Waffles, Drinks)'),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                onSaved: (v) => _category = v!,
              ),
              const SizedBox(height: 12),
              SwitchListTile(
                title: const Text('Is Vegetarian?'),
                value: _isVeg,
                onChanged: (val) => setState(() => _isVeg = val),
              ),
              SwitchListTile(
                title: const Text('Available in Stock?'),
                value: _available,
                onChanged: (val) => setState(() => _available = val),
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
              final newItem = MenuItemModel(
                id: widget.item?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
                name: _name,
                description: _description,
                price: _price,
                category: _category,
                isVeg: _isVeg,
                available: _available,
                sortOrder: widget.item?.sortOrder ?? 0,
                createdAt: widget.item?.createdAt ?? DateTime.now(),
              );
              context.read<AdminProvider>().saveMenuItem(newItem);
              Navigator.pop(context);
            }
          },
          child: Text(isEditing ? 'Save Changes' : 'Add Product'),
        ),
      ],
    );
  }
}
