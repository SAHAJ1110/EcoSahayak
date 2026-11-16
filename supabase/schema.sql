-- ==============================================================================
-- EcoSahayak (इको सहायक) — Complete PostgreSQL & Supabase Database Schema
-- Run this script in the Supabase SQL Editor to set up tables, RLS & triggers
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
    eco_points INTEGER NOT NULL DEFAULT 0,
    badge_level TEXT NOT NULL DEFAULT 'Eco Starter' CHECK (badge_level IN ('Eco Starter', 'Eco Warrior', 'Green Guardian', 'Eco Hero')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_phone TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('garbage', 'pothole', 'water_leakage', 'blocked_drainage', 'broken_streetlight', 'waterlogging', 'other')),
    tags TEXT[] DEFAULT '{}',
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    ai_severity TEXT CHECK (ai_severity IN ('low', 'medium', 'high', 'critical')),
    ai_confidence NUMERIC(5,2),
    ai_suggested_action TEXT,
    ai_detected_issue TEXT,
    affected_population_estimate INTEGER DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected', 'merged')),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address TEXT NOT NULL,
    landmark TEXT,
    image_url TEXT,
    voice_transcript TEXT,
    supporter_count INTEGER NOT NULL DEFAULT 1,
    master_complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    is_duplicate BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    resolution_image_url TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    points_awarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for geospatial/proximity queries and category filtering
CREATE INDEX IF NOT EXISTS idx_complaints_coords ON public.complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON public.complaints(user_id);

-- 4. Complaint Supporters Table (ensures 1 vote per user per complaint)
CREATE TABLE IF NOT EXISTS public.complaint_supporters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(complaint_id, user_id)
);

-- 5. Complaint Status History Audit Table
CREATE TABLE IF NOT EXISTS public.status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    changed_by_name TEXT NOT NULL,
    old_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Eco Rewards History Table
CREATE TABLE IF NOT EXISTS public.eco_rewards_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    tracking_id TEXT NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    awarded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Drone Surveys Table (Admin Aerial Inspection)
CREATE TABLE IF NOT EXISTS public.drone_surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    location_label TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    altitude_meters NUMERIC(6, 2) DEFAULT 45.0,
    image_url TEXT NOT NULL,
    detections JSONB NOT NULL DEFAULT '[]'::jsonb,
    converted_to_complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'scanned' CHECK (status IN ('scanned', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_rewards_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drone_surveys ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone authenticated can read profiles; users can update own profile
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Complaints:
-- 1. All authenticated users can view complaints (for community transparency and heatmap)
CREATE POLICY "Complaints are viewable by authenticated users"
ON public.complaints FOR SELECT TO authenticated USING (true);

-- 2. Citizens can insert complaints
CREATE POLICY "Authenticated users can create complaints"
ON public.complaints FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Citizens can update their own pending complaints
CREATE POLICY "Citizens can edit their own pending complaints"
ON public.complaints FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

-- 4. Admins have full management access to update/resolve complaints
CREATE POLICY "Admins have full update access"
ON public.complaints FOR UPDATE TO authenticated
USING (public.is_admin());

-- Supporters:
CREATE POLICY "Users can view supporters"
ON public.complaint_supporters FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add support"
ON public.complaint_supporters FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Drone Surveys:
CREATE POLICY "Only admins can view and manage drone surveys"
ON public.drone_surveys FOR ALL TO authenticated
USING (public.is_admin());

-- Storage Bucket Setup for civic uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-images', 'complaint-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read complaint images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'complaint-images');

CREATE POLICY "Authenticated users can upload complaint images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'complaint-images');
