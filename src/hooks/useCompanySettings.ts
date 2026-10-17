import { useState, useEffect } from "react";
import { fetchCompanySettings } from "@/lib/public.functions";
import { company } from "@/lib/content";

export interface CompanySettings {
  id?: number;
  email?: string;
  mobile_number?: string;
  location?: string;
  twitter_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  reddit_url?: string;
  threads_url?: string;
  [key: string]: any;
}

let cachedSettings: CompanySettings | null = null;
const subscribers = new Set<(s: CompanySettings | null) => void>();

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(cachedSettings);
  const [loading, setLoading] = useState<boolean>(!cachedSettings);

  useEffect(() => {
    let active = true;

    const listener = (newSettings: CompanySettings | null) => {
      if (active) setSettings(newSettings);
    };
    subscribers.add(listener);

    fetchCompanySettings()
      .then((data) => {
        if (!active) return;
        if (data) {
          cachedSettings = data;
          subscribers.forEach((sub) => sub(data));
        }
      })
      .catch((err) => {
        console.error("Error fetching company settings:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      subscribers.delete(listener);
    };
  }, []);

  return {
    settings,
    email: settings?.email || company.email,
    phone: settings?.mobile_number || company.phone,
    address: settings?.location || company.address,
    companyName: company.name,
    shortName: company.short,
    loading,
  };
}
