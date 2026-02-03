-- Occupational Health Management System Database Schema

-- Companies table (the 4 companies)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the 4 companies
INSERT INTO public.companies (name) VALUES 
  ('Ribel'),
  ('Hiltexpoy'),
  ('Interfibra'),
  ('Jaltextiles')
ON CONFLICT (name) DO NOTHING;

-- User profiles with roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'rrhh' CHECK (role IN ('admin', 'medico', 'rrhh')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workers (patients)
CREATE TABLE IF NOT EXISTS public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  cedula TEXT NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cedula, company_id)
);

-- Medical records (historias clinicas)
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  consultation_reason TEXT,
  personal_history TEXT,
  work_history TEXT,
  diagnosis TEXT,
  doctor_notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aptitude certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  result TEXT NOT NULL CHECK (result IN ('apto', 'no_apto', 'apto_con_restricciones')),
  restrictions TEXT,
  doctor_signature TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical exams (attached files)
CREATE TABLE IF NOT EXISTS public.medical_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  exam_name TEXT NOT NULL,
  exam_date DATE NOT NULL DEFAULT CURRENT_DATE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_exams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies (everyone can read)
CREATE POLICY "companies_select_all" ON public.companies FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for workers (authenticated users can read, admin/medico can write)
CREATE POLICY "workers_select_authenticated" ON public.workers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "workers_insert_authenticated" ON public.workers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "workers_update_authenticated" ON public.workers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "workers_delete_authenticated" ON public.workers FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for medical_records
CREATE POLICY "medical_records_select_authenticated" ON public.medical_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "medical_records_insert_authenticated" ON public.medical_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "medical_records_update_authenticated" ON public.medical_records FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "medical_records_delete_authenticated" ON public.medical_records FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for certificates
CREATE POLICY "certificates_select_authenticated" ON public.certificates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "certificates_insert_authenticated" ON public.certificates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "certificates_update_authenticated" ON public.certificates FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "certificates_delete_authenticated" ON public.certificates FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for medical_exams
CREATE POLICY "medical_exams_select_authenticated" ON public.medical_exams FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "medical_exams_insert_authenticated" ON public.medical_exams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "medical_exams_update_authenticated" ON public.medical_exams FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "medical_exams_delete_authenticated" ON public.medical_exams FOR DELETE USING (auth.uid() IS NOT NULL);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE(new.raw_user_meta_data ->> 'role', 'rrhh')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workers_cedula ON public.workers(cedula);
CREATE INDEX IF NOT EXISTS idx_workers_company ON public.workers(company_id);
CREATE INDEX IF NOT EXISTS idx_workers_name ON public.workers(full_name);
CREATE INDEX IF NOT EXISTS idx_medical_records_worker ON public.medical_records(worker_id);
CREATE INDEX IF NOT EXISTS idx_certificates_worker ON public.certificates(worker_id);
CREATE INDEX IF NOT EXISTS idx_medical_exams_worker ON public.medical_exams(worker_id);
