"use server";
 
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
 
// ==========================
// FORMATIONS
// ==========================
 
export async function createFormation(formData: FormData) {
  // Le champ s'appelle "nomFormation" dans le formulaire de création
  const nom = String(formData.get("nomFormation") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
 
  if (!nom || !description) {
    return;
  }
 
  await prisma.formation.create({
    data: {
      nom,
      description,
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function updateFormation(
  id: number,
  formData: FormData
) {
  // Le champ s'appelle "nom" dans le formulaire de modification
  const nom = String(formData.get("nom") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
 
  if (!nom || !description) {
    return;
  }
 
  await prisma.formation.update({
    where: {
      id,
    },
    data: {
      nom,
      description,
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function deleteFormation(id: number) {
  // On supprime d'abord les cours de la formation (relation 1:n),
  // sinon la clé étrangère bloque la suppression.
  // La table de jointure de la relation n:n est gérée par Prisma.
  await prisma.$transaction([
    prisma.cours.deleteMany({
      where: {
        formationId: id,
      },
    }),
    prisma.formation.delete({
      where: {
        id,
      },
    }),
  ]);
 
  revalidatePath("/gestion");
}
 
// ==========================
// COURS (1:n)
// ==========================
 
export async function createCours(formData: FormData) {
  const titre = String(formData.get("titre") ?? "").trim();
  const formationId = Number(formData.get("formationId"));
 
  if (!titre || !formationId) {
    return;
  }
 
  await prisma.cours.create({
    data: {
      titre,
      formationId,
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function updateCours(
  id: number,
  formData: FormData
) {
  const titre = String(formData.get("titre") ?? "").trim();
  const formationId = Number(formData.get("formationId"));
 
  if (!titre || !formationId) {
    return;
  }
 
  await prisma.cours.update({
    where: {
      id,
    },
    data: {
      titre,
      formationId,
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function deleteCours(id: number) {
  await prisma.cours.delete({
    where: {
      id,
    },
  });
 
  revalidatePath("/gestion");
}
 
// ==========================
// ETUDIANTS (n:n avec formations)
// ==========================
 
export async function createEtudiant(formData: FormData) {
  const nom = String(formData.get("nomEtudiant") ?? "").trim();
 
  // select multiple : on récupère toutes les valeurs cochées
  const formationsIds = formData
    .getAll("formations")
    .map(Number)
    .filter((id) => !Number.isNaN(id));
 
  if (!nom) {
    return;
  }
 
  await prisma.etudiant.create({
    data: {
      nom,
      formations: {
        connect: formationsIds.map((id) => ({ id })),
      },
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function updateEtudiant(
  id: number,
  formData: FormData
) {
  const nom = String(formData.get("nom") ?? "").trim();
 
  const formationsIds = formData
    .getAll("formations")
    .map(Number)
    .filter((formationId) => !Number.isNaN(formationId));
 
  if (!nom) {
    return;
  }
 
  await prisma.etudiant.update({
    where: {
      id,
    },
    data: {
      nom,
      // "set" remplace toutes les formations liées par la nouvelle sélection
      formations: {
        set: formationsIds.map((formationId) => ({
          id: formationId,
        })),
      },
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function deleteEtudiant(id: number) {
  // On supprime d'abord le profil (relation 1:1),
  // sinon la clé étrangère bloque la suppression.
  await prisma.$transaction([
    prisma.profil.deleteMany({
      where: {
        etudiantId: id,
      },
    }),
    prisma.etudiant.delete({
      where: {
        id,
      },
    }),
  ]);
 
  revalidatePath("/gestion");
}
 
// ==========================
// PROFILS (1:1 avec étudiant)
// ==========================
 
export async function createProfil(formData: FormData) {
  const etudiantId = Number(formData.get("etudiantId"));
  const bio = String(formData.get("bio") ?? "").trim();
 
  if (!etudiantId) {
    return;
  }
 
  await prisma.profil.create({
    data: {
      bio,
      etudiantId,
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function updateProfil(
  etudiantId: number,
  formData: FormData
) {
  const bio = String(formData.get("bio") ?? "").trim();
 
  await prisma.profil.update({
    where: {
      etudiantId,
    },
    data: {
      bio,
    },
  });
 
  revalidatePath("/gestion");
}
 
export async function deleteProfil(etudiantId: number) {
  await prisma.profil.delete({
    where: {
      etudiantId,
    },
  });
 
  revalidatePath("/gestion");
 }