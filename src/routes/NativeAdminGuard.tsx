import React from "react";
import { Navigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

interface NativeAdminGuardProps {
  children: React.ReactNode;
}

/**
 * Route guard that ensures admin routes are accessible only inside
 * the native mobile application (Capacitor). Web browser requests are redirected to Home.
 */
const NativeAdminGuard: React.FC<NativeAdminGuardProps> = ({ children }) => {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default NativeAdminGuard;
