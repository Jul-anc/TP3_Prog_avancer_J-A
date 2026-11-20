import { prisma } from "@/lib/prisma";
import {connection } from "next/server";
import {
  createFormation,
  updateFormation,
  deleteFormation,
  createCours,
  updateCours,
  deleteCours,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
  createProfil,
  updateProfil,
  deleteProfil,
} from "./actions";
 

export default async function GestionPage() {
  
await connection();
  const formations = await prisma.formation.findMany({
    include: { cours: true, etudiants: true },
    orderBy: { id: "desc" },
  });
 
  const etudiants = await prisma.etudiant.findMany({
    include: { profil: true, formations: true },
    orderBy: { id: "desc" },
  });
 
  return (
    <main>
      <h1 className="text-center text-3xl font-bold">Gestion des formations</h1>
 
      {/* ================= CREATE FORMATION ================= */}
      <section>
        <h2 className=" text-3xl font-bold mb">Ajouter une formation</h2>
 
        <form action={createFormation}>
          <div>
            <label htmlFor="nomFormation">Nom</label>
            <input
              id="nomFormation"
              name="nomFormation"
              type="text"
              placeholder="Nom de la formation"
              required
            />
          </div>
 
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              required
            />
          </div>
 
          <button type="submit">Ajouter la formation</button>
        </form>
      </section>
 
      {/* ================= CREATE COURS (1:n) ================= */}
      <section>
        <h2>Ajouter un cours</h2>
 
        <form action={createCours}>
          <div>
            <label htmlFor="titre">Titre du cours</label>
            <input id="titre" name="titre" type="text" required />
          </div>
 
          <div>
            <label htmlFor="formationId">Formation</label>
            <select id="formationId" name="formationId" required>
              <option value="">Choisir une formation</option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.nom}
                </option>
              ))}
            </select>
          </div>
 
          <button type="submit">Ajouter le cours</button>
        </form>
      </section>
 
      {/* ================= CREATE ETUDIANT (n:n) ================= */}
      <section>
        <h2>Ajouter un étudiant</h2>
 
        <form action={createEtudiant}>
          <div>
            <label htmlFor="nomEtudiant">Nom</label>
            <input
              id="nomEtudiant"
              name="nomEtudiant"
              type="text"
              required
            />
          </div>
 
          <div>
            <label htmlFor="formations">Formations</label>
            <select id="formations" name="formations" multiple>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.nom}
                </option>
              ))}
            </select>
          </div>
 
          <button type="submit">Ajouter l'étudiant</button>
        </form>
      </section>
 
      {/* ================= CREATE PROFIL (1:1) ================= */}
      <section>
        <h2>Ajouter un profil</h2>
 
        <form action={createProfil}>
          <div>
            <label htmlFor="etudiantId">Étudiant</label>
            <select id="etudiantId" name="etudiantId" required>
              <option value="">Choisir un étudiant</option>
              {etudiants
                .filter((etudiant) => !etudiant.profil)
                .map((etudiant) => (
                  <option key={etudiant.id} value={etudiant.id}>
                    {etudiant.nom}
                  </option>
                ))}
            </select>
          </div>
 
          <div>
            <label htmlFor="bio">Biographie</label>
            <textarea id="bio" name="bio" />
          </div>
 
          <button type="submit">Ajouter le profil</button>
        </form>
      </section>
 
      {/* ================= FORMATIONS : READ + UPDATE + DELETE ================= */}
      <section>
        <h2>Formations enregistrées</h2>
 
        {formations.length === 0 ? (
          <p>Aucune formation enregistrée.</p>
        ) : (
          formations.map((formation) => {
            const updateFormationAction = updateFormation.bind(
              null,
              formation.id
            );
            const deleteFormationAction = deleteFormation.bind(
              null,
              formation.id
            );
 
            return (
              <article key={formation.id}  className="max-w-sm p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-center text-3xl font-bold">{formation.nom}</h3>
                <p className="text-lg font-bold">{formation.description}</p>
 
                {/* UPDATE FORMATION */}
                <form action={updateFormationAction}>
                  <div>
                    <label>Nom</label>
                    <input
                      type="text"
                      name="nom"
                      defaultValue={formation.nom}
                      required
                    />
                  </div>
 
                  <div>
                    <label>Description</label>
                    <textarea
                      name="description"
                      defaultValue={formation.description ?? ""}
                      required
                    />
                  </div>
 
                  <button type="submit" className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full">Modifier la formation</button>
                </form>
 
                {/* DELETE FORMATION */}
                <form action={deleteFormationAction}>
                  <button type="submit" className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full">Supprimer la formation</button>
                </form>
 
                {/* ---------- COURS (1:n) ---------- */}
                <h4>Cours</h4>
 
                {formation.cours.length === 0 ? (
                  <p>Aucun cours.</p>
                ) : (
                  <ul>
                    {formation.cours.map((cours) => {
                      const updateCoursAction = updateCours.bind(
                        null,
                        cours.id
                      );
                      const deleteCoursAction = deleteCours.bind(
                        null,
                        cours.id
                      );
 
                      return (
                        <li key={cours.id}>
                          {/* UPDATE COURS */}
                          <form action={updateCoursAction}>
                            <input
                              type="text"
                              name="titre"
                              defaultValue={cours.titre}
                              required
                            />
 
                            <select
                              name="formationId"
                              defaultValue={String(cours.formationId)}
                              required
                            >
                              {formations.map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.nom}
                                </option>
                              ))}
                            </select>
 
                            <button type="submit">Modifier</button>
                          </form>
 
                          {/* DELETE COURS */}
                          <form action={deleteCoursAction}>
                            <button type="submit">Supprimer</button>
                          </form>
                        </li>
                      );
                    })}
                  </ul>
                )}
 
                {/* ---------- ETUDIANTS INSCRITS (n:n) ---------- */}
                <h4>Étudiants inscrits</h4>
 
                {formation.etudiants.length === 0 ? (
                  <p>Aucun étudiant.</p>
                ) : (
                  <ul>
                    {formation.etudiants.map((etudiant) => (
                      <li key={etudiant.id}>{etudiant.nom}</li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })
        )}
      </section>
 
      {/* ================= ETUDIANTS : READ + UPDATE + DELETE ================= */}
      <section>
        <h2>Étudiants</h2>
 
        {etudiants.length === 0 ? (
          <p>Aucun étudiant.</p>
        ) : (
          etudiants.map((etudiant) => {
            const updateEtudiantAction = updateEtudiant.bind(
              null,
              etudiant.id
            );
            const deleteEtudiantAction = deleteEtudiant.bind(
              null,
              etudiant.id
            );
            const updateProfilAction = updateProfil.bind(null, etudiant.id);
            const deleteProfilAction = deleteProfil.bind(null, etudiant.id);
 
            const formationsIds = etudiant.formations.map((f) =>
              String(f.id)
            );
 
            return (
              <article key={etudiant.id}>
                <h3>{etudiant.nom}</h3>
 
                {/* UPDATE ETUDIANT (nom + formations n:n) */}
                <form action={updateEtudiantAction}>
                  <div>
                    <label>Nom</label>
                    <input
                      type="text"
                      name="nom"
                      defaultValue={etudiant.nom}
                      required
                    />
                  </div>
 
                  <div>
                    <label>Formations</label>
                    <select
                      name="formations"
                      multiple
                      defaultValue={formationsIds}
                    >
                      {formations.map((formation) => (
                        <option key={formation.id} value={formation.id}>
                          {formation.nom}
                        </option>
                      ))}
                    </select>
                  </div>
 
                  <button type="submit">Modifier l'étudiant</button>
                </form>
 
                {/* DELETE ETUDIANT */}
                <form action={deleteEtudiantAction}>
                  <button type="submit">Supprimer l'étudiant</button>
                </form>
 
                {/* ---------- PROFIL (1:1) ---------- */}
                <h4>Profil</h4>
 
                {etudiant.profil ? (
                  <>
                    {/* UPDATE PROFIL */}
                    <form action={updateProfilAction}>
                      <textarea
                        name="bio"
                        defaultValue={etudiant.profil.bio ?? ""}
                      />
                      <button type="submit">Modifier le profil</button>
                    </form>
 
                    {/* DELETE PROFIL */}
                    <form action={deleteProfilAction}>
                      <button type="submit">Supprimer le profil</button>
                    </form>
                  </>
                ) : (
                  <p>Aucun profil.</p>
                )}
 
                {/* ---------- FORMATIONS SUIVIES (n:n) ---------- */}
                <h4>Formations suivies</h4>
 
                {etudiant.formations.length === 0 ? (
                  <p>Aucune formation.</p>
                ) : (
                  <ul>
                    {etudiant.formations.map((formation) => (
                      <li key={formation.id}>{formation.nom}</li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}