class AppConstants {
  static const String appName = 'Waffle Da Express Admin';
  
  // Live Supabase Configuration
  static const String supabaseUrl = 'https://ytlyquodnssesdcyrdrf.supabase.co';
  static const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0bHlxdW9kbnNzZXNkY3lyZHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzA4MzgsImV4cCI6MjA5NTYwNjgzOH0.me5tLzD17_1zoi7jHNp_il8BajLxkcVAEOMyc5ojfn0';

  // Order Status Constants
  static const List<String> orderStatuses = [
    'Order Received',
    'Preparing',
    'Out for Delivery',
    'Delivered',
    'Can\'t be Delivered',
  ];
}
