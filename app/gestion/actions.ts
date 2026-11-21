
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================
// FORMATIONS
// ==========================

export async function createFormation(formData: FormData) {
  const nom = String(formData.get("nomFormation") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!nom || !description) return;

  await prisma.formation.create({
    data: {
      nom,
      description,
    },
  });

  revalidatePath("/gestion");
  revalidatePath("/formations");
}

export async function updateFormation(id: number, formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!nom || !description) return;

  await prisma.formation.update({
    where: { id },
    data: {
      nom,
      description,
    },
  });

  revalidatePath("/gestion");
  revalidatePath("/formations");
}

export async function deleteFormation(id: number) {
  await prisma.$transaction([
    prisma.cours.deleteMany({
      where: { formationId: id },
    }),
    prisma.formation.delete({
      where: { id },
    }),
  ]);

  revalidatePath("/gestion");
  revalidatePath("/formations");
}

// ==========================
// COURS
// ==========================

export async function createCours(formData: FormData) {
  const titre = String(formData.get("titre") ?? "").trim();
  const formationId = Number(formData.get("formationId"));

  if (!titre || !Number.isInteger(formationId) || formationId <= 0) return;

  await prisma.cours.create({
    data: {
      titre,
      formationId,
    },
  });

  revalidatePath("/gestion");
}

export async function updateCours(id: number, formData: FormData) {
  const titre = String(formData.get("titre") ?? "").trim();
  const formationId = Number(formData.get("formationId"));

  if (!titre || !Number.isInteger(formationId) || formationId <= 0) return;

  await prisma.cours.update({
    where: { id },
    data: {
      titre,
      formationId,
    },
  });

  revalidatePath("/gestion");
}

export async function deleteCours(id: number) {
  await prisma.cours.delete({
    where: { id },
  });

  revalidatePath("/gestion");
}

// ==========================
// ETUDIANTS
// ==========================

export async function createEtudiant(formData: FormData) {
  const nom = String(formData.get("nomEtudiant") ?? "").trim();
  const nomProgramme = String(formData.get("nomProgramme") ?? "").trim();

  const formationsIds = formData
    .getAll("formations")
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);

  if (!nom || !nomProgramme) return;

  await prisma.etudiant.create({
    data: {
      nom,
      nomProgramme,
      formations: {
        connect: formationsIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/gestion");
  revalidatePath("/etudiants");
}

export async function updateEtudiant(id: number, formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const nomProgramme = String(formData.get("nomProgramme") ?? "").trim();

  const formationsIds = formData
    .getAll("formations")
    .map(Number)
    .filter((formationId) => Number.isInteger(formationId) && formationId > 0);

  if (!nom || !nomProgramme) return;

  await prisma.etudiant.update({
    where: { id },
    data: {
      nom,
      nomProgramme,
      formations: {
        set: formationsIds.map((formationId) => ({
          id: formationId,
        })),
      },
    },
  });

  revalidatePath("/gestion");
  revalidatePath("/etudiants");
}

export async function deleteEtudiant(id: number) {
  await prisma.$transaction([
    prisma.profil.deleteMany({
      where: { etudiantId: id },
    }),
    prisma.etudiant.delete({
      where: { id },
    }),
  ]);

  revalidatePath("/gestion");
  revalidatePath("/etudiants");
}

// ==========================
// PROFILS
// ==========================

export async function createProfil(formData: FormData) {
  const etudiantId = Number(formData.get("etudiantId"));
  const bio = String(formData.get("bio") ?? "").trim();

  if (!Number.isInteger(etudiantId) || etudiantId <= 0) return;

  await prisma.profil.create({
    data: {
      bio,
      etudiantId,
    },
  });

  revalidatePath("/gestion");
}

export async function updateProfil(etudiantId: number, formData: FormData) {
  const bio = String(formData.get("bio") ?? "").trim();

  await prisma.profil.update({
    where: { etudiantId },
    data: {
      bio,
    },
  });

  revalidatePath("/gestion");
}

export async function deleteProfil(etudiantId: number) {
  await prisma.profil.delete({
    where: { etudiantId },
  });

  revalidatePath("/gestion");
}
