
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

async function ListeEtudiants() {
  await connection();

  const etudiants = await prisma.etudiant.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="studentsCards">
      {etudiants.length === 0 ? (
        <p>Aucun étudiant enregistré.</p>
      ) : (
        etudiants.map((etudiant) => (
          <div className="studentCard" key={etudiant.id}>
            <div className="studentAvatar">
              {etudiant.nom.charAt(0)}
            </div>

            <h2>{etudiant.nom}</h2>

            <p>
              Programme : <strong>{etudiant.nomProgramme}</strong>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default function Etudiants() {
  return (
    <section className="studentsPage">
      <h1 className="studentsTitle">Nos étudiants</h1>

      <p className="studentsDescription">
        Voici quelques étudiants inscrits au Collège ABC.
      </p>

      <Suspense fallback={<p>Chargement des étudiants...</p>}>
        <ListeEtudiants />
      </Suspense>
    </section>
  );
}
