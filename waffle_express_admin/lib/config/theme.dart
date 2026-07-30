import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Clean Creamy & Soft White Palette
  static const Color creamyBackground = Color(0xFFF9F6F2); // Warm Creamy Vanilla
  static const Color cardSurface = Color(0xFFFFFFFF);     // Pure Clean White
  static const Color cardBorder = Color(0xFFE5DEDA);      // Soft Subtle Border
  static const Color primaryAmber = Color(0xFFD97706);    // Rich Warm Honey Amber
  static const Color accentCoral = Color(0xFFE05A47);     // Elegant Coral
  static const Color textDark = Color(0xFF1F2937);        // Deep Charcoal
  static const Color textMuted = Color(0xFF6B7280);       // Warm Muted Slate
  static const Color successGreen = Color(0xFF059669);    // Mint Emerald
  static const Color warningOrange = Color(0xFFEA580C);   // Warm Orange

  static ThemeData get lightTheme {
    return ThemeData.light().copyWith(
      scaffoldBackgroundColor: creamyBackground,
      colorScheme: const ColorScheme.light(
        primary: primaryAmber,
        secondary: accentCoral,
        surface: cardSurface,
        onSurface: textDark,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.light().textTheme).copyWith(
        displayLarge: GoogleFonts.outfit(color: textDark, fontWeight: FontWeight.bold),
        titleLarge: GoogleFonts.outfit(color: textDark, fontWeight: FontWeight.w700),
        titleMedium: GoogleFonts.outfit(color: textDark, fontWeight: FontWeight.w600),
        bodyLarge: GoogleFonts.outfit(color: textDark),
        bodyMedium: GoogleFonts.outfit(color: textMuted),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: cardSurface,
        elevation: 0.5,
        centerTitle: false,
        titleTextStyle: GoogleFonts.outfit(
          color: textDark,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        iconTheme: const IconThemeData(color: textDark),
      ),
      cardTheme: CardThemeData(
        color: cardSurface,
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: cardBorder, width: 1),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: cardSurface,
        hintStyle: const TextStyle(color: textMuted),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: cardBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: cardBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: primaryAmber, width: 1.5),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryAmber,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
        ),
      ),
    );
  }
}
