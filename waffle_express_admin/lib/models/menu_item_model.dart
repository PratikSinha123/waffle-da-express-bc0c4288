class MenuItemModel {
  final String id;
  final String name;
  final String description;
  final double price;
  final String? priceLabel;
  final double? price2;
  final String? priceLabel2;
  final String category;
  final bool isVeg;
  final bool available;
  final int sortOrder;
  final DateTime createdAt;

  MenuItemModel({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.priceLabel,
    this.price2,
    this.priceLabel2,
    required this.category,
    required this.isVeg,
    required this.available,
    required this.sortOrder,
    required this.createdAt,
  });

  factory MenuItemModel.fromJson(Map<String, dynamic> json) {
    return MenuItemModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      priceLabel: json['price_label']?.toString(),
      price2: (json['price2'] as num?)?.toDouble(),
      priceLabel2: json['price_label2']?.toString(),
      category: json['category']?.toString() ?? 'Waffles',
      isVeg: json['is_veg'] ?? true,
      available: json['available'] ?? true,
      sortOrder: (json['sort_order'] as num?)?.toInt() ?? 0,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'price': price,
        'price_label': priceLabel,
        'price2': price2,
        'price_label2': priceLabel2,
        'category': category,
        'is_veg': isVeg,
        'available': available,
        'sort_order': sortOrder,
      };

  MenuItemModel copyWith({
    String? name,
    String? description,
    double? price,
    String? category,
    bool? isVeg,
    bool? available,
    int? sortOrder,
  }) {
    return MenuItemModel(
      id: id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      priceLabel: priceLabel,
      price2: price2,
      priceLabel2: priceLabel2,
      category: category ?? this.category,
      isVeg: isVeg ?? this.isVeg,
      available: available ?? this.available,
      sortOrder: sortOrder ?? this.sortOrder,
      createdAt: createdAt,
    );
  }
}
