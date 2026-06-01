import { useCallback, useEffect, useState } from "react";
import { sanityClient, isSanityConfigured } from "./client";
import {
  aboutQuery,
  contactQuery,
  experienceQuery,
  heroQuery,
  portfolioQuery,
  servicesQuery,
  skillsQuery,
} from "./queries";
import {
  defaultAbout,
  defaultContact,
  defaultExperience,
  defaultHero,
  defaultServices,
  defaultSkills,
} from "./defaults";
import type {
  AboutDocument,
  ContactDocument,
  ExperienceDocument,
  HeroDocument,
  PortfolioDocument,
  ServiceDocument,
  SkillDocument,
} from "./types";

interface CmsResult<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

function useSanityData<T>(query: string, fallback: T): CmsResult<T> {
  const [data, setData] = useState(fallback);
  const [isLoading, setIsLoading] = useState(isSanityConfigured);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const refresh = useCallback(() => setRequestId((value) => value + 1), []);

  useEffect(() => {
    if (!isSanityConfigured) return;
    let active = true;
    setIsLoading(true);
    sanityClient
      .fetch<T | null>(query)
      .then((result) => {
        if (active && result && (!Array.isArray(result) || result.length > 0)) {
          setData(result);
        }
      })
      .catch((reason: unknown) => {
        console.error("[Sanity]", reason);
        if (active) setError("Content could not be loaded from Sanity.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, requestId]);

  return { data, isLoading, error, refresh };
}

export const useHero = () => useSanityData<HeroDocument>(heroQuery, defaultHero);
export const useAbout = () => useSanityData<AboutDocument>(aboutQuery, defaultAbout);
export const useServices = () =>
  useSanityData<ServiceDocument[]>(servicesQuery, defaultServices);
export const useSkills = () => useSanityData<SkillDocument[]>(skillsQuery, defaultSkills);
export const useExperience = () =>
  useSanityData<ExperienceDocument[]>(experienceQuery, defaultExperience);
export const usePortfolio = () =>
  useSanityData<PortfolioDocument[]>(portfolioQuery, []);
export const useContact = () =>
  useSanityData<ContactDocument>(contactQuery, defaultContact);
