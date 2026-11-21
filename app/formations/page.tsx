import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

async function ListeFormations() {
  await connection();

  const programmes = await prisma.formation.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="formationsList">
      {programmes.length === 0 ? (
        <p>Aucune formation enregistrée.</p>
      ) : (
        programmes.map((programme) => (
          <article
            key={programme.id}
            className="formationCard"
          >
            <h2 className="formationTitle">
              {programme.nom}
            </h2>

            <p className="formationDescription">
              {programme.description}
            </p>

            <button className="formationButton">
              En savoir plus
            </button>
          </article>
        ))
      )}
    </div>
  );
}

export default function Formations() {
  return (
    <section className="formationsPage">
      <h1 className="formationsTitle">
        Nos formations
      </h1>

      <p className="formationsDescription">
        Découvrez les programmes offerts par notre collège.
      </p>

      <Suspense fallback={<p>Chargement des formations...</p>}>
        <ListeFormations />
      </Suspense>
    </section>
  );
}