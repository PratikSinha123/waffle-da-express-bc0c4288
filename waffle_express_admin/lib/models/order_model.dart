import 'dart:convert';

class OrderItemModel {
  final String name;
  final int quantity;
  final double price;

  OrderItemModel({
    required this.name,
    required this.quantity,
    required this.price,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    // Handle nested menuItem if present or flat structure
    String name = 'Item';
    double price = 0.0;
    int qty = (json['quantity'] as num?)?.toInt() ?? 1;

    if (json['menuItem'] != null && json['menuItem'] is Map) {
      name = json['menuItem']['name']?.toString() ?? 'Item';
      price = (json['menuItem']['price'] as num?)?.toDouble() ?? 0.0;
    } else if (json['name'] != null) {
      name = json['name'].toString();
      price = (json['price'] as num?)?.toDouble() ?? 0.0;
    }

    return OrderItemModel(
      name: name,
      quantity: qty,
      price: price,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'quantity': quantity,
        'price': price,
      };
}

class OrderModel {
  final String id;
  final String customerName;
  final String phone;
  final String address;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String status;
  final String paymentMethod;
  final String orderType;
  final String notes;
  final bool seen;
  final DateTime createdAt;
  final List<OrderItemModel> items;

  OrderModel({
    required this.id,
    required this.customerName,
    required this.phone,
    required this.address,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    required this.status,
    required this.paymentMethod,
    required this.orderType,
    required this.notes,
    required this.seen,
    required this.createdAt,
    required this.items,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    List<OrderItemModel> parsedItems = [];
    if (json['items'] != null) {
      dynamic itemsJson = json['items'];
      if (itemsJson is String) {
        try {
          itemsJson = jsonDecode(itemsJson);
        } catch (_) {}
      }
      if (itemsJson is List) {
        parsedItems = itemsJson.map((i) => OrderItemModel.fromJson(i as Map<String, dynamic>)).toList();
      }
    }

    return OrderModel(
      id: json['id']?.toString() ?? '',
      customerName: json['customer_name']?.toString() ?? 'Guest Customer',
      phone: json['phone']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      deliveryFee: (json['delivery_fee'] as num?)?.toDouble() ?? 0.0,
      total: (json['total'] as num?)?.toDouble() ?? 0.0,
      status: json['status']?.toString() ?? 'Order Received',
      paymentMethod: json['payment_method']?.toString() ?? 'Cash/UPI',
      orderType: json['order_type']?.toString() ?? 'Delivery',
      notes: json['notes']?.toString() ?? '',
      seen: json['seen'] == true,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      items: parsedItems,
    );
  }
}
