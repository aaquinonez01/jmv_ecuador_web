"use client";

import { useEffect, useState } from "react";
import { getAllScopes } from "@/actions/categories-posts/get-all-scopes";
import { getAllActivityTypes } from "@/actions/categories-posts/get-all-activity-types";
import { getSubtypesByActivityType } from "@/actions/categories-posts/get-subtypes-by-activity-type";

type Id = string;

export function usePostCategories(preload?: {
  scopeId?: Id;
  activityTypeId?: Id;
  subtypeId?: Id;
}) {
  const [scopes, setScopes] = useState<any[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);

  const [scopeId, setScopeId] = useState<Id | undefined>(preload?.scopeId);
  const [activityTypeId, setActivityTypeId] = useState<Id | undefined>(
    preload?.activityTypeId
  );
  const [subtypeId, setSubtypeId] = useState<Id | undefined>(
    preload?.subtypeId
  );

  const [loading, setLoading] = useState({
    scopes: false,
    activityTypes: false,
    subtypes: false,
  });
  const [errors, setErrors] = useState<{
    scopes?: string;
    activityTypes?: string;
    subtypes?: string;
  }>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading((s) => ({ ...s, scopes: true }));
        const list = await getAllScopes();
        if (alive) setScopes(list);
      } catch {
        if (alive)
          setErrors((e) => ({
            ...e,
            scopes: "No se pudieron cargar los ámbitos",
          }));
      } finally {
        if (alive) setLoading((s) => ({ ...s, scopes: false }));
      }
    })();
    (async () => {
      try {
        setLoading((s) => ({ ...s, activityTypes: true }));
        const list = await getAllActivityTypes();
        if (alive) setActivityTypes(list);
      } catch {
        if (alive)
          setErrors((e) => ({
            ...e,
            activityTypes: "No se pudieron cargar las actividades",
          }));
      } finally {
        if (alive) setLoading((s) => ({ ...s, activityTypes: false }));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    if (!activityTypeId) {
      setSubtypes([]);
      setSubtypeId(undefined);
      return;
    }
    (async () => {
      try {
        setLoading((s) => ({ ...s, subtypes: true }));
        const list = await getSubtypesByActivityType(activityTypeId);
        if (!alive) return;
        setSubtypes(list);
        if (subtypeId && !list.some((s) => s.id === subtypeId))
          setSubtypeId(undefined);
      } catch {
        if (alive)
          setErrors((e) => ({
            ...e,
            subtypes: "No se pudieron cargar las sub-actividades",
          }));
        setSubtypes([]);
        setSubtypeId(undefined);
      } finally {
        if (alive) setLoading((s) => ({ ...s, subtypes: false }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [activityTypeId]);

  return {
    scopes,
    activityTypes,
    subtypes,
    scopeId,
    activityTypeId,
    subtypeId,
    setScopeId,
    setActivityTypeId: (id?: Id) => {
      setActivityTypeId(id);
      setSubtypeId(undefined);
      setSubtypes([]);
    },
    setSubtypeId,
    loading,
    errors,
  };
}
