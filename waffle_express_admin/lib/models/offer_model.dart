class OfferModel {
  final String id;
  final String code;
  final String title;
  final String description;
  final double? discountPercent;
  final double? discountFlat;
  final bool isActive;
  final DateTime validUntil;

  OfferModel({
    required this.id,
    required this.code,
    required this.title,
    required this.description,
    this.discountPercent,
    this.discountFlat,
    required this.isActive,
    required this.validUntil,
  });

  factory OfferModel.fromJson(Map<String, dynamic> json) {
    return OfferModel(
      id: json['id']?.toString() ?? '',
      code: json['code']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      discountPercent: (json['discount_percent'] as num?)?.toDouble(),
      discountFlat: (json['discount_flat'] as num?)?.toDouble(),
      isActive: json['is_active'] ?? true,
      validUntil: json['valid_until'] != null
          ? DateTime.tryParse(json['valid_until'].toString()) ?? DateTime.now().add(const Duration(days: 30))
          : DateTime.now().add(const Duration(days: 30)),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'code': code,
        'title': title,
        'description': description,
        'discount_percent': discountPercent,
        'discount_flat': discountFlat,
        'is_active': isActive,
        'valid_until': validUntil.toIso8601String(),
      };
}
