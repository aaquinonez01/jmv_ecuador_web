"use client";

import { useEffect, useState } from "react";
import { getAllScopes } from "@/actions/categories-posts/get-all-scopes";
import { getAllActivityTypes } from "@/actions/categories-posts/get-all-activity-types";
import { getSubtypesByActivityType } from "@/actions/categories-posts/get-subtypes-by-activity-type";
import type { BlogCategory } from "@/types/user";

// Caché a nivel de módulo: una sola petición por lista y por carga de página
let scopesPromise: Promise<BlogCategory[]> | null = null;
let activityTypesPromise: Promise<BlogCategory[]> | null = null;
const subtypesPromises = new Map<string, Promise<BlogCategory[]>>();

function once(
  get: () => Promise<BlogCategory[]> | null,
  set: (p: Promise<BlogCategory[]> | null) => void,
  load: () => Promise<Array<{ id: string; name: string }>>
) {
  let p = get();
  if (!p) {
    p = load()
      .then((list) => list.map(({ id, name }) => ({ id, name })))
      .catch((err) => {
        set(null);
        throw err;
      });
    set(p);
  }
  return p;
}

/**
 * Alcances y tipos de actividad. Si el servidor ya los envió no se piden de nuevo.
 * Se llama una vez (en BlogClient) y se pasa por props.
 */
export function usePostCategories(initial?: {
  scopes?: BlogCategory[];
  activityTypes?: BlogCategory[];
}) {
  const [scopes, setScopes] = useState<BlogCategory[]>(initial?.scopes ?? []);
  const [activityTypes, setActivityTypes] = useState<BlogCategory[]>(
    initial?.activityTypes ?? []
  );
  const needScopes = !initial?.scopes?.length;
  const needActivityTypes = !initial?.activityTypes?.length;

  useEffect(() => {
    let alive = true;
    if (needScopes) {
      once(() => scopesPromise, (p) => (scopesPromise = p), getAllScopes)
        .then((list) => alive && setScopes(list))
        .catch(() => undefined);
    }
    if (needActivityTypes) {
      once(
        () => activityTypesPromise,
        (p) => (activityTypesPromise = p),
        getAllActivityTypes
      )
        .then((list) => alive && setActivityTypes(list))
        .catch(() => undefined);
    }
    return () => {
      alive = false;
    };
  }, [needScopes, needActivityTypes]);

  return { scopes, activityTypes };
}

/** Subtipos de un tipo de actividad (en caché por id) */
export function useSubtypes(activityTypeId?: string) {
  const [state, setState] = useState<{
    forId?: string;
    subtypes: BlogCategory[];
    error: boolean;
  }>({ subtypes: [], error: false });

  useEffect(() => {
    if (!activityTypeId) return;
    let alive = true;
    once(
      () => subtypesPromises.get(activityTypeId) ?? null,
      (p) =>
        p
          ? subtypesPromises.set(activityTypeId, p)
          : subtypesPromises.delete(activityTypeId),
      () => getSubtypesByActivityType(activityTypeId)
    )
      .then((list) => {
        if (alive) setState({ forId: activityTypeId, subtypes: list, error: false });
      })
      .catch(() => {
        if (alive) setState({ forId: activityTypeId, subtypes: [], error: true });
      });
    return () => {
      alive = false;
    };
  }, [activityTypeId]);

  const ready = !!activityTypeId && state.forId === activityTypeId;
  return {
    subtypes: ready ? state.subtypes : [],
    loading: !!activityTypeId && !ready,
    error: ready && state.error,
  };
}
