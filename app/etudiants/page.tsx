
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function Etudiants() {
  // Demande à Next.js de générer cette page à chaque requête
  await connection();

  // Récupération des étudiants et de leurs formations dans TiDB
  const etudiants = await prisma.etudiant.findMany({
    include: {
      formations: true,
    },
  });

  return (
    <section className="studentsPage">

      <h1 className="studentsTitle">
        Nos étudiants
      </h1>

      <p className="studentsDescription">
        Voici quelques étudiants inscrits au Collège ABC.
      </p>

      <div className="studentsCards">

        {etudiants.map((etudiant) => (
          <div
            className="studentCard"
            key={etudiant.id}
          >

            <div className="studentAvatar">
              {etudiant.nom.charAt(0)}
            </div>

            <h2>{etudiant.nom}</h2>

            <p>
              Programme :
              <strong> {etudiant.nomProgramme}</strong>
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}
