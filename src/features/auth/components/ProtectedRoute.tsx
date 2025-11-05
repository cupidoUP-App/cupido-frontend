import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { photoAPI } from '@/lib/api';

const ProtectedRoute = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['hasPhotosCheck'],
    queryFn: photoAPI.checkHasPhotos,
    retry: 1, // Only retry once
  });

  if (isLoading) {
    return <div>loading...</div>; // Or a spinner component
  }

  if (isError) {
    // Handle error, maybe redirect to login or show an error page
    return <Navigate to="/login" replace />; // Assuming a /login route exists
  }

  if (data && !data.has_photos) {
    // If user has no photos, redirect to the photo upload page
    return <Navigate to="/photos" replace />;
  }

  // If user has photos, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
